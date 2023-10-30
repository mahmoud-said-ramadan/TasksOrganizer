import { nanoid } from "nanoid";
import cloudinary from "../cloudinary.js";
import ErrorClass from "../errorClass.js";
import listModel from "../../../DB/Models/List.model.js";

export const getDoc = (model, type) => {
  return async (req, res, next) => {
    const { id } = req.body;
    const populate = [
      { path: "members", select: "name email" },
      { path: "createdBy", select: "name email" },
    ];
    let customPopulate;
    if (type === "workspace") {
      customPopulate = { path: "boards", select: "title" };
    } else {
      customPopulate = {
        path: "lists",
        select: "title tasks",
        populate: { path: "tasks", select: "title coverImage assignedTo" },
      };
    }
    let docExist;
    if (id) {
      docExist = await model
        .findById(id)
        .populate(populate)
        .populate(customPopulate);
    } else {
      docExist = await model.find().populate(populate).populate(customPopulate);
    }
    if (!docExist) {
      return next(new ErrorClass(`${model.modelName} Not Found`, 404));
    }
    return res.status(202).json({ message: "Done!", docExist });
  };
};

export const createDoc = (model) => {
  return async (req, res, next) => {
    req.body.customId = nanoid();
    //upload coverImages
    if (req.files?.coverImages) {
      const coverImages = [];
      for (const file of req.files.coverImages) {
        console.log(file);
        const { public_id, secure_url } = await cloudinary.uploader.upload(
          file.path,
          {
            folder: `${process.env.FOLDER_CLOUD_NAME}/coverImage/${req.body.customId}`,
          }
        );
        coverImages.push({ secure_url, public_id });
      }
      req.body.coverImages = coverImages;
    }
    req.body.createdBy = req.user._id;
    const created = await model.create(req.body);
    if (!created) {
      return next(new ErrorClass(`Fail To Create ${model.modelName}!`, 500));
    }
    return res.status(201).json({ message: "Done!", created });
  };
};

export const updateDoc = (model) => {
  return async (req, res, next) => {
    const { id } = req.params;
    console.log({ userId: req.user._id, workspaceId: id });
    const isExist = await model.findOne({ _id: id, createdBy: req.user._id });
    if (!isExist) {
      return next(new ErrorClass(`This ${model.modelName} Is NOT Exist!`, 404));
    }
    if (req.files?.coverImages) {
      console.log(req.files.coverImages);
      //destroy old coverImages
      for (const file of isExist?.coverImages) {
        await cloudinary.uploader.destroy(file.public_id);
        isExist.coverImages.shift();
      }
      //upload new coverImages
      const coverImages = [];
      for (const file of req.files.coverImages) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(
          file.path,
          {
            folder: `${process.env.FOLDER_CLOUD_NAME}/coverImage/${isExist.customId}`,
          }
        );
        coverImages.push({ secure_url, public_id });
      }
      req.body.coverImages = coverImages;
    }
    const updated = await model.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return next(new ErrorClass(`Fail To update ${model.modelName}!`, 500));
    }
    return res.status(202).json({ message: "Done!", updated });
  };
};
