import { success } from 'zod';
import TryCatch from '../middlewares/TryCatch.js';
import db from '../models/index.js';
import { registerSchema } from '../validators/zod.js';
import { redisClient } from '../index.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import sendMail from '../services/sendMail.js';
import { getVerifyEmailHtml } from '../services/mailTemplate.js';

const {User} = db;

const register = TryCatch(async(req, res) => {
    const validateFields = registerSchema.safeParse(req.body);
    
    if(!validateFields.success){
        const zodError = validateFields.error;

        let firstErrorMessage = 'Validation Error';
        let allErros = [];

        if(zodError?.issues && Array.isArray(zodError?.issues)){
            allErros = zodError?.issues.map((issue) => {
                return (
                    {
                        field: issue.path ? issue.path?.join('.') : "unknown",
                        message: issue?.message || 'Validation Error',
                        code:issue.code
                    }
                )
            })


            firstErrorMessage = allErros[0]?.message || 'Validation Error'
        }

        return res.status(400).json({
            success:false,
            message:firstErrorMessage,
            error:allErros
        })
    }

    const {name, email, password, role} = validateFields.data;

    const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

    if(await redisClient.get(rateLimitKey)){
        return res.status(429).json({
            message:"Too many requests, try again later",
        });
    }

    //check user exist
    const checkUserExis = await User.findOne({where:{email}});

    if(checkUserExis){
        return res.status(400).json({
            success:false,
            message:"User already exists",
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString('hex');

    const verifyKey = `verify:${verifyToken}`;

    const dataToStore = {
        name,
        email,
        password:hashPassword,
    };

    await redisClient.set(verifyKey, JSON.stringify(dataToStore), {EX: 300});

    const subject = "verify your email for account creation";
    const html = getVerifyEmailHtml({email, token:verifyToken});

    await sendMail({email, subject, html});

    await redisClient.set(rateLimitKey, "true", {EX:60});

    res.status(200).json({
        success:true,
        message:"If your email is valid, a verification link has been sent. It will expire in 5 minutes."
    });
});

const verifyToken = TryCatch(async(req, res) =>{
    const {token} = req.params;

    if(!token){
        return res.status(400).json({
            success:false,
            message:"Verification token is required."
        })
    }

    const verifyKey = `verify:${token}`;

    const userDataJson = await redisClient.get(verifyKey);

    if(!userDataJson){
        return res.status(400).json({
            success:false,
            message:"Verification link expired"
        })
    }

    await redisClient.del(verifyKey);

    const userData = JSON.parse(userDataJson);

    //check user exist
    const checkUserExis = await User.findOne({where:{email: userData.email}});

    if(checkUserExis){
        return res.status(400).json({
            success:false,
            message:"User already exists",
        })
    }

    const newUser = await User.create({
        name:userData.name,
        email:userData.email,
        password:userData.password
    });

    res.status(201).json({
        success:true,
        message:`Email verification successfully! your account has been created successfully`,
        user:{
            id:newUser.id,
            name:newUser.name,
            email:newUser.email
        }
    })


})

export {
    register,
    verifyToken,

}