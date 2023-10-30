import taskModel from "../../../../DB/Models/Task.model.js";
import subTaskModel from "../../../../DB/Models/SubTask.model.js";
import ErrorClass from "../../../utils/errorClass.js";
import { StatusCodes } from "http-status-codes";

export const deleteSubTask = async (req, res, next) => {
  const { taskId , subtaskId} = req.params;
  // Find task
  const task = await taskModel.findById(taskId);
  if (!task) {
    return next(new ErrorClass("Task not found"), StatusCodes.NOT_FOUND);
  }
  // Check if a user assignedTo to this task
  if (task.assignedTo.length >= 1) {
    const isAssignToTask = task.assignedTo.includes(req.user._id);
    if (!isAssignToTask) {
      return next(
        new ErrorClass(
          "UNAUTHORIZED you are not assign it to this task to delete"
        ),
        StatusCodes.UNAUTHORIZED
      );
    }
  }
  // Find subtask
  const subTask = subTaskModel.findOne({_id: subtaskId , taskId});
  // check if user is assign to the subtask
  const isAssign = subTask.assignedTo.includes(req.user._id);
  if (!isAssign) {
    return next(
      new ErrorClass(
        "UNAUTHORIZED you are not assign it to this task to delete"
      ),
      StatusCodes.UNAUTHORIZED
    );
  }
  // Should subtask completed
  if (subTask.status.enum == "unCompleted") {
    return next(
      new ErrorClass("You cannot delete before subtasks completed"),
      StatusCodes.UNAUTHORIZED
    );
  }
    // Delete subtask attachment from cloudinary
    if (subTask.attachment.public_id) {
      await cloudinary.uploader.destroy(subTask.attachment.public_id);
    }
  // Delete subtask
  const deleted = subTaskModel.deleteOne({
    _id: subtaskId,
    taskId
  });
  if (!deleted) {
    return next(
      new ErrorClass("subtask not deleted"),
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  return res.status(StatusCodes.OK).json({ message: "Done", subtask: deleted });
  
};
