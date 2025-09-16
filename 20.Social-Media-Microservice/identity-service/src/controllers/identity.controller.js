const logger = require("../utils/logger");
const User = require('..//models/user.model');
const { registerValidation } = require('../utils/validation');
const generateToken = require("../utils/generateToken");

//register
const register = async (req, res) => {
    logger.info('Register controller called');
    try {
        const {error} = registerValidation(req.body);
        if (error) {
            logger.warn('Validation error during registration', error.details[0].message);
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            logger.warn('User already exists with provided username or email');
            return res.status(400).json({
                success: false,
                message: "User with this provided username or email has already exist"
            })
        }

        const newUser = await new User({
            username,
            email,
            password
        });

        await newUser.save();
        logger.warn('User registered successfully', newUser._id);

        const {accessToken, refreshToken} = await generateToken(newUser);
        
        res.status(201).json({
            success: true,
            message: "Registration successful",
            accessToken:accessToken,
            refreshToken:refreshToken
        });
    }
    catch (error) {
        logger.error('Error in registration controller', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

//login

//logout


//profile

module.exports ={
    register
}