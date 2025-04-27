const express = require("express");
const { imageUpload, getAllImage, deleteImage } = require("../controllers/image.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

const imageRoutes = express.Router();

imageRoutes.post("/upload", isAuthenticated, isAdmin(["admin"]), uploadMiddleware.single("image"), imageUpload);
imageRoutes.get("/allimages", isAuthenticated, getAllImage);
imageRoutes.delete("/deleteimage/:id", isAuthenticated, deleteImage)

module.exports = imageRoutes;