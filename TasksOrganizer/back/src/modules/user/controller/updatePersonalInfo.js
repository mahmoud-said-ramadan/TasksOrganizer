import userModel from "../../../../DB/Models/User.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import ErrorClass from "../../../utils/errorClass.js";
import { StatusCodes } from "http-status-codes";
import CryptoJS from "crypto-js";

export const updatePersonalInfo = async (req, res, next) => {
  // Find a user in the database
  const isUser = await userModel.findById(req.user._id);
  if (!isUser) {
    return next(new ErrorClass(`User not found`, StatusCodes.NOT_FOUND));
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file?.path,
      {
        public_id: isUser.image?.public_id,
        // Check if user already has image or not
        folder: isUser.image? null : `internship/user/${req.user.customId}/image`
      }
    );
    req.body.image = { secure_url, public_id };
  }

  //Encrypt the phone number if is send
  if (req.body.phone) {
    req.body.phone = CryptoJS.AES.encrypt(
      req.body.phone,
      process.env.encryption_key
    ).toString();
  }
  //update user name if is send
  if (req.body.name) {
    req.body.name = isUser.name;
  }
  // Update the user profile
  const updatedUser = await userModel.updateOne(
    { _id: req.user._id },
    req.body
  );
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: `Profile Updated successfully`, updatedUser });
};
