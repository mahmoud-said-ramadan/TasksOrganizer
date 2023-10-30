import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import workspaceModel from "../../../../DB/models/workspace.model.js";
import userModel from "../../../../DB/models/User.model.js";

export const addMembers = async (req, res, next) => {
  const { workspaceId } = req.params;
  let { members } = req.body;
  // Find workspace
  const workspace = await workspaceModel.findById(workspaceId);
  if (!workspace) {
    return next(
      new ErrorClass("in-valid workspace id", StatusCodes.BAD_REQUEST)
    );
  }
  //Check if a user is the owner of this workspace
  if (workspace.createdBy.toString() !== req.user._id.toString()) {
    return next(new ErrorClass("unauthorized", StatusCodes.UNAUTHORIZED));
  }
  //Check members
  if (!members) {
    return next(new ErrorClass("No members to add", StatusCodes.BAD_REQUEST));
  }
  const membersIds = [];
  //Filters members is already found in members (DB)
  if (workspace.members.length >= 1) {
    members = members.filter((ele) => !workspace.members.includes(ele));
    if (members.length == 0) {
      return next(
        new ErrorClass(
          "Look like members already found before",
          StatusCodes.BAD_REQUEST
        )
      );
    }
  }
  for (let i = 0; i < members.length; i++) {
    //check members have account
    const found = await userModel.findById(members[i].toString());
    if (found) {
      //push member to membersIds
      membersIds.push(members[i]);
    }
  }
  if (membersIds.length == 0) {
    return next(
      new ErrorClass(
        "Look like members already found before or not found users to add",
        StatusCodes.BAD_REQUEST
      )
    );
  }
  const addMembers = await workspaceModel.updateOne(
    {
      _id: workspaceId,
    },
    {
      $push: { members: membersIds },
    }
  );
  if (!addMembers) {
    return next(new ErrorClass("Did not adding member", StatusCodes.INTERNAL_SERVER_ERROR));
  }
  return res.status(StatusCodes.OK).json({ message: "Done", addMembers });
};
