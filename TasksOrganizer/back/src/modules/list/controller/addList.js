import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import listModel from "../../../../DB/Models/List.model.js";
import boardModel from "../../../../DB/Models/Board.model.js";

export const addList = async (req, res, next) => {
const { title , boardId } = req.body
//find board
const board = await boardModel.findById(boardId)
if (!board) {
    return next(new ErrorClass("board not found"), StatusCodes.NOT_FOUND);
}
//if user include in this board ( members in board model )
console.log(board);
if (board.members.includes(req.user._id)) {
    return next(new ErrorClass("UNAUTHORIZED to add list"), StatusCodes.UNAUTHORIZED);
}
//create list 
const list = await listModel.create({
    title,
    boardId,
    createdBy: req.user._id
})
if (!list) {
    return next(new ErrorClass("List not created"), StatusCodes.INTERNAL_SERVER_ERROR); 
}
return res.status(StatusCodes.CREATED).json({ message: "Done", list });
}




