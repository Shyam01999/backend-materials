import jwt from 'jsonwebtoken';
import { redisClient } from '../index.js';
const isProduction = process.env.NODE_ENV === 'production';

const generateToken = async ({ id, res }) => {
    try {

        const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME });

        const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_TIME });

        const refreshTokenKey = `refresh_token:${id}`;

        await redisClient.setEx(refreshTokenKey, 7 * 24 * 60 * 60, refreshToken);

        res.cookie('accessToken', accessToken, {
            httpOnly: true, //only backend read token
            sameSite: 'strict', //XSS Attack
            secure: isProduction ? true : false, //CSRF(cross site request forgery) Attack
            maxAge: 1 * 60 * 1000 //expires in 1min
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, //only backend read token
            sameSite: "none", //XSS Attack
            secure: isProduction ? true : false, //CSRF(cross site request forgery) Attack
            maxAge: 7 * 24 * 60 * 60 * 1000 //expires in 7 days
        });

        return { accessToken, refreshToken }
    }
    catch (error) {
        console.log(`Error while generating token:`, error)
    }

}

const verifyRefreshToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
        
        if (!decoded) {
            return null;
        }

        const storedRefreshToken = await redisClient.get(`refresh_token:${decoded.id}`);
        
        if(storedRefreshToken == refreshToken){
            return decoded
        }

        return null;
    } catch (error) {
        return null
    }
}

const generateAccessToken = async({id, res}) =>{
    const accessToken = jwt.sign({id}, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn:process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME});

    res.cookie('accessToken', accessToken, {
            httpOnly: true, //only backend read token
            sameSite: 'strict', //XSS Attack
            secure: isProduction ? true : false, //CSRF(cross site request forgery) Attack
            maxAge: 1 * 60 * 1000 //expires in 1min
        });
}

const revokeRefreshToken = async(userId) =>{
    await redisClient.del(`refresh_token:${userId}`);
}

export {
    generateToken,
    verifyRefreshToken,
    generateAccessToken,
    revokeRefreshToken,

}