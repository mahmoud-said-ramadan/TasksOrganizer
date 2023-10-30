import { StatusCodes } from "http-status-codes";
import workspaceModel from "../../../../DB/models/workspace.model.js";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import taskModel from "../../../../DB/models/Task.model.js";
import userModel from "../../../../DB/models/user.model.js";

export const deleteMember = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params; // Get userId
  const { workspaceId } = req.body;

  // Check if userId is exist (if workspace owner want to remove someone)
  if (req.user._id.toString() != id) {
    // Search for user in DB
    const isUser = await userModel.findById(id);
    if (!isUser) {
      return next(new ErrorClass("User doesn't exist", StatusCodes.NOT_FOUND));
    }
  }

  // Check who want to delete user
  // If Someone except user himself or owner of workspace
  if (
    req.user._id.toString() != workspace.createdBy.toString() ||
    req.user._id.toString() != id
  ) {
    return next(
      new ErrorClass("You don't have permission", StatusCodes.FORBIDDEN)
    );
  }

  // Searching for workspace
  const workspace = await workspaceModel.findById(workspaceId);
  if (!workspace) {
    return next(new ErrorClass("Workspace not found", StatusCodes.NOT_FOUND));
  }

  // Check if user is exist in workspace
  if (!workspace.member.includes(id)) {
    return next(
      new ErrorClass(
        "User doesn't exist in this workspace",
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

  // Flag to know who want to remove the member
  const workspaceOwner =
    req.user._id.toString() == workspace.createdBy.toString() ? true : false;

  // Loop to check each task status
  for (const task of userTasks) {
    // Check if there is any task that user doesn't finished yet
    if (task.listId.title != "Done") {
      // Check who want to remove this user
      // 1- User
      if (!workspaceOwner) {
        return next(
          new ErrorClass(
            `You didn't finish this task Id ${task._id} yet, You need to finish it or contact workspace owner`,
            StatusCodes.BAD_REQUEST
          )
        );
      }
      // 2- Workspace owner
      // Make the task assign to him
      await taskModel.updateOne(
        { _id: task._id },
        {
          $pull: { assignedTo: id }, // remove user id from array
          $push: { assignedTo: workspace.createdBy }, // add the workspace owner id
        }
      );
    }
  }

  // Remove userId from workspace member array in DB
  await workspaceModel.updateOne(
    { _id: workspaceId },
    {
      $addToSet: { member: id },
    }
  );

  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
});
