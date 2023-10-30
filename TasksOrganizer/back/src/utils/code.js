import { nanoid } from "nanoid";
import sendEmail, { html } from "./email.js";
import ErrorClass from "./errorClass.js";
import userModel from "../../DB/Models/User.model.js";


const sendCode = async (user, status) => {
  // If Last Code Send In Time Less Than 5 Mints
  if (Date.now() < user.codeInfo?.createdAt + 5 * 60 * 1000) {
    return {
      error: new ErrorClass(
        "You Can NOT Ask For a new Code, Until 5 Mints from The Last Sended One!",
        409
      ),
    };
  }

  //Generate OTP Code
  const codeInfo = {
    code: nanoid(6),
    createdAt: Date.now(),
    status,
  };

  const htmlCode = html(`This Code For Make ${status}`, codeInfo.code);
  //Send New Confirmation Mail
  if (
    !(await sendEmail({
      to: user.email,
      subject: "Confirmation E-Mail",
      html:htmlCode,
    }))
  ) {
    return {
      error: new ErrorClass("This Email Rejected!", 400),
    };
  }
  await userModel.updateOne({ _id: user._id }, { codeInfo });
  return true;
};

export const getStatusFromUrl = (url) => {
  if (url.includes("unsubscribe")) {
    return "unsubscribe";
  } else if (url.includes("changeEmail")) {
    return "confirmChange";
  } else if (url.includes("password")) {
    return "password";
  } else {
    return "confirm";
  }
};

export const generateConfirmCode = async (req) => {
  const status = getStatusFromUrl(req.originalUrl);
  console.log({status});
  let userExist;
  status === "confirmChange"
    ? (userExist = req.user)
    : (userExist = await userModel.findOne({ email: req.body.email }));
  if (!userExist) {
    return {
      error: new ErrorClass("NOT REGISTERED!... Please signUp!", 404),
    };
  }
  const codeSentStatus = await sendCode(userExist, status);
  if (codeSentStatus.error) {
    return codeSentStatus;
  }
  return true;
};