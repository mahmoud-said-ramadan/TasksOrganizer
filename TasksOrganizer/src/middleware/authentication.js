import jwt from "jsonwebtoken";
import userModel from "../../DB/user/User.model.js";
import { asyncHandler } from "../utils/errorHandling.js";

const removeBearer = (authorization, bearer) => {
    if (!authorization?.startsWith(bearer)) {
        return;
    }
    return authorization.split(bearer)[1];
}

export const auth = asyncHandler(
    async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization) {
            return next(new Error("Authorization Is Required!", { cause: 401 }))
        }
        const token = removeBearer(authorization, process.env.BEARER_TOKEN);
        if (!token) {
            return next(new Error("In-Valid Bearer Token!", { cause: 404 }))
        }
        const decoded = jwt.verify(token, process.env.LOGIN_TOKEN_KEY);
        if (!decoded?.id) {
            return next(new Error("In-Valid Token Data!", { cause: 404 }))
        }
        const user = await userModel.findById({ _id: decoded.id });
        if (!user) {
            // If the user is not found, return an error
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!user?.isOnline || user?.deletedAt || !user?.confirmEmail) {
            return res.status(404).json({ message: "Please logIn Again!" });
        }
        req.user = user;
        return next();
    })