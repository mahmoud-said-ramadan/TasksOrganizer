import userModel from "../../../../DB/Models/User.model.js";
import { hash } from "../../../utils/HashAndCompare.js";
import { getStatusFromUrl } from "../../../utils/code.js";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";


export const confirm = asyncErrorHandler(async (req, res, next) => {
  const { code, email } = req.body;
  const userExist = await userModel.findOne({ email: email });
  if (!userExist) {
    return next(new ErrorClass("NOT REGISTERED!", 404));
  }
  let status = getStatusFromUrl(req.originalUrl);
  console.log({status});
  // This Code Expires in 5 Mints
  if (
    code !== userExist.codeInfo?.code ||
    userExist.codeInfo?.status !== status ||
    Date.now() > userExist.codeInfo?.createdAt + 5 * 60 * 1000
  ) {
    return next(new ErrorClass("In-Valid OTP Code!", 400));
  }
  let message;
  switch (status) {
    case "unsubscribe":
      // Delete User Account In Case He Is NOT Confirmed
      await userModel.deleteOne({ _id: userExist._id, confirmed: false });
      message = "UnSubscribed Successfully!";
      break;
    case "confirmChange":
      // check if the email Not Confirmed to other user
      if (await userModel.findOne({ email })) {
        return next(
          new ErrorClass("This Email Already Confirmed To Another User!", 409)
        );
      }
      await userModel.updateOne(
        { tempEmail: email },
        { confirmed: true, email, tempEmail: "" }
      );
      message = "Email Confirmed Successfully!";
      break;
    case "password":
      let { newPassword } = req.body;
      // Hash the password Before updating
      newPassword = hash({plaintext:newPassword});
      await userModel.findByIdAndUpdate(userExist._id, {
        password: newPassword,
      });
      message = "Password Changed Successfully!";
      break;
    default:
      await userModel.updateOne({ _id: userExist._id }, { confirmed: true });
      message = "Email Confirmed Successfully!";
      break;
  }
  return res.status(202).json({
    message,
  });
});