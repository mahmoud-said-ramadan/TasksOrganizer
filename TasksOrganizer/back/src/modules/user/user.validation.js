import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const changePassword = joi.object({
    oldPassword: generalFields.password,
    newPassword: generalFields.password,
}).required()

export const changeEmail = joi.object({
    email: generalFields.email.lowercase().required(),
}).required()

export const updateInfo = joi.object({
    name: joi.string().trim().min(3).max(25),
    phone: joi.string().trim().pattern(/^\+?[1-9]\d{1,11}$/),
    file: generalFields.file,
}).required()