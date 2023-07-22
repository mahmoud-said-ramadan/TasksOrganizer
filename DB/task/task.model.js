import { Schema, Types, model } from "mongoose";


const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: "ToDo", enum: ["ToDo", "Doing", "Done"] },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    assignTo: { type: Types.ObjectId, ref: 'User', required: true },
    deadline: { type: Date }
}, {
    timestamps: true
});


const taskModel = model("Task", taskSchema);
export default taskModel;




