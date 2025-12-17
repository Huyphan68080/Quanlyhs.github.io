import express from 'express';
import {
  getAllStudents,
  createStudent,
  deleteStudent,
  getStudentById,
  getAllClasses,
  getStudentsByClass
} from '../controllers/studentController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public/user routes
router.get('/classes/list', authenticateToken, getAllClasses);
router.get('/class/:classId', authenticateToken, getStudentsByClass);

// Admin routes (require authentication and admin role)
router.use(authenticateToken, authorizeAdmin);

router.get('/', getAllStudents);
router.post('/', createStudent);
router.delete('/:id', deleteStudent);
router.get('/:id', getStudentById);

export default router;
