const Product = require("../models/product.model");

const addProduct = async (req, res) => {
    try {

        const sampleProducts = [
            {
                name: "Laptop",
                category: "Electronics",
                price: 999,
                inStock: true,
                tags: ["computer", "tech"]
            },
            {
                name: "Smartphone",
                category: "Electronics",
                price: 699,
                inStock: true,
                tags: ["mobile", "tech"]
            },
            {
                name: "HeadPhone",
                category: "Electronics",
                price: 199,
                inStock: false,
                tags: ["audio", "tech"]
            },
            {
                name: "Running Shoes",
                category: "Sports",
                price: 89,
                inStock: true,
                tags: ["footwear", "running"]
            }
        ];

        for (let i = 0; i < sampleProducts.length; i++) {
            const sampleProduct = sampleProducts[i];

            const createRecord = await new Product({
                name: sampleProduct.name,
                category: sampleProduct.category,
                price: sampleProduct.price,
                inStock: sampleProduct.inStock,
                tags: sampleProduct.tags
            });

            createRecord.save();
        }


        res.status(201).json({
            success: true,
            message: "Product created successfully",
        });



        
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
    }
}

const getProduct = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Welcome to product page",
            data: req.user
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Welcome to product page",
            data: req.user
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Welcome to product page",
            data: req.user
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
    }
}

module.exports = {
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct,
}