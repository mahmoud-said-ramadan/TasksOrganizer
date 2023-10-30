import taskModel from "../../../../DB/Models/Task.model.js";
import ErrorClass from "../../../utils/errorClass.js";
import { StatusCodes } from "http-status-codes";



export const archivedTasks = async (req, res, next) => {
  const { taskId } = req.params;
  const isTask = await taskModel.findById(taskId);
  if (!isTask) {
    return next(new ErrorClass("Task Not Found"), StatusCodes.NOT_FOUND);
  }
  if (isTask.isArchived) {
    return next(new ErrorClass("Task Already Archived"), StatusCodes.BAD_REQUEST);
  }
  isTask.isArchived = true
  isTask.history = `Task Archived by ${req.user.name} ${req.user._id} `,
  await isTask.save()
  return res.status(StatusCodes.CREATED).json({ message: "Task Archived successfully.", isTask });

};
