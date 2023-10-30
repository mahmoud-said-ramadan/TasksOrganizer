import boardModel from "../../../../DB/Models/Board.model.js";
import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import listModel from "../../../../DB/Models/List.model.js";
import taskModel from "../../../../DB/Models/Task.model.js";

export const deleteList = async (req, res, next) => {
  const { boardId, listId } = req.params;
  //find board
  const board = await boardModel.findOne({ boardId });
  if (!board) {
    return next(new ErrorClass("board not found"), StatusCodes.NOT_FOUND);
  }
  //if user include in this board ( members in board model )
  if (board.members.includes(req.user._id)) {
    return next(
      new ErrorClass("UNAUTHORIZED to delete list"),
      StatusCodes.UNAUTHORIZED
    );
  }
  //delete list
  const list = await listModel.findOneAndDelete({
    boardId,
    createdBy: req.user._id,
  });
  if (!list) {
    return next(
      new ErrorClass("List not deleted or UNAUTHORIZED to delete list"),
      StatusCodes.BAD_REQUEST
    );
  }
  // Find tasks in list
  const tasks = await taskModel.find({ listId });
  if (tasks.length) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].tasks.coverImage) {
      await cloudinary.uploader.destroy(tasks[i].tasks.coverImage.public_id);
      }
      if (tasks[i].tasks.attachment) {
        await cloudinary.uploader.destroy(tasks[i].tasks.attachment.public_id);
      }
    }
  }
  // delete tasks
  const deleteTasks = await taskModel.deleteMany({ listId });
  if (!deleteTasks) {
    return next(
      new ErrorClass("tasks not deleted"),
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  return res.status(StatusCodes.OK).json({ message: "Done", deleteTasks });
};
