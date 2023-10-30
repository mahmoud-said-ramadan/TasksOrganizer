import ErrorClass from "./errorClass.js";

export const errorHandel = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({
        status: err.statusCode,
        ErrorMessage: err.message,
    });
};



export const asyncErrorHandler = (endPoint) => {
    return (req, res, next) => {
        endPoint(req, res, next).catch((err) => {
            next(new ErrorClass(err, 500));
        });
    };
};
