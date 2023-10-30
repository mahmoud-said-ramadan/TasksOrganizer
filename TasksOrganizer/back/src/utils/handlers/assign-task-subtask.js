import taskModel from "../../../DB/Models/Task.model.js";
import ErrorClass from "../errorClass.js";
import { StatusCodes } from "http-status-codes";

export const taskType = {
  task: "task",
  subtask: "subtask",
};

export const assignTo = (module, type) => {
  return async (req, res, next) => {
    const { id, assignedTo } = req.params; // id of ( task / subtask )
    // case subtask
    if (module.toString() == "subtask") {
      const { taskId } = req.params;
      // Find subtask
      const task = await taskModel.findById(taskId);
      if (!task) {
        return next(new ErrorClass(`Subtask not found`), StatusCodes.NOT_FOUND);
      }
    }
    // Find module( task / subtask)
    const isModule = await module.findById(id);
    if (!isModule) {
      return next(new ErrorClass(`${type} not found`), StatusCodes.NOT_FOUND);
    }
    // check if user is the owner of isModule(task / subtask) to assign to ..
    if (isModule.createdBy.toString() !== req.user._id.toString()) {
      return next(
        new ErrorClass(`UNAUTHORIZED to assign users in ${type}`),
        StatusCodes.UNAUTHORIZED
      );
    }
    if (isModule.assignedTo.length == 0) {
      return next(
        new ErrorClass(
          `Look like ${req.params.assignedTo.join(
            ", "
          )} already found before in ${type}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    // Check if a user assignedTo to this isModule before
    assignedTo = assignedTo.filter(
      (user) => !isModule.assignedTo.includes(user)
    );
    if (assignedTo.length == 0) {
      return next(
        new ErrorClass(
          `Look like ${req.params.assignedTo.join(
            ", "
          )} already found before in ${type}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const ids = [];
    for (let i = 0; i < assignedTo.length; i++) {
      //check assignedTo .. have account
      const found = await userModel.findById(assignedTo[i].toString());
      if (found) {
        //push assignedTo to ids[]
        ids.push(assignedTo[i]);
      }
    }
    if (ids.length == 0) {
      return next(
        new ErrorClass(
          `Look like  ${req.params.assignedTo.join(
            ", "
          )} already found before or not found users to add in ${type}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const added = await module.updateOne(
      {
        _id: id,
      },
      {
        $push: { assignedTo: ids },
      }
    );
    if (!added) {
      return next(
        new ErrorClass(
          "Did not adding users",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
    return res.status(StatusCodes.OK).json({ message: "Done", added });
  };
};
