import connectDB from '../DB/connection.js';
import { globalErrorHandling } from './utils/errorHandling.js';
import authRouter from './modules/auth/auth.router.js';
import userRouter from './modules/user/user.router.js';
import taskRouter from './modules/task/task.router.js';



const bootstrap = (app, express) => {
    app.use(express.json());
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/task", taskRouter);
    app.get("*", (req, res, next) => {
        return res.json({ message: "404 Page NOT Found" });
    });

    app.use(globalErrorHandling);
    connectDB()
};


export default bootstrap;



