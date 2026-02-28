import express from 'express';
import { loginUser, logoutUser, myProfile, refreshToken, register, verifyOtp, verifyToken } from '../controllers/auth.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const authRoutes = express.Router();

authRoutes.post('/auth/register', register);
authRoutes.post('/verify/:token', verifyToken);
authRoutes.post('/auth/login', loginUser);
authRoutes.post('/verifyotp', verifyOtp);
authRoutes.get('/me', isAuthenticated, myProfile);
authRoutes.post('/refresh', refreshToken);
authRoutes.post('/logout', isAuthenticated, logoutUser)

export default authRoutes;