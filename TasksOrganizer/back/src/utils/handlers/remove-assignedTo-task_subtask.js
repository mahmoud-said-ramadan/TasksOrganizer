import taskModel from "../../../DB/Models/Task.model.js";
import ErrorClass from "../errorClass.js";
import { StatusCodes } from "http-status-codes";

export const taskType = {
  task: "task",
  subtask: "subtask",
};

export const removeAssigned = (module, type) => {
  return async (req, res, next) => {
    const { id } = req.params; // id of ( task / subtask )
    const { removeAssignedTo  } = req.body
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
      return next(new ErrorClass(`UNAUTHORIZED to remove users in ${type}`), StatusCodes.UNAUTHORIZED);
    }
   
      if (isModule.assignedTo.length == 0) {
        return next(
          new ErrorClass(
            `No people assigned to ${type} to remove`,
            StatusCodes.BAD_REQUEST
          )
        );
      }
      const removed = await module.updateOne(
        {
          _id: id,
        },
        {
          $pull: { assignedTo: removeAssignedTo },
        }
      );
      if (!removed) {
        return next(
          new ErrorClass(
            "Did not removed users",
            StatusCodes.INTERNAL_SERVER_ERROR
          )
        );
      }
      return res.status(StatusCodes.OK).json({ message: "Done", removed });
    }
  };

