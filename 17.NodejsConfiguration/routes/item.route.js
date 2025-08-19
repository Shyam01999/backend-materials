const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');

const itemRoutes = express.Router();

const item = [
    {
        id: 1,
        name: "Item 1"
    },
    {
        id: 2,
        name: "Item 2"
    },
    {
        id: 3,
        name: "Item 3"
    },
    {
        id: 4,
        name: "Item 4"
    },
    {
        id: 5,
        name: "Item 5"
    }
]

itemRoutes.get('/items', asyncHandler(async (req, res) => {
    res.status(200).json({
        status: true,
        data: item,
    })
}));

module.exports = itemRoutes;