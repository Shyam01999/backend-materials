import express from 'express';
import { register, verifyToken } from '../controllers/auth.controller.js';

const authRoutes = express.Router();

authRoutes.post('/auth/register', register);
authRoutes.post('/verify/:token', verifyToken);

export default authRoutes;