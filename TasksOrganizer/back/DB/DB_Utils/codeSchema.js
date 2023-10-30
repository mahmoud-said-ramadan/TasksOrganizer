import { Schema } from "mongoose";

export const codeSchema = new Schema(
  {
    code: {
      type: String,
      min: [6, "Code length must be 6 character"],
      max: [6, "Code length must be 6 character"],
    },
    status: {
      type: String,
      enum: ["password", "confirm", "confirmChange", "unsubscribe"],
      required: true,
    },
    createdAt: Date,
  },
  {
    _id: false,
  }
);
