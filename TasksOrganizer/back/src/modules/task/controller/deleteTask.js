import taskModel from "../../../../DB/Models/Task.model.js";
import listModel from "../../../../DB/Models/List.model.js";
import subTaskModel from "../../../../DB/Models/SubTask.model.js";
import ErrorClass from "../../../utils/errorClass.js";
import { StatusCodes } from "http-status-codes";

export const deleteTask = async (req, res, next) => {
  const { listId, taskId } = req.params;
  // Find list
  const list = await listModel.findById(listId);
  if (!list) {
    return next(new ErrorClass("List not found"), StatusCodes.NOT_FOUND);
  }
  // Find task
  const task = await taskModel.findById(taskId);
  if (!task) {
    return next(new ErrorClass("Task not found"), StatusCodes.NOT_FOUND);
  }
  // Check if a user has created the task
  if (!task.createdBy == req.user._id) {
    return next(
      new ErrorClass("UNAUTHORIZED to delete task"),
      StatusCodes.UNAUTHORIZED
    );
  }
  // Cannot delete the task without add it to archive
  if (!task.isArchived) {
    return next(
      new ErrorClass("Task not Archived to delete"),
      StatusCodes.BAD_REQUEST
    );
  }
  // Delete cover image task from cloudinary
  if (task.coverImage) {
    await cloudinary.uploader.destroy(task.coverImage.public_id);
  }
  // Delete attachment task from cloudinary
  if (task.attachment) {
    await cloudinary.uploader.destroy(task.coverImage.public_id);
  }
  // Find subtasks
  const subTasks = taskModel.find({ taskId });
  if (subTasks.length) {
    // delete attachment of subtasks from cloudinary
    for (const ele of subTasks) {
      // Should all subtasks completed
      if (ele.status.enum == "unCompleted") {
        return next(
          new ErrorClass("You cannot delete before subtasks completed"),
          StatusCodes.UNAUTHORIZED
        );
      }
      // Delete all subtasks attachments from cloudinary
      for (let i = 0; i < subTasks.length; i++) {
        await cloudinary.uploader.destroy(
          subTasks[i].tasks.attachment.public_id
        );
      }
    }
    // Delete subtasks
    await subTaskModel.deleteMany({ taskId });
  }
  // Delete task
  const deleteTask = taskModel.deleteOne({
    _id: taskId,
    createdBy: req.user._id,
    listId,
  });
  if (!deleteTask) {
    return next(
      new ErrorClass("task not deleted"),
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  return res.status(StatusCodes.OK).json({ message: "Done", task });
};

