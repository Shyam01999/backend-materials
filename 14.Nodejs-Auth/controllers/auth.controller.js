const User = require("../models/user.model");
const { generateHashPassword, createAccessToken, verifyHashPassword } = require("../utils/authHelper");

const register = async (req, res) => {
    try {
        let { username, email, password, role } = req.body;

        const checkRecord = await User.findOne({ $or: [{ username }, { email }] })

        if (checkRecord) {
            return res.status(400).json({
                success: false,
                message: "User with this provided username or email has already exist"
            })
        }

        //hash password
        password = await generateHashPassword(password);

        //create token
        const newUser = await User.create({
            username,
            email,
            password,
            role: role || 'user'
        });

        if (newUser) {
            const accessToken = createAccessToken({
                id: newUser._id,
                username,
                email,
                role
            });

            res.status(201).json({
                success: true,
                message: "Registration successfull",
                accessToken: accessToken,
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
        const { username, password } = req.body;
        
        const checkRecord = await User.findOne({ username });
        if (!checkRecord) {
            return res.status(400).json({
                success: false,
                message: "Username does not exist"
            })
        }

        const { _id: id, password: hashpassword, email, role } = checkRecord

        // check password
        const verifyPassword = await verifyHashPassword(hashpassword, password,);

        if (!verifyPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const accessToken = createAccessToken({
            id,
            username,
            email,
            role
        });

        res.status(200).json({
            success: true,
            message: "Login successfull",
            accessToken: accessToken,
            newUserKey: "test"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
    }
}

const changePassword = async (req, res) => {
    try {
        // const { oldPassword, newPassword } = req.body;
        const oldPassword = req.body?.oldPassword;
        const newPassword = req.body?.newPassword;

        if (!oldPassword || !newPassword) {
            return res.status(404).json({
                success: false,
                message: "Please enter your old password and new password",
            })
        };

        const { password, _id } = req.user;
        
        const verifyPassword = await verifyHashPassword(password, oldPassword);

        if (!verifyPassword) {
            return res.status(400).json({
                success: false,
                message: "Please enter your correct old password",
            })
        }

        const hashPassword = await generateHashPassword(newPassword)

        // Update the user's password
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { password: hashPassword },
            { new: true, select: 'email username' } // Return updated document, exclude password
        );

        if (!updatedUser) {
            return res.status(400).json({
                success: false,
                message: "Password Update failed",
            })
        }

        res.status(200).json({
            success: true,
            message: "New Password updated successfully",
            data: updatedUser
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: true,
            message: "Something went very wrong !Please try again"
        });
    }
}

module.exports = {
    register,
    login,
    changePassword,
}



