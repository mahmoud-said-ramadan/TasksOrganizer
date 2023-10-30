import mongoose, { Schema, Types, model } from "mongoose";
import { imageSchema } from "../DB_Utils/imageSchema.js";

const workspaceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    coverImages: [imageSchema],
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    visability: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    customId: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

workspaceSchema.virtual("boards", {
  localField: "_id",
  foreignField: "workspaceId",
  ref: "Board",
});

const workspaceModel =
  mongoose.models.Workspace || model("Workspace", workspaceSchema);
export default workspaceModel;
