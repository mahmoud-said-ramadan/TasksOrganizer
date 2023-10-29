
export const validation = (schema) => {
    return (req, res, next) => {
        const validationResult = schema.validate({ ...req.body, ...req.params, ...req.query, ...req.headers }, { abortEarly: false });
        if (validationResult.error) {
            return res.json({
                message: "Validation Error",
                validationErr: validationResult.error.details
            })
        }
        return next();
    }
}