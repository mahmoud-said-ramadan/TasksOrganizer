import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../utils/errorHandling.js";
import ErrorClass from "../utils/errorClass.js";
import userModel from "../../DB/models/user.model.js";

export const roles = {
    admin : 'Admin',
    user : 'User'
}
Object.freeze(roles)
export const auth = (roles = []) =>{
        return asyncErrorHandler(
        async(req,res,next) =>{
        const {authorization}=req.headers
    
        if(!authorization?.startsWith(process.env.BEARER_KEY)){
            return next(new ErrorClass("authorization is required or In-Valid Bearer key",StatusCodes.BAD_REQUEST))
        }
    
        const token = authorization.split(process.env.BEARER_KEY)[1]
        if (!token) {
            return next(new ErrorClass("token is required",StatusCodes.BAD_REQUEST))
        }
        const decoded = jwt.verify(token , process.env.TOKEN_SIGNATURE)
        if(!decoded?.id){
            return next(new ErrorClass("In-Valid token payload",StatusCodes.BAD_REQUEST))
        }
        const user = await userModel.findById(decoded.id)
        if(!user){
            return next(new ErrorClass("Not register account",StatusCodes.BAD_REQUEST))
        }
        if (!user.confirmed) {
            return next(new ErrorClass("you must confirm your email before login",StatusCodes.NOT_ACCEPTABLE))
        }
        if (!roles.includes(user.role)) {
            return next(new ErrorClass("Not authorized user to access here",StatusCodes.FORBIDDEN))
        }
        req.user = user
        return next()
        })
} 