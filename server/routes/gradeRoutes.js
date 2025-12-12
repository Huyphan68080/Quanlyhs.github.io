import express from 'express';
import {
  getStudentGrades,
  updateStudentGrades,
  getClassGrades
} from '../controllers/gradeController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// All grade routes require authentication and admin role
router.use(authenticateToken, authorizeAdmin);

router.get('/class/:className/grades', getClassGrades);
router.get('/:id/grades', getStudentGrades);
router.post('/:id/grades', updateStudentGrades);

export default router;
