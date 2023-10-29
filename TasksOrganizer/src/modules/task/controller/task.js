import userModel from "../../../../DB/user/User.model.js";
import taskModel from "../../../../DB/task/task.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { decrypt, decryptPhone } from "../../../encryption/encryption.js";

const createTask = async (data) => {
    return await taskModel.create(data).then((createdUser) => {
        console.log('New user created with ID:', createdUser._id);
    })
        .catch((err) => {
            console.error('Error creating user:', err);
        });
}

const getAllTasks = async () => {
    return await taskModel.find().populate({
        path: 'userId',
        select: '-_id userName email phone',
    }).populate({
        path: 'assignTo',
        select: '-_id userName email phone',
    }).select("-__v");
}

const getTasksOfOneUser = async (userId) => {
    return await userModel.findById({ _id: userId }).populate({
        path: 'createdTasks',
        select: '-__v -userId',
        populate: {
            path: 'assignTo',
            select: 'userName email'
        }
    }).populate({
        path: 'assignedTasks',
        select: '-__v -assignTo -userId',
        //Exclude Password For Security
    }).select("-__v -_id -password");
}

const getLateTasks = async () => {
    const currentDate = new Date();
    return await taskModel.find({ deadline: { $lt: currentDate }, status: { $ne: 'Done' } }).populate({
        path: 'userId',
        select: '-_id userName email phone',
    }).populate({
        path: 'assignTo',
        select: '-_id userName email phone',
    }).select("-__v");
}

export const addTask = asyncHandler(
    async (req, res, next) => {
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
        console.log(req.body);
        const { title, description, status, assignTo, deadline } = req.body;
        const checkAssignTo = await userModel.findOne({ email: assignTo, deletedAt: null });
        console.log(checkAssignTo);
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

        if (checkAssignTo) {
            console.log("if=================");
            //Create A New Task
            const saved = await taskModel.create({ title, description, status, assignTo: checkAssignTo.id, deadline, userId: req.user._id });
            if (saved) {
                console.log("saved=======================");
                console.log(saved);

                //Add The New Task To The tasks Arr Of Users <<RAM>>
                checkAssignTo.assignedTasks.push(saved);
                console.log("checkAssignTo=======================");
                req.user.createdTasks.push(saved)
                console.log("req.user.createdTasks=======================");
                //Save The New Task To The tasks Arr Of Users <<DB>>
                await req.user.save();
                console.log("await saved=======================");
                await checkAssignTo.save();
                console.log("await saved=======================");

                const savedWithoutAssignTo = saved.toObject();
                delete savedWithoutAssignTo.assignTo;
                const responseSaved = {
                    ...savedWithoutAssignTo,
                    assignTo: { email: checkAssignTo.email }
                };
                console.log(responseSaved);

                return res.status(202).json({
                    message: "Done!",
                    responseSaved,
                    status: { cause: 202 }
                })
            }
            return next(new Error("Fail To addTask!", { cause: 401 }));
        }
        return next(new Error(`Fail To Assign To.... ${assignTo} , This Email Is NOT Exist!... ( May Have been DELETED!)`, { cause: 404 }));
    }
)

export const updateTask = asyncHandler(
    async (req, res, next) => {
        console.log({ data: req.body });
        const { taskId, title, description, status, assignTo, deadline } = req.body;
        const checkAssignTo = await userModel.findOne({ email: assignTo, deletedAt: null, confirmEmail: true });
        if (checkAssignTo) {
            //update Task
            const task = await taskModel.findOneAndUpdate({ _id: taskId, userId: req.user._id }, {
                title,
                description,
                status,
                assignTo: checkAssignTo._id,
                deadline
            }, { new: true }).populate({ path: 'assignTo', select: 'email' });
            if (task) {
                console.log(task);
                //remove The Task id From The tasks Arr Of Old User
                //await userModel.findByIdAndUpdate(task.assignTo, { $pull: { assignedTasks: taskId } })
                //Add The New Task id To The tasks Arr Of New User
                if (!checkAssignTo.assignedTasks.some(task => task === taskId)) {
                    checkAssignTo.assignedTasks.push(task);
                    console.log("!if");
                    await checkAssignTo.save();
                }
                return res.status(202).json({
                    message: "Done!",
                    task,
                    status: { cause: 202 }
                })
            }
            return next(new Error("Fail To Update!, This Task Is NOT Exist! ", { cause: 404 }));
        }
        return next(new Error(`Fail To Assign To.... ${assignTo} , This Email Is NOT Exist!... ( May Have been DELETED!, Or NOT  Confirmed!!!)`, { cause: 404 }));
    }
)

export const updateTaskStatus = asyncHandler(
    async (req, res, next) => {
        console.log("updateTaskStatus-----------");
        console.log(req.body);
        const { taskId, status } = req.body;
        //update Task Status
        const task = await taskModel.findOneAndUpdate({ _id: taskId, userId: req.user._id }, { status });
        console.log("---------task");
        console.log(task);
        if (task) {
            return res.status(202).json({
                message: "Done!",
                status: { cause: 202 }
            })
        }
        return next(new Error("Fail To Update!, This Task Is NOT Exist! ", { cause: 404 }));
    }
)

export const deleteTask = asyncHandler(
    async (req, res, next) => {
        console.log(req.body);
        const { taskId } = req.body;

        const deleteTask = await taskModel.findOneAndDelete({ _id: taskId, userId: req.user._id });
        if (deleteTask) {
            const assign = await userModel.findByIdAndUpdate(
                deleteTask.assignTo, // User ID from the deleted task
                { $pull: { assignedTasks: taskId } } // Remove task ID from user's tasks array
            );
            const create = await userModel.findByIdAndUpdate(
                deleteTask.userId, // User ID from the deleted task
                { $pull: { createdTasks: taskId } } // Remove task ID from user's tasks array
            );
            return res.status(202).json({
                message: "Done!",
                status: { cause: 202 }
            })
        }
        return next(new Error("Fail To Delete!, This Task Is NOT Exist!  ", { cause: 401 }));
    }
)

export const allTasks = asyncHandler(
    async (req, res, next) => {
        const allTasks = await getAllTasks();
        if (allTasks) {
            //Decrypt All The Phone Numbers
            const decrypted = await decrypt(allTasks);
            return res.status(202).json({
                message: "Done!",
                decrypted,
                status: { cause: 202 }
            })
        }
        return next(new Error("Fail!", { cause: 404 }));
    }
)

export const tasksOfOneUser = asyncHandler(
    async (req, res, next) => {
        const { userId } = req.params;
        const tasks = await getTasksOfOneUser(userId);
        if (tasks) {
            //Decrypt The User Phone Number
            const decrypted = decryptPhone(tasks);
            return res.status(202).json({
                message: "Done!",
                tasks,
                status: { cause: 202 }
            })
        }
        return next(new Error("This User Is NOT Exist!", { cause: 404 }));
    }
)

export const lateTasks = asyncHandler(
    async (req, res, next) => {
        const lateTasks = await getLateTasks();
        if (lateTasks) {
            if (!lateTasks.length) {
                return res.status(202).json({
                    message: " Good Job! There Are No Late Tasks!",
                    status: { cause: 202 }
                });
            }
            //Decrypt All The Phone Numbers
            const decrypted = await decrypt(lateTasks);
            return res.status(202).json({
                message: "Done!",
                decrypted,
                status: { cause: 202 }
            })
        }
        return next(new Error("Fail!", { cause: 404 }));
    }
)