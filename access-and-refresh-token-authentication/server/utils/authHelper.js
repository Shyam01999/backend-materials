const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, UserSession } = require("../model");
const AppError = require("./appError");
const { where } = require("sequelize");


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
    return jwt.sign({ id, name, email, sessionId }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }) //expiresin 15m
}

const createRefreshToken = (sessionId) => {
    return jwt.sign({ sessionId }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }) //expiresin 7day
}

const sendAcessTokenAndRefeshToken = (res, accessToken, refreshToken) => {
    //options for cookie
    // const cookieExpire = new Date(Date.now() + (process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000));
    const options = {
        httpOnly: process.env.HTTP_ONLY === "true",  // better to keep this true for security reasons
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: 'lax', // Adjust if needed
        path: '/', // Adjust if needed
        maxAge: 15 * 60 * 1000
    };

    res.cookie("access_token", accessToken, { ...options, maxAge: 15 * 60 * 1000 });

    res.cookie("refresh_token", refreshToken, { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 });

}

//verify jwt Token
const verifyJWTToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY)
}

//create access token from refresh token
const refreshTokens = async (token) => {
    const decodedToken = verifyJWTToken(token);

    // const session = await UserSession.findOne({ where: { id: decodedToken.sessionId } });
    const session = await UserSession.findByPk(decodedToken.sessionId);
    if (!userdetails) {
        return next(new AppError(`Invalid Session`, 400))
    }
    const { userid } = session;

    // const userdetails = await User.findOne({ where: { id: userid } })
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

    return { newaccessToken, newrefreshToken, user:userinfo }
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


}