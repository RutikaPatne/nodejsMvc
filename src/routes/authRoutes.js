import express from 'express';
import { register, loginFunction, logoutFunction,profile, updateUser, deleteUser } from '../controllers/authController.js'
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginFunction);
router.get('/profile', authMiddleware, profile);
router.post('/logout', logoutFunction);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);

export default router;
