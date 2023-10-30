import { nanoid } from "nanoid";
import listModel from "../../../DB/models/List.model.js";
import taskModel from "../../../DB/models/Task.model.js";
import cloudinary from "../cloudinary.js";
import ErrorClass from "../errorClass.js";
import { asyncErrorHandler } from "../errorHandling.js";
import { StatusCodes } from "http-status-codes";

export const taskType = {
  task: "task",
  subtask: "subtask",
};

export const update = (module, type) => {
  return async (req, res, next) => {
    // Check if task/subtask exist in DB or not
    const isModule = await module
      .findById(req.params.id)
      .populate(type == "task" ? "listId" : "taskId");
    if (!isModule) {
      return next(
        new ErrorClass(`${type} doesn't exist`, StatusCodes.NOT_FOUND)
      );
    }

    if (req.user._id != isModule.createdBy.toString()) {
      return next(
        new ErrorClass("You don't have permission", StatusCodes.FORBIDDEN)
      );
    }

    if (type == "task") {
      const list = await isModule.listId.populate("boardId");
      req.body.board = list.boardId;
    }

    if (req.body.assignedTo) {
      // Members of Board/Task
      const members =
        type == "subtask" ? isModule.taskId.assignedTo : req.body.board.members;

      // Check if user exist in (board/subtask) or not
      const isUser = members.includes(req.body.assignedTo);
      if (!isUser) {
        return next(
          new ErrorClass(
            `User must be exist in ${
              type == "task" ? "Board" : "Main Task"
            } first`,
            StatusCodes.BAD_REQUEST
          )
        );
      }
    }

    if (req.body.deadline && type == "subtask") {
      // Validate that deadline of subtask is greater than deadline of task
      const deadline = new Date(req.body.deadline);
      if (deadline > isModule.taskId.deadline) {
        return next(
          new ErrorClass(
            "Deadline must be before deadline of the main task",
            StatusCodes.BAD_REQUEST
          )
        );
      }
    }

    if (req.files.coverImage) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.coverImage[0].path,
        {
          public_id: isModule.coverImage?.public_id, // Execute overwrite
          // Check if task already has coverImage or not
          folder: isModule.coverImage
            ? null
            : `internship/task/${isModule.customId}/coverImage`,
        }
      );
      req.body.coverImage = { secure_url, public_id };
    }

    if (req.files.attachment) {
      const pathOfType =
        type == "task" ? "task" : `task/${isModule.taskId.customId}/subtask`; // If it subtask model then the attachment will store in '/task/taskId/subtask/subtaskId'
      const path = `internship/${pathOfType}/${isModule.customId}/attachment`;
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.attachment[0].path,
        {
          public_id: isModule.attachment?.public_id,
          folder: isModule.attachment ? null : path,
        }
      );
      req.body.attachment = { secure_url, public_id };
    }

    // Record activity that happened on task/subtask
    const newHistory =
      type == "task"
        ? `Task updated by ${req.user.name}`
        : `Subtask ${isModule.title} updated by ${req.user.name}`;
    const history = type == "task" ? isModule.history : isModule.taskId.history;
    history.push(newHistory)
    req.body.history = history
    if (type == "subtask") {
      // update history in main task
      isModule.taskId.history = history;
      await isModule.taskId.save();
    }

    await module.updateOne({ _id: req.params.id }, req.body);
    return res.status(StatusCodes.CREATED).json({ message: "done" });
  };
};
