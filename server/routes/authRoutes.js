import express from 'express';
import { login, seedAdmin } from '../controllers/authController.js';

const router = express.Router();

// Auth endpoints (public)
router.post('/login', login);
router.post('/seed-admin', seedAdmin);

export default router;
