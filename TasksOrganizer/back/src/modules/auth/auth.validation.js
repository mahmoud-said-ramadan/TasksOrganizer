import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signup = joi.object({
    name: joi.string().trim().min(3).max(25).required(),
    email: generalFields.email.lowercase().required(),
    // will make a password pattern later
    password: generalFields.password.min(8).required(),
    phone: joi.string().trim().pattern(/^\+?[1-9]\d{1,11}$/),
    file: generalFields.file,
}).required()

export const login = joi.object({
    email: generalFields.email.lowercase().required(),
    password: joi.string().min(8).required(),
}).required()

export const confirm = joi.object({
    email: generalFields.email.lowercase().required(),
    code: joi.string().length(6).required(),
}).required()

export const reset = joi.object({
    newPassword: generalFields.password.min(8).required(),
    email: generalFields.email.lowercase().required(),
    code: joi.string().length(6).required(),
}).required()

export const generate = joi.object({
    email: generalFields.email.lowercase().required(),
}).required()