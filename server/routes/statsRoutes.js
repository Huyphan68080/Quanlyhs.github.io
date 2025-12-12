import express from 'express';
import {
  getClassesStats,
  getSubjectsStats,
  getDistributionStats
} from '../controllers/statsController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// All stats routes require authentication and admin role
router.use(authenticateToken, authorizeAdmin);

router.get('/classes', getClassesStats);
router.get('/subjects', getSubjectsStats);
router.get('/distribution', getDistributionStats);

export default router;
