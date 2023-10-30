import { StatusCodes } from "http-status-codes"
import ErrorClass from "../../../utils/errorClass.js"
import userModel from "../../../../DB/Models/User.model.js"



export const logout = async(req,res,next)=>{
        if(!req.user.loggedIn){
            return next(new ErrorClass("This User is Already LoggedOut ",StatusCodes.BAD_REQUEST))
        }
            const user = await userModel.findByIdAndUpdate(req.user._id,{loggedIn:false},{new:true})
            return res.status(StatusCodes.ACCEPTED).json({message:"User LoggedOut Sucessfully",user})
        
}
