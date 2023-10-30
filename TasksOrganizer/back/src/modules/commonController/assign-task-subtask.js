import taskModel from "../../../DB/Models/Task.model.js";
import subTaskModel from "../../../DB/Models/SubTask.model.js";
import { asyncErrorHandler } from "../../utils/errorHandling.js";
import { assignTo, taskType } from "../../utils/handlers/assign-task-subtask.js";

const assignedToController = asyncErrorHandler(async (req, res, next) => {
  if (req.originalUrl.includes("subtask"))
  assignTo(subTaskModel, taskType.subtask)(req, res, next);
  else assignTo(taskModel, taskType.task)(req, res, next);
});
export default assignedToController;
