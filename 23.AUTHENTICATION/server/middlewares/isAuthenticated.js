import jwt from 'jsonwebtoken';
import { redisClient } from '../index.js';
import db from '../models/index.js';

const { User } = db;

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(403).json({
                success: false,
                message: 'Please login - no token'
            })
        }

        const decodedData = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

        if (!decodedData) {
            return res.status(401).json({
                success: false,
                message: "token expired"
            });
        }

        const cacheUser = await redisClient.get(`user:${decodedData.id}`);

        if (cacheUser) {
            req.user = JSON.parse(cacheUser);
            return next();
        }

        let user = await User.findByPk(decodedData.id, 
            { attributes: { exclude: ['password'] }, raw: true },);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: `No user found with this ${decodedData.id}`
            })
        }

        delete user.password;
        
        await redisClient.setEx(`user:${user.id}`, 3600, JSON.stringify(user));

        req.user = user;

        next();
    } catch (error) {
        console.log("Error while authenticate user", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export default isAuthenticated;