import Joi from 'joi';


export const signUp = Joi.object({
    userName: Joi.string().trim().alphanum().min(3).max(25).required(),
    email: Joi.string().trim().email({ minDomainSegments: 2, maxDomainSegments: 4 }).required().lowercase(),
    password: Joi.string().trim().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: Joi.string().trim().valid(Joi.ref("password")).required(),
    age: Joi.number().integer().positive().min(12).max(120),
    gender: Joi.string().trim().valid('Male', 'Female').default('Male'),
    phone: Joi.string().trim().pattern(/^\+?[1-9]\d{1,11}$/).required(),
}).options({ allowUnknown: true }).required()

export const logIn = Joi.object({
    value: Joi.string().trim().custom((value, helpers) => {
        if (/\S+@\S+\.\S+/.test(value)) {
            return value.toLowerCase();
        } else if (/^[a-zA-Z0-9]+$/.test(value)) {
            return value;
        } else {
            return helpers.message('Invalid username or email');
        }
    }).required(),
    password: Joi.string().required()
}).options({ allowUnknown: true }).required()

export const changePassword = Joi.object({
    //body
    oldPassword: Joi.string().trim().required(),
    newPassword: Joi.string().trim().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cNewPassword: Joi.string().trim().valid(Joi.ref("newPassword")).required(),
    //headers
    authorization: Joi.string().trim().required()

}).options({ allowUnknown: true }).required()

export const updateUser = Joi.object({
    userName: Joi.string().trim().alphanum().min(3).max(25).required(),
    age: Joi.number().integer().positive().min(12).max(120),
    //headers
    authorization: Joi.string().trim().required()
}).options({ allowUnknown: true }).required()

export const validAuthorization = Joi.object({
    //headers
    authorization: Joi.string().trim().required()
}).options({ allowUnknown: true }).required()

export const addTask = Joi.object({
    title: Joi.string().trim().max(50).required(),
    description: Joi.string().trim().max(500),
    status: Joi.string().trim().valid('ToDo', 'Doing', 'Done').default('ToDo'),
    assignTo: Joi.string().trim().email({ minDomainSegments: 2, maxDomainSegments: 4 }).required().lowercase(),
    deadline: Joi.date(),
    //headers
    authorization: Joi.string().trim().required()

}).options({ allowUnknown: true }).required()

export const updateTask = Joi.object({
    taskId: Joi.string().trim().required(),
    title: Joi.string().trim().max(50).required(),
    description: Joi.string().trim().max(500),
    status: Joi.string().trim().valid('ToDo', 'Doing', 'Done').default('ToDo'),
    assignTo: Joi.string().trim().email({ minDomainSegments: 2, maxDomainSegments: 4 }).required().lowercase(),
    deadline: Joi.date(),
    //headers
    authorization: Joi.string().trim().required()

}).options({ allowUnknown: true }).required()

export const updateTaskStatus = Joi.object({
    taskId: Joi.string().trim().required(),
    status: Joi.string().trim().valid('ToDo', 'Doing', 'Done').default('ToDo'),
    //headers
    authorization: Joi.string().trim().required()

}).options({ allowUnknown: true }).required()

export const deleteTask = Joi.object({
    taskId: Joi.string().trim().required(),
    //headers
    authorization: Joi.string().trim().required()

}).options({ allowUnknown: true }).required()

export const tasksOfOneUser = Joi.object({
    //params
    userId: Joi.string().trim().required(),
}).options({ allowUnknown: true }).required()