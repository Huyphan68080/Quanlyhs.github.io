import express from 'express';
import {
  getStudentGrades,
  updateStudentGrades,
  getClassGrades,
  getStudentGradesForUser,
  getTopStudentsByClass,
  getStudentGradesByCode
} from '../controllers/gradeController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes (authenticated users can access their own grades)
router.get('/student/:studentId', authenticateToken, getStudentGradesForUser);
router.get('/code/:maSv', authenticateToken, getStudentGradesByCode); // New route for searching by student code
router.get('/class/:classId/top-students', authenticateToken, getTopStudentsByClass);

// Admin routes (require authentication and admin role)
router.use(authenticateToken, authorizeAdmin);

router.get('/class/:className/grades', getClassGrades);
router.get('/:id/grades', getStudentGrades);
router.post('/:id/grades', updateStudentGrades);

export default router;
