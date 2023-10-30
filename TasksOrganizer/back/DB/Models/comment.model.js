import mongoose, { Schema, Types, model } from "mongoose";

const commentSchema = new Schema(
    {
        content:{
            type:String,
            required:true
        },
        createdBy:{
            type:Types.ObjectId,
            ref:'User',
            required:true
        },
        taskId:{
            type:Types.ObjectId,
            ref:'Task',
            required:true
        }
    },
    {
        timestamps:true
    }
)

const commentModel = mongoose.models.Comment|| model( "Comment", commentSchema )
export default commentModel