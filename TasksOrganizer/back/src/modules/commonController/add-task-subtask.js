import subTaskModel from "../../../DB/Models/SubTask.model.js";
import taskModel from "../../../DB/Models/Task.model.js";
import { asyncErrorHandler } from "../../utils/errorHandling.js";
import { add, taskType } from "../../utils/handlers/add-task-subtask.js";

const addTask_SubtaskController = asyncErrorHandler(async (req, res, next) => {
  if (req.originalUrl.includes("subtask"))
    add(subTaskModel, taskType.subtask)(req, res, next);
  else add(taskModel, taskType.task)(req, res, next);
});
export default addTask_SubtaskController;
