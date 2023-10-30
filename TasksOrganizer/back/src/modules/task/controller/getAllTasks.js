import taskModel from "../../../../DB/Models/Task.model.js";
import listModel from "../DB/models/List.model.js";

export const getAllTasks = async (req, res, next) => {
  const { listId } = req.params;
  // Find list
  const list = await listModel.findById(listId);
  if (!list) {
    return next(new ErrorClass("List not found"), StatusCodes.NOT_FOUND);
  }
  // Find tasks
  const Tasks = taskModel.find({ listId }).populate({ path: "subtasks", select: "title assignedTo" });
  if (!Tasks) {
    return next(new ErrorClass("Tasks not found"), StatusCodes.NOT_FOUND);
  }
  return res.status(StatusCodes.OK).json({ message: "Done", Tasks });
};
