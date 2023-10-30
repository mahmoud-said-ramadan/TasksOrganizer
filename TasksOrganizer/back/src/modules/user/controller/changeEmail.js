import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import userModel from "../../../../DB/Models/User.model.js";
import { generateConfirmCode } from "../../../utils/code.js";

export const changeEmail = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body; // Get all needed data from body
  // Find user
  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    return next(
      new ErrorClass(
        `This email ${email} used by another user`,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  //Generate code
  const codeStatus = await generateConfirmCode(req);
  if (codeStatus.error) {
    return next(
      new ErrorClass(codeStatus.error.message, codeStatus.error.statusCode)
    );
  }
  await userModel.updateOne({ _id: req.user._id }, { tempEmail: email });
  return res.status(StatusCodes.ACCEPTED).json({ message: "done", code });
});
