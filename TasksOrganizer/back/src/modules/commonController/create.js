import boardModel from "../../../DB/Models/Board.model.js";
import workspaceModel from "../../../DB/models/workspace.model.js";
import ErrorClass from "../../utils/errorClass.js";
import { asyncErrorHandler } from "../../utils/errorHandling.js";
import { createDoc } from "../../utils/handlers/get-create-update.js";

export const create = asyncErrorHandler(async (req, res, next) => {
  if (req.originalUrl.includes("workspace")) {
    createDoc(workspaceModel)(req, res, next);
  } else if (req.originalUrl.includes("board")) {
    createDoc(boardModel)(req, res, next);
  }
  else {
    return next(new ErrorClass(`In-Valid!`, 500));
  }
});
