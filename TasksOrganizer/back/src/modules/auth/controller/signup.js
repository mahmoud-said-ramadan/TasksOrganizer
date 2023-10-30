import { hash } from "../../../utils/HashAndCompare.js";
import ErrorClass from "../../../utils/errorClass.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto-js";
import { nanoid } from "nanoid";
import userModel from "../../../../DB/Models/User.model.js";
import { generateConfirmCode } from "../../../utils/code.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";

export const signup = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Find user
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    return next(
      new ErrorClass(
        `This email ${email} already exists`,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  if (req.body.phone) {
    // Encrypt phone
    req.body.phone = crypto.AES.encrypt(
      req.body.phone,
      process.env.encryption_key
    ).toString();
  }
  // Hash password
  const hashPassword = hash({ plaintext: password });
  // Create User
  const user = await userModel.create({
    name: req.body.name,
    email,
    password: hashPassword,
    phone: req.body.phone,
    customId:nanoid()
  });
    //Generate code
  const codeStatus = await generateConfirmCode(req);
    if (codeStatus.error) {
      return next(
        new ErrorClass(codeStatus.error.message, codeStatus.error.statusCode)
      );
    }
  return res.status(201).json({ message: "Check your email", user });
});
