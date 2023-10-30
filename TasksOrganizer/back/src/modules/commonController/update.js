import boardModel from "../../../DB/Models/Board.model.js";
import workspaceModel from "../../../DB/models/workspace.model.js";
import { asyncErrorHandler } from "../../utils/errorHandling.js";
import { updateDoc } from "../../utils/handlers/get-create-update.js";

export const update = asyncErrorHandler(async (req, res, next) => {
  if (req.originalUrl.includes("workspace")) {
    updateDoc(workspaceModel)(req, res, next);
  } else if (req.originalUrl.includes("board")) {
    updateDoc(boardModel)(req, res, next);
  }
  else {
    return next(new ErrorClass(`In-Valid!`, 500));
  }
});
