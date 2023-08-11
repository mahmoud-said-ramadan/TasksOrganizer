import connectDB from '../DB/connection.js';
import { globalErrorHandling } from './utils/errorHandling.js';
import authRouter from './modules/auth/auth.router.js';
import userRouter from './modules/user/user.router.js';
import taskRouter from './modules/task/task.router.js';
import cors from 'cors';



const bootstrap = (app, express) => {
    app.use(express.json());
    app.use(cors());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/task", taskRouter);


    app.get("*", (req, res, next) => {
        return res.json({ message: "404 Page NOT Found" });
    });

    app.use(globalErrorHandling);
    // Enable CORS for all requests

    connectDB()
};
export default bootstrap;



