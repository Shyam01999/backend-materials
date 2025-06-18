const User = require("../models/user.model");
const { verifyJWTToken } = require("../utils/authHelper");

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing',
            });
        }

        // Verify Bearer prefix and extract token
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authorization format. Use Bearer token',
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied! No token provided',
            });
        }

        const decodedToken = verifyJWTToken(token);

        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: "Access denied ! Please provide the correct token"
            })
        }

        const userdata = await User.findOne({ _id: decodedToken.id });
        req.user = userdata;
        return next()

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
    }
}

module.exports = isAuthenticated;

