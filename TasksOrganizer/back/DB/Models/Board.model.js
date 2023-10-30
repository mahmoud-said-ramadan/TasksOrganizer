import mongoose, { Schema, Types, model } from "mongoose";
import { imageSchema } from "../DB_Utils/imageSchema.js";

const boardSchema = new Schema(
  {
    title: { type: String, required: true },
    coverImages: [imageSchema],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    members: [{ type: Types.ObjectId, ref: "User" }],
    workspaceId: { type: Types.ObjectId, ref: "Workspace", required: true },
    customId: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

boardSchema.virtual("lists", {
  localField: "_id",
  foreignField: "boardId",
  ref: "List",
});

boardSchema.virtual("tasks", {
  localField: "_id",
  foreignField: "listId",
  ref: "Task",
});

const boardModel = mongoose.models.Board || model("Board", boardSchema);
export default boardModel;
