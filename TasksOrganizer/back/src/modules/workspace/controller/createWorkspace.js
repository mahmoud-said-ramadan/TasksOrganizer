import userModel from "../../../../DB/models/user.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import workspaceModel from "../../../../DB/Models/workspace.model.js";
import { nanoid } from "nanoid";

export const createWorkspace = async (req, res, next) => {
  const { description, title ,visability } = req.body;
  const isUser = await userModel.findById(req.user._id);
  if (!isUser) {
    return next(new ErrorClass(`User not found`, StatusCodes.NOT_FOUND));
  }
  //upload cover pic
  if (req.files?.coverImages) {
    const customId = nanoid(5)
    const CoverImages = [];
    for (const file of req.files) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        { folder: `${process.env.FOLDER_CLOUD_NAME}/${customId}/coverImage` }
      );
     CoverImages.push({ secure_url, public_id });
    }
  }
    // create the workspace
    const workspace = await workspaceModel.create({
        description,
        title,
        visability,
        customId,
        createdBy:req.user._id,
        coverImages:coverImages
    })
    return res.status(StatusCodes.ACCEPTED).json({ message: `Workspace Created Successfully`, workspace });
};
