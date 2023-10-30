import taskModel from "../../../DB/Models/Task.model.js";
import { asyncErrorHandler } from "../../utils/errorHandling.js";
import { archive, types } from "../../utils/handlers/archive.js";

const archiveController = asyncErrorHandler(async (req, res, next) => {
  if (req.originalUrl.includes("task"))
  archive(taskModel, types.task)(req, res, next);
});
export default archiveController;
