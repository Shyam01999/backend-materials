const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, UserSession } = require("../model");
const AppError = require("./appError");
const { where } = require("sequelize");

const isProduction = process.env.NODE_ENV === 'production';

//create hash password
const generateHashPassword = async (password) => {
    const saltRound = 10;
    const hashpassword = await bcrypt.hash(password, saltRound);
    return hashpassword;
}

//validate hashpassword with password
const verifyHashPassword = async (hashpassword, password) => {
    const checkpassword = await bcrypt.compare(password, hashpassword);
    return checkpassword;
}

//create session table record
const createSession = async (userid, valid, { user_agent, ip }) => {
    const newSession = await UserSession.create({ userid, valid, user_agent, ip });

    if (!newSession) {
        return next(new AppError(`Session not created`, 500))
    }

    return newSession;
}

const createAccessToken = (accessTokenData) => {
    const { id, name, email, sessionId } = accessTokenData;
    return jwt.sign({ id, name, email, sessionId }, process.env.JWT_ACCESS_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }) //expiresin 15m
}

const createRefreshToken = (sessionId) => {
    return jwt.sign({ sessionId }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }) //expiresin 7day
}

const sendAcessTokenAndRefeshToken = (res, accessToken, refreshToken) => {
    //options for cookie
    // const cookieExpire = new Date(Date.now() + (process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000));
    const options = {
        httpOnly: process.env.HTTP_ONLY === "true" ? true : false, 
        secure: isProduction ? process.env.COOKIE_SECURE === "true" && true : false, //acess only in https
        sameSite: process.env.COOKIE_SAME_SITE, //FOR CSRF
        path: '/', 
    };

    res.cookie("access_token", accessToken, { ...options, maxAge: Number(process.env.COOKIE_ACCESS_TOKEN_EXPIRES) * 60 * 1000 });

    res.cookie("refresh_token", refreshToken, { ...options, maxAge: Number(process.env.COOKIE_REFRESH_TOKEN_EXPIRES) * 24 * 60 * 60 * 1000 });

}

//verify jwt Token
const verifyJWTToken = (token, secretKey) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return null; // or throw a custom error
    }
}

//create access token from refresh token
const refreshTokens = async (token) => {
    const decodedToken = verifyJWTToken(token, process.env.JWT_REFRESH_SECRET_KEY);

    const session = await UserSession.findByPk(decodedToken.sessionId);

    if (!session) {
        return next(new AppError(`Invalid Session`, 400))
    }

    const { userid } = session;

    const userdetails = await User.findByPk(userid)
    if (!userdetails) {
        return next(new AppError(`Invalid User`, 400))
    }

    const { username, email } = userdetails;

    const userinfo = {
        id: userid,
        name: username,
        email: email,
        sessionId: session.id,
    }

    const newaccessToken = createAccessToken(userinfo);

    const newrefreshToken = createRefreshToken(session.id);

    return { newaccessToken, newrefreshToken, user: userinfo }
}

const clearSession = async (sessionId) => {
    const session = await UserSession.findByPk(sessionId);
    // console.log("session", session)
    if (!session) {
        return next(new AppError("Session not found", 400));
    }

    await session.destroy();
    return { success: true, message: "Session cleared" };
}


module.exports = {
    generateHashPassword,
    verifyHashPassword,
    createSession,
    createAccessToken,
    createRefreshToken,
    sendAcessTokenAndRefeshToken,
    verifyJWTToken,
    refreshTokens,
    clearSession,


}