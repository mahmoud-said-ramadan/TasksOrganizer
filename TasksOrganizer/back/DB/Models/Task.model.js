import mongoose, { Schema, Types, model } from "mongoose";
import { imageSchema } from "../DB_Utils/imageSchema.js";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    isArchived: { type: Boolean, default: false },
    history: [String],
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    assignedTo: [{ type: Types.ObjectId, ref: "User", required: true }],
    listId: { type: Types.ObjectId, ref: "List", required: true },
    customId: { type: String, unique: false, required: true },
    coverImage: imageSchema,
    attachment: imageSchema,
  },
  {
    timestamps: true,
  }
);

taskSchema.virtual('subtasks', {
  localField: '_id',
  foreignField: 'taskId',
  ref: 'SubTask'
})

const taskModel = mongoose.models.Task || model("Task", taskSchema);
export default taskModel;
