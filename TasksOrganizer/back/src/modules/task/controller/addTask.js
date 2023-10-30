import { nanoid } from "nanoid";
import listModel from "../../../../DB/Models/List.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import taskModel from "../../../../DB/Models/Task.model.js";
import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";



export const addTask = async (req, res, next) => {
  const { title, description, deadline, listId,userIds } = req.body;
  const isList = await listModel.findById(listId)
  if (!isList) {
    return next(new ErrorClass("List Not Found"), StatusCodes.NOT_FOUND);
  }
  let coverImageContent = null
  if (req.file?.coverImage) {
    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file?.path,
      {
        folder: `internship/task/${customId}/coverImage`
      }
    );
    coverImageContent = { secure_url, public_id };
  }
  let attachmentContent = null
  if (req.file?.attachment) {
    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file?.path,
      {
        folder: `internship/task/${customId}/attachment`
      }
    );
    attachmentContent = { secure_url, public_id };
  }
  let assignedTo = [];
    if (Array.isArray(userIds)) {
      assignedTo = userIds;
    } else {
      assignedTo = [userIds];
    }
  const task =  await taskModel.create({
    attachment:attachmentContent,
    coverImage:coverImageContent,
    deadline,
    description,
    title,
    history:`Task added by ${req.user.name} ${req.user._id} `,
    assignedTo,
    createdBy:req.user._id
  })

  return res.status(StatusCodes.CREATED).json({ message: "Task created successfully.", task });
}
