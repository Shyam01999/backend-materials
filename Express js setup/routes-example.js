const express = require("express");
const app = express();

//root route
app.get("/", (req, res) => {
    res.send("Welcome to our home page")
});

//get all products
app.get("/products", (req, res) => {
    const products = [
        {
            id: 1,
            label: "Product 1"
        },

        {
            id: 2,
            label: "Product 2"
        },

        {
            id: 3,
            label: "Product 3"
        }
    ]

    res.json({
        message: "All Products:",
        data: products
    })
});

//get single products
app.get("/product/:id", (req, res) => {
    const products = [
        {
            id: 1,
            label: "Product 1"
        },

        {
            id: 2,
            label: "Product 2"
        },

        {
            id: 3,
            label: "Product 3"
        }
    ]

    const id = req.params.id;
    
    const productdata = products.find((item) => item.id == id);

    if(!productdata){
      return res.status(404).send("No Product found")
    }

    res.json({
        message: "Single Products:",
        data: productdata
    })
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});