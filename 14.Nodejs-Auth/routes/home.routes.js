const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");
const { home } = require("../controllers/home.controller");


const homeRoutes = express.Router();

homeRoutes.get("/dashboard", isAuthenticated, isAdmin(["admin"]), home);

module.exports = homeRoutes;