import ErrorClass from "../errorClass.js";
import { StatusCodes } from "http-status-codes";

export const types = {
    task: "task",
  };

export const archive = (module, type) => {
    return async (req, res, next) => {
  const { ID } = req.params;
  const isModule = await module.findById(ID);
  if (!isModule) {
    return next(new ErrorClass(`${type} not Found`), StatusCodes.NOT_FOUND);
  }
  if (isModule.createdBy.toString() !== req.user._id.toString()) {
    return next(new ErrorClass(`UNAUTHORIZED to archive ${type}`), StatusCodes.UNAUTHORIZED);
  }
  if (isModule.isArchived) {
    return next(new ErrorClass(`${type} is already Archived`), StatusCodes.BAD_REQUEST);
  }
  isModule.isArchived = true
  isModule.history = `${type} Archived by ${req.user.name} ${req.user._id} `,
  await isModule.save()

  return res.status(StatusCodes.CREATED).json({ message: `${type} Archived successfully.`, isModule });

}
};