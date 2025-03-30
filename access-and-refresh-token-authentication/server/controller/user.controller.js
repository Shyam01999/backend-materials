const express = require("express");
const { User } = require("../model");
const AppError = require("../utils/appError");
const { generateHashPassword, verifyHashPassword, createSession, createAccessToken, createRefreshToken, sendAcessTokenAndRefeshToken } = require("../utils/authHelper");

const register = async (req, res, next) => {
    try {
        let { email, username, password } = req.body;

        const avatar = [];
        const role = "User";

        // hash password
        password = await generateHashPassword(password);

        const [checkEmailExist, checkUsernameExist] = await Promise.all([
            User.findOne({ where: { email } }),
            User.findOne({ where: { username } })
        ]);

        if (checkEmailExist) {
            return next(new AppError("User with the provided email already exists.", 400));
        }

        if (checkUsernameExist) {
            return next(new AppError("User with the provided username already exists.", 400));
        }

        // If email and username are unique, proceed with user registration
        const newUser = await User.create({ username, email, password, avatar: avatar.length ? avatar : null });

        if (!newUser) {
            return next(new AppError('Registration failed', 400));
        }
        const { id: userid } = newUser;

        //create record in session table
        const session = await createSession(userid, valid = true, { user_agent: req.headers['user-agent'], ip: req.clientIp });
        
        const accessToken = createAccessToken({
            id: userid,
            name: username,
            email: email,
            sessionId: session.id,
        });

        const refreshToken = createRefreshToken(session.id)

        sendAcessTokenAndRefeshToken(res, accessToken, refreshToken);

        res.status(201).json({ message: "Registration Successfull", userData: newUser, sessionDetails:session});
    }
    catch (error) {
        console.error("Registration error:", error);
        next(new AppError("Something went wrong! Please try again", 500));
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
       
        //check email exit
        const checkEmail = await User.findOne({ where: { email } });

        if (!checkEmail) {
            return next(new AppError(`Invalid credentials`, 400));
        }

        const { id: userid, password: hashpassword } = checkEmail;

        //verify password
        const verify = await verifyHashPassword(hashpassword, password);

        if (!verify) {
            return next(new AppError(`Invalid credentials`, 400));
        };

        //create record in session table
        const session = await createSession(userid, valid = true, { user_agent: req.headers['user-agent'], ip: req.clientIp })

        const accessToken = createAccessToken({
            id: userid,
            name: checkEmail.name,
            email: checkEmail.email,
            sessionId: session.id,
        });

        const refreshToken = createRefreshToken(session.id)

        sendAcessTokenAndRefeshToken(res, accessToken, refreshToken);

        res.status(200).json({ message: "Login Successfull", userData: checkEmail, session });
    }
    catch (error) {
        console.error("login error:", error);
        next(new AppError("Something went wrong! Please try again", 500));
    }
}

const getUserDetails = async (req, res) => {

}


module.exports = {
    register,
    login,
    getUserDetails,
}