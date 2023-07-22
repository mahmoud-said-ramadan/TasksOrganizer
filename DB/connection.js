import mongoose from "mongoose";

const connectDB = async () => {
    return await mongoose.connect(process.env.DB_CONNECTION_URL).then(result => {
        console.log("Connected DB .................. ");
    }).catch(err => {
        console.log("Fsil To Connect With DB ....... ", err);
    })
}

export default connectDB;