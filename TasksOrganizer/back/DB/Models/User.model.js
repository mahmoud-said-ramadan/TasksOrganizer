import mongoose, { Schema, model } from 'mongoose'
import { imageSchema } from '../DB_Utils/imageSchema.js'
import { codeSchema } from '../DB_Utils/codeSchema.js'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minLength: [2, 'Name is short'],
      lowercase: true
    },
    email: {
      type: String,
      unique: [true, 'Email is unique'],
      required: [true, 'Email is required'],
      lowercase: true
    },
    tempEmail: {
      type: String,
      unique: [false, 'Email is unique'],
      lowercase: true
    },
    password: { type: String, required: [true, 'Password is required'] },
    phone: { type: String },
    loggedIn: { type: Boolean, default: false },
    role: { type: String, enum: ['Admin', 'User'], default: 'User' },
    confirmed: { type: Boolean, default: false },
    image: imageSchema,
    codeInfo: codeSchema,
    customId: String
  },
  {
    timestamps: true
  }
)

userSchema.virtual("workspaces", {
  localField: "_id",
  foreignField: "createdBy",
  ref: "Workspace",
});

const userModel = mongoose.models.User || model('User', userSchema)
export default userModel
