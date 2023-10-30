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

export const add = (module, type) => {
  return async (req, res, next) => {
    // create unique number for task/subtask
    req.body.customId = nanoid();

    if (type == "task") {
      // Validate that list is exist
      const isList = await listModel
        .findById(req.body.listId)
        .populate("boardId");
      if (!isList) {
        return next(new ErrorClass("List Not Found"), StatusCodes.NOT_FOUND);
      }
      req.body.board = isList.boardId;
      req.body.members = req.body.board.members; // To access outside the if scope
    } else {
      // Validate that task is exist
      const isTask = await taskModel.findById(req.body.taskId);
      if (!isTask) {
        return next(
          new ErrorClass("Main task Not Found"),
          StatusCodes.NOT_FOUND
        );
      }

      // Validate that deadline of subtask is greater than deadline of task
      const deadline = new Date(req.body.deadline);
      if (deadline > isTask.deadline) {
        return next(
          new ErrorClass(
            "Deadline must be before deadline of the main task",
            StatusCodes.BAD_REQUEST
          )
        );
      }
      req.body.isTask = isTask; // To access outside the if scope
      req.body.members = isTask.assignedTo;
    }

    // Check if user exist in (board/task) or not
    const isUser = req.body.members.includes(req.body.assignedTo);
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

    if (req.files.coverImage) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.coverImage[0].path,
        {
          folder: `internship/${type}/${req.body.customId}/coverImage`,
        }
      );
      req.body.coverImage = { secure_url, public_id };
    }

    if (req.files.attachment) {
      const pathOfType =
        type == "task" ? "task" : `task/${req.body.isTask.customId}/subtask`; // If it subtask model then the attachment will store in '/task/taskId/subtask/subtaskId'
      const path = `internship/${pathOfType}/${req.body.customId}/attachment`;
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.attachment[0].path,
        {
          folder: path,
        }
      );
      req.body.attachment = { secure_url, public_id };
    }

    req.body.history =
      type == "task"
        ? `Task added by ${req.user.name} `
        : `Subtask ${req.body.title} created by ${req.user.name}`;
    req.body.createdBy = req.user._id;
    const model = await module.create(req.body);

    if (type == "subtask") {
      // update history in main task
      req.body.isTask.history.push(req.body.history);
      await req.body.isTask.save();
    }
    return res.status(StatusCodes.CREATED).json({ message: "done", model });
  };
};
