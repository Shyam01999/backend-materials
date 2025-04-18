const express = require("express");
const { imageUpload } = require("../controllers/image.controller");

const imageRoutes = express.Router();

imageRoutes.post("/upload", isAuthenticated, isAdmin, imageUpload)

module.exports = imageRoutes;