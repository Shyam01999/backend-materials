const User = require("../models/user.model");
const { generateHashPassword } = require("../utils/authHelper");

const register = async (req, res) => {
    try {
        let { username, email, password, role } = req.body;

        const checkRecord = await User.findOne()

        if (checkRecord) {
            return res.status(400).json({
                success: false,
                message: "User with this provided username or email has already exist"
            })
        }

        //hash password
        password = await generateHashPassword(password);

        const newUser = await User.create({
            username,
            email,
            password,
            role: role || 'user'
        });

        if (newUser) {
            res.status(201).json({
                success: true,
                message: "Registration successfull",
                newUser
            })
        } else {
            res.status(400).json({
                success: false,
                message: "User creation failed"
            })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
    }
}

const login = async (req, res) => {
    try {

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
    }
}

module.exports = {
    register,
    login,

}

