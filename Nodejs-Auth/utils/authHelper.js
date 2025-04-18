const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

const createAccessToken = (accessTokenData) => {
    const { id, username, email, role } = accessTokenData;
    return jwt.sign({ id, username, email, role }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }) //expiresin 30m
}

//verify jwt Token
const verifyJWTToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return null; // or throw a custom error
    }
}

module.exports = {
    generateHashPassword,
    verifyHashPassword,
    createAccessToken,
    verifyJWTToken,
}