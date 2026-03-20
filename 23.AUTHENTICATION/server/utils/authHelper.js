import jwt from 'jsonwebtoken';
import { redisClient } from '../index.js';
import { generateCSRFToken } from '../middlewares/csrfMiddleware.js';
const isProduction = process.env.NODE_ENV === 'production';

const options = {
            httpOnly: process.env.HTTP_ONLY === "true" ? true : false, //only backend read token
            secure: isProduction ? process.env.COOKIE_SECURE === "true" && true : true, //CSRF(Cross site request forgery)
            sameSite: process.env.COOKIE_SAME_SITE, //XSS Attack
            path: '/',
        };

const generateToken = async ({ id, res }) => {
    try {
        const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME });

        const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_TIME });

        const refreshTokenKey = `refresh_token:${id}`;

        await redisClient.setEx(refreshTokenKey, 7 * 24 * 60 * 60, refreshToken);

        res.cookie('accessToken', accessToken, {...options,
            maxAge: Number(process.env.COOKIE_ACCESS_TOKEN_EXPIRES) * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {...options,
            maxAge: Number(process.env.COOKIE_REFRESH_TOKEN_EXPIRES) * 24 * 60 * 60 * 1000
        });

        const csrfToken = await generateCSRFToken(id, res);

        return { accessToken, refreshToken, csrfToken };
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

        if (storedRefreshToken == refreshToken) {
            return decoded
        }

        return null;
    } catch (error) {
        return null
    }
}

const generateAccessToken = async ({ id, res }) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME });

    res.cookie('accessToken', accessToken, {...options,
            maxAge: Number(process.env.COOKIE_ACCESS_TOKEN_EXPIRES) * 60 * 1000
        });
}

const revokeRefreshToken = async (userId) => {
    await redisClient.del(`refresh_token:${userId}`);
}

export {
    generateToken,
    verifyRefreshToken,
    generateAccessToken,
    revokeRefreshToken,

}