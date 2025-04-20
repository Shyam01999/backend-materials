// const User = require("../models/user.model");
// const { generateHashPassword, createAccessToken, verifyHashPassword } = require("../utils/authHelper");

// const register = async (req, res) => {
//     try {
//         let { username, email, password, role } = req.body;

//         const checkRecord = await User.findOne({ $or: [{ username }, { email }] })

//         if (checkRecord) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User with this provided username or email has already exist"
//             })
//         }

//         //hash password
//         password = await generateHashPassword(password);

//         //create token
//         const newUser = await User.create({
//             username,
//             email,
//             password,
//             role: role || 'user'
//         });

//         if (newUser) {
//             const accessToken = createAccessToken({
//                 id: newUser._id,
//                 username,
//                 email,
//                 role
//             });

//             res.status(201).json({
//                 success: true,
//                 message: "Registration successfull",
//                 accessToken: accessToken,
//                 newUser
//             })
//         } else {
//             res.status(400).json({
//                 success: false,
//                 message: "User creation failed"
//             })
//         }
//     }
//     catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: "Something went wrong! Please try again"
//         })
//     }
// }

// const login = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         const checkRecord = await User.findOne({ username });

//         if (!checkRecord) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Username does not exist"
//             })
//         }
//         const { _id: id, password: hashpassword, email, role } = checkRecord

//         // check password
//         const verifyPassword = await verifyHashPassword(hashpassword, password,);

//         if (!verifyPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid credentials"
//             })
//         }

//         const accessToken = createAccessToken({
//             id,
//             username,
//             email,
//             role
//         });

//         res.status(201).json({
//             success: true,
//             message: "Login successfull",
//             accessToken: accessToken,
//         })
//     }
//     catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: "Something went wrong! Please try again"
//         })
//     }
// }

// module.exports = {
//     register,
//     login,
// }

