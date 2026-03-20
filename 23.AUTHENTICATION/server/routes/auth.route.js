import express from 'express';
import { loginUser, logoutUser, myProfile, refreshCSRF, refreshToken, register, verifyOtp, verifyToken } from '../controllers/auth.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { verifyCSRFToken } from '../middlewares/csrfMiddleware.js';

const authRoutes = express.Router();

authRoutes.post('/auth/register', register);
authRoutes.post('/verify/:token', verifyToken);
authRoutes.post('/auth/login', loginUser);
authRoutes.post('/verifyotp', verifyOtp);
authRoutes.get('/me', isAuthenticated, myProfile);
authRoutes.post('/refresh', refreshToken);
authRoutes.post('/logout', isAuthenticated, verifyCSRFToken, logoutUser);
authRoutes.post('/refresh-csrf', isAuthenticated, refreshCSRF)

export default authRoutes;