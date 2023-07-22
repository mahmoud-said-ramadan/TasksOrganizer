export const asyncHandler = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(error =>{
            console.log("asyncHandler");
            return next(new Error(error));
        });
    }
}


export const globalErrorHandling = (error, req, res, next)=>{
    console.log("globalErrorHandling");
    return res.status(error.cause || 500).json({
        message: error.message,
        error,
        stack:error.stack
    })
}