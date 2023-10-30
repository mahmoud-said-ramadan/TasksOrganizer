import taskModel from "../../../../DB/Models/Task.model.js";
import listModel from "../DB/models/List.model.js";

export const getTask = async (req, res, next) => {
  const { listId } = req.params;
  // Find list
  const list = await listModel.findById(listId);
  if (!list) {
    return next(new ErrorClass("List not found"), StatusCodes.NOT_FOUND);
  }
  // Find tasks
  const Task = taskModel.findById( listId );
  if (!Task ) {
    return next(new ErrorClass("Task not found"), StatusCodes.NOT_FOUND);
  }
  return res.status(StatusCodes.OK).json({ message: "Done", Task });
};
