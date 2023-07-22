import userModel from "../../../../DB/user/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import { doHashing } from "../../../encryption/encryption.js";
import { sendMail, createMail } from "../../../utils/email.js";



const createToken = (payload, key, time = undefined) => {
    return jwt.sign(payload, key, time);
}

export const signUp = asyncHandler(async (req, res, next) => {
    const protocol = req.protocol;
    const host = req.headers.host;
    let { userName, email, phone, password, age, gender } = req.body;
    email = email.toLowerCase();
    const checkUser = await userModel.findOne({ $or: [{ userName }, { email }] });
    if (!checkUser) {
        // Hash password
        password = doHashing(password);
        // Encrypt phone
        phone = CryptoJS.AES.encrypt(phone, process.env.ENCRYPT_PHONE_KEY).toString();
        // addUser
        const createdUser = await userModel.create({ userName, email, phone, password, age, gender });
        if (createdUser) {
            const { _id } = createdUser;
            //Generate Token
            const createdToken = createToken({ userName, id: _id }, process.env.EMAIL_TOKEN_KEY, { expiresIn: 60 * 5 });
            //Generate Alternative Token
            const newConfirmEmailToken = createToken({ userName, id: _id }, process.env.EMAIL_TOKEN_KEY, { expiresIn: 60 * 60 * 24 * 30 });
            //Generate unsubscribe Token
            //Generate unsubscribe Token
            //Generate unsubscribe Token
            const unsubscribeToken = createToken({ userName, id: _id }, process.env.EMAIL_TOKEN_KEY, { expiresIn: 60 * 60 * 24 * 7 });
            //Generate html form
            const html = createMail({ protocol, host, createdToken, newConfirmEmailToken, unsubscribeToken });
            //Send Confirmation Mail
            await sendMail({ to: email, subject: "Confirmation E-Mail", html });
            return res.status(201).json({
                message: "Done!",
                status: { cause: 201 }
            })
        }
    }
    if (checkUser?.userName == userName) {
        return next(new Error("This User Name Already Exist!", { cause: 409 }));
    } else {
        return next(new Error("This Email Already Exist!", { cause: 409 }));
    }
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_KEY);
    if (decoded) {
        const user = await userModel.findByIdAndUpdate(decoded.id, { confirmEmail: true });
        if (user) {
            return res.status(202).json({
                message: "Confirmed Successfully!",
                status: { cause: 202 }
            });
        }
        return next(new Error("NOT REGISTERED!", { cause: 404 }));
    }
    return next(new Error("In-Valid!", { cause: 404 }));
});

export const newConfirmEmail = asyncHandler(async (req, res, next) => {
    const protocol = req.protocol;
    const host = req.headers.host;
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_KEY);
    if (decoded) {
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return next(new Error("NOT REGISTERED!... Please signUp!", { cause: 404 }));
        }
        if (user?.confirmEmail) {
            return res.status(202).json({
                message: "Already Confirmed!... GO to login",
                status: { cause: 202 }
            });
        }
        const newToken = createToken({ userName: user.userName, id: user._id }, process.env.EMAIL_TOKEN_KEY, { expiresIn: 60 * 2 });
        const html = createMail({ protocol, host, createdToken: newToken });
        //Send New Confirmation Mail
        await sendMail({ to: user.email, subject: "Confirmation E-Mail", html })
        return res.status(202).json({
            message: "Sent Again!... Please Check Your inbox!",
            status: { cause: 202 }
        });
    }
    return next(new Error("In-Valid!", { cause: 404 }));
});

export const logIn = asyncHandler(async (req, res, next) => {
    const { value, password } = req.body;
    const user = await userModel.findOne({ $or: [{ userName: value }, { email: value }] });
    if (!user) {
        return next(new Error("In-Valid logIn Data!", { cause: 404 }));
    }
    if (!user?.confirmEmail) {
        return next(new Error("Please Confirm Email First!", { cause: 404 }));
    }
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
        return next(new Error("In-Valid logIn Data!", { cause: 404 }));
    }
    // Generate an authentication Token for the user
    const createdToken = createToken({ userName: user.userName, id: user._id }, process.env.LOGIN_TOKEN_KEY);
    if (createdToken) {
        user.isOnline = true;
        user.deletedAt = null;
        await user.save();
        return res.status(202).json({
            message: "logIn Successfully!",
            token: createdToken,
            status: { cause: 202 }
        });
    }
    return next(new Error("Fail To logIn!", { cause: 500 }));
});

export const unsubscribe = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_KEY);
    if (decoded?.id) {
        const user = await userModel.findByIdAndDelete(decoded.id);
        if (user) {
            return res.status(202).json({
                message: "UnSubscriped Successfully!",
                status: { cause: 202 }
            });
        }
        return next(new Error("NOT REGISTERED!", { cause: 404 }));
    }
    return next(new Error("In-Valid!", { cause: 500 }));
});