import userModel from "../../../../DB/user/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import bcrypt from 'bcryptjs'
import { doHashing } from "../../../encryption/encryption.js";

const logOut = async (user) => {
    user.isOnline = false;
    const logOut = await user.save();
    return logOut ? true : false;
}

const getMyTasks = async (id) => {
    return await userModel.findById({ _id: id }).populate({
        path: 'createdTasks',
        select: '-__v -userId',
        populate: {
            path: 'assignTo',
            select: '-_id userName email'
        }
    }).populate({
        path: 'assignedTasks',
        select: '-__v -assignTo',
        populate: {
            path: 'userId',
            select: '-_id userName email'
        }
    }).select("-__v -_id -password -phone");
}


export const changePassword = asyncHandler(
    async (req, res, next) => {
        const { password, _id } = req.user;
        const { oldPassword, newPassword } = req.body;
        const match = bcrypt.compareSync(oldPassword, password);
        if (match) {
            const hashedPassword = doHashing(newPassword);
            await userModel.findByIdAndUpdate({ _id }, { password: hashedPassword });
            return res.status(202).json({
                message: "Done!",
                status: { cause: 202 }
            })
        }
        return next(new Error("Wrong Old Password!", { cause: 401 }));
    }
)

export const updateUser = asyncHandler(
    async (req, res, next) => {
        const { _id } = req.user;
        const { userName, age } = req.body;
        const checkUser = await userModel.findOne({ userName });
        if (!checkUser) {
            await userModel.findByIdAndUpdate({ _id }, { userName, age });
            return res.status(202).json({
                message: "Done!",
                status: { cause: 202 }
            });
        }
        return next(new Error("This userName Already Exist!", { cause: 409 }));
    }
)

export const deleteUser = asyncHandler(
    async (req, res, next) => {
        const { _id } = req.user;
        const deleteUser = await userModel.findByIdAndDelete({ _id });
        if (deleteUser) {
            return res.status(202).json({
                message: "Done!",
                status: { cause: 202 }
            });
        }
        return next(new Error("Fail To DELETE!", { cause: 404 }));
    }
)

export const softDeleteUser = asyncHandler(
    async (req, res, next) => {
        const { _id } = req.user;
        const deleteUser = await userModel.findByIdAndUpdate({ _id }, { deletedAt: new Date() });
        if (deleteUser) {
            //send To logOut Fun.
            const loggedOut = await logOut(req.user);
            if (loggedOut) {
                return res.status(202).json({
                    message: "Done!",
                    status: { cause: 202 }
                });
            }
        }
        return next(new Error("Fail To DELETE!", { cause: 404 }));
    }
)

export const logOutUser = asyncHandler(
    async (req, res, next) => {
        //send To logOut Fun.
        const loggedOut = await logOut(req.user);
        if (loggedOut) {
            return res.status(202).json({
                message: "Done!",
                status: { cause: 202 }
            });
        }
        return next(new Error("Fail To logOut!", { cause: 500 }));
    }
)

export const myTasks = asyncHandler(
    async (req, res, next) => {
        const { _id } = req.user._id;
        const myTasks = await getMyTasks(_id);
        if (myTasks) {
            return res.status(202).json({
                message: "Done!",
                myTasks,
                status: { cause: 202 }
            })
        }
        return next(new Error("Fail!", { cause: 401 }));
    }
)

