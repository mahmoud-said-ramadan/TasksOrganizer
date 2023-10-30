import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import bcryptjs from "bcryptjs";
import userModel from "../../../../DB/Models/User.model.js";

export const changePassword = asyncErrorHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body; // Get all needed data from body

  // Making sure that the oldPassword is correct
  if (!bcryptjs.compareSync(oldPassword, req.user.password)) {
    return next(
      new ErrorClass("Old password isn't correct", StatusCodes.BAD_REQUEST)
    );
  }

  // Hashing new password before store it into DB
  const newPasswordHashed = bcryptjs.hashSync(
    newPassword,
    parseInt(process.env.SALT_ROUND)
  );

  // update password on user DB
  await userModel.updateOne(
    { _id: req.user._id },
    {
      password: newPasswordHashed,
    }
  );

  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
});
