const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");
const { home } = require("../controllers/home.controller");


const homeRoutes = express.Router();

homeRoutes.get("/", isAuthenticated, isAdmin, home);

module.exports = homeRoutes;