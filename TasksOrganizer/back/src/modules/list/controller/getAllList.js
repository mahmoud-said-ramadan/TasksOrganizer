import boardModel from "../../../../DB/Models/Board.model.js";
import listModel from "../../../../DB/Models/List.model.js";
import { StatusCodes } from "http-status-codes";

export const getAllList = async (req, res, next) => {
  const { boardId } = req.params;
  const board = await boardModel.findById(boardId);
  if (!board) {
    return next(new ErrorClass("board not found"), StatusCodes.NOT_FOUND);
  }
if (board.members.includes(req.user._id)) {
  return next(new ErrorClass("UNAUTHORIZED to get list"), StatusCodes.UNAUTHORIZED);
}
  const lists = await listModel.find({ boardId });
  if (!lists) {
    return next(new ErrorClass("Lists not found"), StatusCodes.NOT_FOUND); 
}
return res.status(StatusCodes.OK).json({ message: "Done", lists });
};
