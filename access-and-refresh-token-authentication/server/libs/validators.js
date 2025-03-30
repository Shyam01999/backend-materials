const { validationResult, body, param, query } = require("express-validator");
const AppError = require("../utils/appError");

const validateHandler = (req, res, next) => {
    const errors = validationResult(req);
    const errorMessage = errors.array().map((item) => item.msg).join(", ");

    if (errors.isEmpty()) {
        return next();
    } else {
        return next(new AppError(errorMessage, 400))
    }
}

const registerValidator = () => [
    body("email", "Please Enter Email").notEmpty(),
    body("username", "Please Enter Username").notEmpty(),
    body("password", "Please Enter Password").notEmpty(),
];

const loginValidator = () => [
    body("email", "Please Enter Email").notEmpty(),
    body("password", "Please Enter Password").notEmpty(),
];

module.exports = {
    validateHandler,
    registerValidator,
    loginValidator,
    

}