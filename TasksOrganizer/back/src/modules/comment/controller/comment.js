import commentModel from "../../../../DB/Models/comment.model.js";
import taskModel from "../../../../DB/Models/Task.model.js";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";

export const getComment = asyncErrorHandler(async (req, res, next) => {
  const { commentId } = req.body;
  let comment;
  commentId
    ? (comment = await commentModel.findById(commentId))
    : (comment = await commentModel.find());
  if (!comment) {
    return next(new ErrorClass(`Comment Not Found`, 404));
  }
  return res.status(200).json({ message: "Done!", comment });
});

export const createComment = asyncErrorHandler(async (req, res, next) => {
  const { content, taskId } = req.body;
  const task = await taskModel.findById(taskId);
  if (!task) {
    return next(new ErrorClass(`Task Not Found`, 404));
  }
  const comment = await commentModel.create({
    content,
    taskId,
    createdBy: req.user._id,
  });
  return res.status(201).json({ message: "Done!", comment });
});

export const updateComment = asyncErrorHandler(async (req, res, next) => {
  const { content, commentId } = req.body;
  const comment = await commentModel.findOneAndUpdate(
    {
      commentId,
      createdBy: req.user._id,
    },
    content,
    { new: true }
  );
  if (!comment) {
    return next(new ErrorClass(`Comment Not Found`, 404));
  }
  return res.status(202).json({ message: "Done!", comment });
});

export const deleteComment = asyncErrorHandler(async (req, res, next) => {
  const { commentId } = req.body;
  if (
    !(await commentModel.deleteOne({
      commentId,
      createdBy: req.user._id,
    }))
  ) {
    return next(new ErrorClass(`Comment Not Found`, 404));
  }
  return res.status(202).json({ message: "Done!" });
});