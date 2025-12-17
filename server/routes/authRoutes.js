import express from 'express';
import { login, register, seedAdmin } from '../controllers/authController.js';

const router = express.Router();

// Auth endpoints (public)
router.post('/login', login);
router.post('/register', register);
router.post('/seed-admin', seedAdmin);

export default router;
