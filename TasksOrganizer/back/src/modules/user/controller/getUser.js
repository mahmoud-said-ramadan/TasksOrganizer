import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import userModel from "../../../../DB/Models/User.model.js";

export const getUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params; // Get userId from params
  const user = await userModel.findById(id); // Search for user in DB
  // Validate that user is exist
  if (!user) {
    return next(new ErrorClass("User not found"), StatusCodes.NOT_FOUND);
  }
  // Return user Data
  return res.status(StatusCodes.ACCEPTED).json({ message: "done", user });
});
