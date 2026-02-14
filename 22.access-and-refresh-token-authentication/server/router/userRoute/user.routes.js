const { Router } = require("express");
const { register, login, getUserDetails, logout } = require("../../controller/user.controller");
const { registerValidator, validateHandler, loginValidator } = require("../../libs/validators");
const { isAuthenticated } = require("../../middleware/isAuthenticated");
const userRoutes = Router();

userRoutes.post("/register", registerValidator(), validateHandler, register);
userRoutes.post("/login", loginValidator(), validateHandler, login);
userRoutes.get("/logout", isAuthenticated, logout)
userRoutes.post("/details", getUserDetails);

module.exports = userRoutes;