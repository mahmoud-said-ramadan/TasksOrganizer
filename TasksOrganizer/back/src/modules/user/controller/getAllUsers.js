import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import userModel from "../../../../DB/Models/User.model.js";

export const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await userModel.find();
  return res.status(StatusCodes.ACCEPTED).json({ message: "done", users });
});
