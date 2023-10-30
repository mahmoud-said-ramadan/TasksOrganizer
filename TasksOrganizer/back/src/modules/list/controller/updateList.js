import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import boardModel from "../../../../DB/Models/Board.model.js";
import listModel from "../../../../DB/Models/List.model.js";

export const updateList = async (req, res, next) => {
  const { title } = req.body;
  const { boardId, listId } = req.params;
  if (!title) {
    return next(new ErrorClass("You not edit title to update"), StatusCodes.BAD_REQUEST);
  }
  const board = await boardModel.findById(boardId);
  if (!board) {
    return next(new ErrorClass("board not found"), StatusCodes.NOT_FOUND);
  }
  if (board.members.includes(req.user._id)) {
    return next(
      new ErrorClass("UNAUTHORIZED to add list"),
      StatusCodes.UNAUTHORIZED
    );
  }
  const list = await listModel.findOneAndUpdate({
    _id: listId,
    boardId,
    createdBy: req.user._id,
  },{
    title
  },{
    new: true
  });
  if (!list) {
    return next(
      new ErrorClass("List not updated"),
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  return res.status(StatusCodes.OK).json({ message: "Done", list });
};
