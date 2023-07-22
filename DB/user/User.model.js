import { Schema, Types, model } from "mongoose";


const userSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, default: "Male", enum: ["Male", "Female"] },
    phone: { type: String, required: true, unique: true },
    assignedTasks: [{ type: Types.ObjectId, ref: 'Task' }],
    createdTasks: [{ type: Types.ObjectId, ref: 'Task' }],
    isOnline: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
    confirmEmail: { type: Boolean, default: false }
});


const userModel = model('User', userSchema);
export default userModel;