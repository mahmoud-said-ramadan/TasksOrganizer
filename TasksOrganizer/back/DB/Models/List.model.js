import mongoose, { Schema, Types, model } from "mongoose";

const listSchema = new Schema(
  {
    title: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    boardId: { type: Types.ObjectId, ref: "Board", required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

listSchema.virtual("tasks", {
  localField: "_id",
  foreignField: "listId",
  ref: "Task",
});

listSchema.virtual('tasks', {
    localField: '_id',
    foreignField: 'listId',
    ref: 'Task'
  })
  

const listModel = mongoose.models.List || model("List", listSchema);

export default listModel;
