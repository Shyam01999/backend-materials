const express = require("express");
const { addProduct, getProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
// const isAuthenticated = require("../middlewares/isAuthenticated");
// const isAdmin = require("../middlewares/isAdmin");
// const { home } = require("../controllers/home.controller");
const productRoutes = express.Router();

productRoutes.post("/add", addProduct);
productRoutes.get("/getall", getProduct);
productRoutes.put("/update", updateProduct);
productRoutes.delete("/delete", deleteProduct);

module.exports = productRoutes;