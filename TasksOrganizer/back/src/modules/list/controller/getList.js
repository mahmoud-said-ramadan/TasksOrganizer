import boardModel from "../../../../DB/Models/Board.model.js";
import listModel from "../../../../DB/Models/List.model.js";
import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";

export const getList = async (req, res, next) => {
  const { boardId, listId } = req.params;
  const board = await boardModel.findById(boardId);
  console.log("here");
  if (!board) {
    return next(new ErrorClass("board not found"), StatusCodes.NOT_FOUND);
  }
if (board.members.includes(req.user._id)) {
  return next(new ErrorClass("UNAUTHORIZED to get list"), StatusCodes.UNAUTHORIZED);
}
  const list = await listModel.findOne({ _id: listId, boardId }).populate({ path: "tasks", select: "title assignedTo" });;
  if (!list) {
    return next(new ErrorClass("List not found"), StatusCodes.NOT_FOUND); 
}
return res.status(StatusCodes.OK).json({ message: "Done", list });
};
