import { StatusCodes } from "http-status-codes";
import ErrorClass from "../errorClass.js";
import workspaceModel from "../../../DB/models/workspace.model.js";
import userModel from "../../../DB/models/user.model.js";
import taskModel from "../../../DB/models/Task.model.js";

export const types = {
  workspace: "workspace",
  board: "board",
};

export const addMember = (module, type) => {
  return async (req, res, next) => {
    const { ID } = req.body; // Workspace/Board ID
    const { id } = req.params; // Member ID

    // Validate that the Board/workspace ID is exist in DB
    const isModule = await module.findById(ID);
    if (!isModule) {
      return next(
        new ErrorClass(`${type} ID doesn't exist`, StatusCodes.NOT_FOUND)
      );
    }

    // Check who want to add this member (Board/workspace owner or someone else)
    if (isModule.createdBy.toString() != req.user._id) {
      return next(
        new ErrorClass(
          `You don't have permission, please contact ${type} owner`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Check if user is already exist in workspace/board or not
    if (isModule.members.includes(id)) {
      return next(
        new ErrorClass(
          `User is already exist in the ${type}`,
          StatusCodes.CONFLICT
        )
      );
    }

    // Validate that userId is exist in DB
    const isUser = await userModel.findById(id);
    if (!isUser) {
      return next(
        new ErrorClass("User ID doesn't exist", StatusCodes.NOT_FOUND)
      );
    }

    if (type == "board") {
      // Validate that userId is exist in workspace
      const workspace = await workspaceModel.findById(isModule.workspaceId);
      if (!workspace.members.includes(id)) {
        return next(
          new ErrorClass(
            "User ID isn't member at the workspace",
            StatusCodes.NOT_FOUND
          )
        );
      }
    }
    // Add userId to members array in board/workspace DB
    await module.updateOne(
      { _id: ID },
      {
        $push: { members: id },
      }
    );

    return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
  };
};

export const deleteMember = (module, type) => {
  return async (req, res, next) => {
    const { id } = req.params; // Get userId
    const { ID } = req.body; // Workspace/Board ID

    // Check if userId is exist (if board/workspace owner want to remove someone)
    if (req.user._id.toString() != id) {
      // Search for user in DB
      const isUser = await userModel.findById(id);
      if (!isUser) {
        return next(
          new ErrorClass("User doesn't exist", StatusCodes.NOT_FOUND)
        );
      }
    }

    // Searching for board/workspace
    const isModule = await module.findById(ID);
    if (!isModule) {
      return next(new ErrorClass(`${type} not found`, StatusCodes.NOT_FOUND));
    }

    // Check who want to delete user
    // If Someone except user himself or owner of board/workspace
    if (
      !(
        req.user._id.toString() == isModule.createdBy.toString() ||
        req.user._id.toString() == id
      )
    ) {
      return next(
        new ErrorClass("You don't have permission", StatusCodes.FORBIDDEN)
      );
    }

    // Check if user is exist in board/workspace
    if (!isModule.members.includes(id)) {
      return next(
        new ErrorClass(
          `User doesn't exist in this ${type}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Searching for all tasks assigned to this user
    const userTasks = await taskModel
      .find({ assignedTo: { $in: [id] } }) // search for userID into array
      .populate(
        { path: "listId" } // To know the status of the task (if user done this task or not yet)
      );

    // Check if user assigned to tasks
    if (userTasks.length) {
      // Flag to know who want to remove the member
      const owner =
        req.user._id.toString() == isModule.createdBy.toString() ? true : false;

      // Loop to check each task status
      for (const task of userTasks) {
        // Check if there is any task that user doesn't finished yet
        if (task.listId.title != "Done") {
          // Check who want to remove this user
          // 1- User
          if (!owner) {
            return next(
              new ErrorClass(
                `You didn't finish this task Id ${task._id} yet, You need to finish it or contact ${type} owner`,
                StatusCodes.BAD_REQUEST
              )
            );
          }
          // 2- board/workspace owner
          // Make the task assign to him
          await taskModel.updateOne(
            { _id: task._id },
            {
              $pull: { assignedTo: id }, // remove user id from array
            }
          );

          await taskModel.updateOne(
            { _id: task._id },
            {
              $push: { assignedTo: isModule.createdBy }, // add the board/workspace owner id
            }
          );
        }
      }
    }
    // Remove userId from board/workspace member array in DB
    await module.updateOne(
      { _id: ID },
      {
        $pull: { members: id },
      }
    );

    return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
  };
};
