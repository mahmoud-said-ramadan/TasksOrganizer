import mongoose, { Schema, Types, model } from "mongoose";
import { imageSchema } from "../DB_Utils/imageSchema.js";

const subTaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: { type:String, enum: ["completed","unCompleted"], default: "unCompleted" },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    assignedTo: [{ type: Types.ObjectId, ref: "User", required: true }],
    taskId: { type: Types.ObjectId, ref: "Task", required: true },
    attachment: imageSchema,
  },
  {
    timestamps: true,
  }
);

const subTaskModel = mongoose.models.SubTask || model("SubTask", subTaskSchema);

export default subTaskModel;
