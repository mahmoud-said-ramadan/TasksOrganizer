import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const get = joi.object({
    id: generalFields.id,
}).required();

export const createBoard = joi.object({
    workspaceId: generalFields.id.required(),
    title: joi.string().trim().min(3).max(25).required(),
    visibility: joi.string().trim().valid('public', 'private').default('public').lowercase(),
    file: generalFields.file.required(),
}).required();

export const updateBoard = joi.object({
    id: generalFields.id.required(),
    title: joi.string().trim().min(3).max(25),
    visibility: joi.string().trim().valid('public', 'private').default('public').lowercase(),
    file: generalFields.file,
}).required();

export const updateSubCategory = joi.object({
    id: generalFields.id,
    // categoryId: generalFields.id,
    name: joi.string().trim().min(3).max(25),
    file: generalFields.file
}).required();

export const softDeleteSubCategory = joi.object({
    // categoryId: generalFields.id,
    id: generalFields.id,
}).required();

export const deleteSubCategory = joi.object({
    // categoryId: generalFields.id,
    id: generalFields.id,
}).required();

  export const addOrDeleteMember = joi.object({
    // categoryId: generalFields.id,
    id:joi.alternatives().try(
        generalFields.id.required(), // For single ID
        joi.array().items(generalFields.id).required() // For array of IDs
      )
}).required();