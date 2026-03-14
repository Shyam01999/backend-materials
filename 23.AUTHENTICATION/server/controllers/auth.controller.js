
import TryCatch from '../middlewares/TryCatch.js';
import db from '../models/index.js';
import { loginSchema, registerSchema } from '../validators/zod.js';
import { redisClient } from '../index.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import sendMail from '../services/sendMail.js';
import { getOtpHtml, getVerifyEmailHtml } from '../services/mailTemplate.js';
import { generateAccessToken, generateToken, revokeRefreshToken, verifyRefreshToken } from '../utils/authHelper.js';
import { success } from 'zod';

const { User } = db;

const register = TryCatch(async (req, res) => {
    const validateFields = registerSchema.safeParse(req.body);

    if (!validateFields.success) {
        const zodError = validateFields.error;

        let firstErrorMessage = 'Validation Error';
        let allErros = [];

        if (zodError?.issues && Array.isArray(zodError?.issues)) {
            allErros = zodError?.issues.map((issue) => {
                return (
                    {
                        field: issue.path ? issue.path?.join('.') : "unknown",
                        message: issue?.message || 'Validation Error',
                        code: issue.code
                    }
                )
            })


            firstErrorMessage = allErros[0]?.message || 'Validation Error'
        }

        return res.status(400).json({
            success: false,
            message: firstErrorMessage,
            error: allErros
        })
    }

    const { name, email, password, role } = validateFields.data;

    const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

    if (await redisClient.get(rateLimitKey)) {
        return res.status(429).json({
            message: "Too many requests, try again later",
        });
    }

    //check user exist
    const checkUserExis = await User.findOne({ where: { email } });

    if (checkUserExis) {
        return res.status(400).json({
            success: false,
            message: "User already exists",
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString('hex');

    const verifyKey = `verify:${verifyToken}`;

    const dataToStore = {
        name,
        email,
        password: hashPassword,
    };

    await redisClient.set(verifyKey, JSON.stringify(dataToStore), { EX: 300 });

    const subject = "verify your email for account creation";
    const html = getVerifyEmailHtml({ email, token: verifyToken });

    await sendMail({ email, subject, html });

    await redisClient.set(rateLimitKey, "true", { EX: 60 });

    res.status(200).json({
        success: true,
        message: "If your email is valid, a verification link has been sent. It will expire in 5 minutes."
    });
});

const verifyToken = TryCatch(async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Verification token is required."
        })
    }

    const verifyKey = `verify:${token}`;

    const userDataJson = await redisClient.get(verifyKey);

    if (!userDataJson) {
        return res.status(400).json({
            success: false,
            message: "Verification link expired"
        })
    }

    await redisClient.del(verifyKey);

    const userData = JSON.parse(userDataJson);

    //check user exist
    const checkUserExis = await User.findOne({ where: { email: userData.email } });

    if (checkUserExis) {
        return res.status(400).json({
            success: false,
            message: "User already exists",
        })
    }

    const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password
    });

    res.status(201).json({
        success: true,
        message: `Email verification successfully! your account has been created successfully`,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    })


})

const loginUser = TryCatch(async (req, res) => {
    const validateFields = loginSchema.safeParse(req.body);

    if (!validateFields.success) {
        const zodError = validateFields.error;

        let firstErrorMessage = 'Validation Error';
        let allErros = [];

        if (zodError?.issues && Array.isArray(zodError?.issues)) {
            allErros = zodError?.issues.map((issue) => {
                return (
                    {
                        field: issue.path ? issue.path?.join('.') : "unknown",
                        message: issue?.message || 'Validation Error',
                        code: issue.code
                    }
                )
            })

            firstErrorMessage = allErros[0]?.message || 'Validation Error'
        }

        return res.status(400).json({
            success: false,
            message: firstErrorMessage,
            error: allErros
        })
    }

    const { email, password } = validateFields.data;

    const rateLimitKey = `login-rate-limit:${req.ip}-${req.email}`;

    if (await redisClient.get(rateLimitKey)) {
        return res.status(429).json({
            message: "Too many requests, try again later",
        });
    }

    const userExist = await User.findOne({ where: { email } });

    if (!userExist) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Credentials'
        })
    }

    const verifyPassword = await bcrypt.compare(password, userExist.password);

    if (!verifyPassword) {
        return res.status(400).json({
            success: false,
            message: "Invalid Credentials"
        })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpKey = `otp:${email}`;

    await redisClient.set(otpKey, JSON.stringify(otp), { EX: 300 })

    const subject = 'Otp for verification';

    const html = getOtpHtml({ email, otp });

    await sendMail({ email, subject, html });

    await redisClient.set(rateLimitKey, "true", { EX: 60 });

    res.status(200).json({
        success: true,
        message: `If your email is valid, an otp has been sent. it will valid for 5 min`,
    });
});

const verifyOtp = TryCatch(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and Otp is required"
        });
    }

    //verify otp;
    const otpKey = `otp:${email}`;
    const storedOtpString = await redisClient.get(otpKey);

    if (!storedOtpString) {
        return res.status(400).json({
            success: false,
            message: "Otp is expired"
        })
    }

    const storedOtp = JSON.parse(storedOtpString)

    if (storedOtp != otp) {
        return res.status(400).json({
            success: false,
            message: "Otp did not match, Please provide correct otp"
        });
    }

    await redisClient.del(storedOtp);

    const result = await User.findOne({ where: { email } });

    const user = result.toJSON();
    delete user.password;

    if (!user) {
        return res.status().json({
            success: false,
            message: 'User not found with the provided email'
        })
    }

    const token = await generateToken({ id: user.id, res });

    res.status(200).json({
        success: true,
        message: `Welcome ${user.name}`,
        data: user
    })

});

const myProfile = TryCatch(async (req, res) => {

    const user = req.user;
    res.status(200).json({
        success: true,
        message: 'User details fetched',
        data: user
    })

});

const refreshToken = TryCatch(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if(!refreshToken){
        return res.status(401).json({
            success:false,
            message:"Invalid Refresh Token."
        })
    }

    const validateToken = await verifyRefreshToken(refreshToken);
    
    if(!validateToken){
        return res.status(401).json({
            success:false,
            message:"Provided Invalid Refresh Token."
        })
    }

    generateAccessToken({id: validateToken.id, res});

    res.status(200).json({
        success:true,
        message:"Token Refreshed"
    });
});

const logoutUser = TryCatch(async (req, res)=>{
    const userId = req.user.id;
    
    await revokeRefreshToken(userId);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    await redisClient.del(`user:${userId}`);

    res.status(200).json({
        success:true,
        message:"Logged out Successfully"
    })
})



export {
    register,
    verifyToken,
    loginUser,
    verifyOtp,
    myProfile,
    refreshToken,
    logoutUser
}