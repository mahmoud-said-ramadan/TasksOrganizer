import subTaskModel from "../../../DB/Models/SubTask.model.js";
import taskModel from "../../../DB/Models/Task.model.js";
import { asyncErrorHandler } from "../../utils/errorHandling.js";
import { taskType, update } from "../../utils/handlers/update-task-subtask.js";

const updateTask_SubtaskController = asyncErrorHandler(
  async (req, res, next) => {
    if (req.originalUrl.includes("subtask"))
      update(subTaskModel, taskType.subtask)(req, res, next);
    else update(taskModel, taskType.task)(req, res, next);
  }
);
export default updateTask_SubtaskController;
