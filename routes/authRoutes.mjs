import express from 'express';
import { register, loginFunction,authMiddleware, logoutFunction,profile, updateUser, deleteUser } from '../controllers/authController.mjs';


const router = express.Router();

router.post('/register', register);
router.post('/login', loginFunction);
router.get('/profile', authMiddleware, profile);
router.post('/logout', logoutFunction);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);

export default router;
