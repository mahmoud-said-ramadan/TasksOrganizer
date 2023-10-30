import { Schema } from "mongoose";


export const imageSchema = new Schema({
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
}, {
    _id: false
})