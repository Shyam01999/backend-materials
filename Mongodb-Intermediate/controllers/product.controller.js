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

        // for (let i = 0; i < sampleProducts.length; i++) {
        //     const sampleProduct = sampleProducts[i];

        //     const createRecord = await new Product({
        //         name: sampleProduct.name,
        //         category: sampleProduct.category,
        //         price: sampleProduct.price,
        //         inStock: sampleProduct.inStock,
        //         tags: sampleProduct.tags
        //     });

        //     createRecord.save();
        // }

        const createRecord = await Product.insertMany(sampleProducts)

        res.status(201).json({
            success: true,
            message: `Inserted ${createRecord.length} sample products`,
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

        const result = await Product.aggregate([
            //stage 1
            {
                $match: {
                    inStock: true,
                    price: {
                        $gte: 100
                    }
                }
            },

            //stage 2 : group document
            {
                $group: {
                    _id: "$category",
                    avgPrice: {
                        $avg: "$price"
                    },
                    count: {
                        $sum: 1,
                    }
                }
            },

            //stage 3: project
            {
                $project: {
                    _id: 0,
                    avgPrice: 1,
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "List of All Products",
            data: result
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

const getProductAnalysis = async (req, res) => {
    try {

        const result = await Product.aggregate([{
            $match: {
                category: "Electronics"
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$price"
                },
                averagePrice: {
                    $avg: "$price"
                },
                maxProductPrice: {
                    $max: "$price"
                },
                minProductPrice: {
                    $min: "$price"
                }

            }
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
                averagePrice: 1,
                maxProductPrice: 1,
                minProductPrice: 1,
                priceRange: {
                    $subtract: ["$maxProductPrice", "$minProductPrice"],
                }

            }
        }
        ]);

        res.status(200).json({
            success: true,
            message: "Product with category electronics",
            data: result
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
    getProductAnalysis
}