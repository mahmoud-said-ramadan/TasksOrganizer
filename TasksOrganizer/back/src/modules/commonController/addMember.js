import boardModel from "../../../DB/Models/Board.model.js";
import workspaceModel from "../../../DB/models/workspace.model.js";
import { asyncErrorHandler } from "../../utils/errorHandling.js";
import { addMember, types } from "../../utils/handlers/add_delete-member.js";

const addMemberController = asyncErrorHandler(async (req, res, next) => {
  if (req.originalUrl.includes("workspace"))
    addMember(workspaceModel, types.workspace)(req, res, next);
  else addMember(boardModel, types.board)(req, res, next);
});
export default addMemberController;
