const express = require("express");
const { register, login, changePassword } = require("../controllers/auth.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login );
authRoutes.put("/updatepassword", isAuthenticated, changePassword);


module.exports = authRoutes;