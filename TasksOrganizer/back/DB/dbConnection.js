import mongoose from "mongoose";

export const dbConnection = async () => {
    return await mongoose.connect(process.env.DB_ATLAS).then(() => {
        console.log("db connection successfully ........ ");
    }).catch(() => {
        console.log("db connection failed ********");
    })
}

mongoose.set('strictQuery', true);