const { Router } = require("express");
const { register, login, getUserDetails } = require("../../controller/user.controller");
const { registerValidator, validateHandler, loginValidator } = require("../../libs/validators");
const userRoutes = Router();

userRoutes.post("/register", registerValidator(), validateHandler, register);
userRoutes.post("/login", loginValidator(), validateHandler, login);
userRoutes.post("/details", getUserDetails);

module.exports = userRoutes;