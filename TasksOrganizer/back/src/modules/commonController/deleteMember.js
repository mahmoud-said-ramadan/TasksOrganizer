import boardModel from "../../../DB/Models/Board.model.js";
import workspaceModel from "../../../DB/models/workspace.model.js";
import { asyncErrorHandler } from "../../utils/errorHandling.js";
import { deleteMember, types } from "../../utils/handlers/add_delete-member.js";

const deleteMemberController = asyncErrorHandler(async (req, res, next) => {
  if (req.originalUrl.includes("workspace"))
    deleteMember(workspaceModel, types.workspace)(req, res, next);
  else deleteMember(boardModel, types.board)(req, res, next);
});

export default deleteMemberController;
