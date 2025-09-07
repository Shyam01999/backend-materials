const express = require('express');
const { asyncHandler, APIError } = require('../middleware/errorHandler');

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

itemRoutes.post('/add-item', asyncHandler(async (req, res) => {
    if (!req.body.name || req.body.name.trim() === '') {
        throw new APIError('Item name is required', 400);
    }

    const newItem = {
        id: item.length + 1,
        name: req.body.name
    }

    item.push(newItem);

    res.status(201).json({
        status: true,
        data: newItem,
    })
}))

module.exports = itemRoutes;