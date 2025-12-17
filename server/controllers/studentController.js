import { Student } from '../models/Student.js';
import { Grade } from '../models/Grade.js';
import { Classroom } from '../models/Classroom.js';

export const getAllStudents = async (req, res) => {
  try {
    const { className, maSv } = req.query;
    let query = {};

    if (className) {
      query.class = className;
    }
    if (maSv) {
      query.maSv = { $regex: maSv, $options: 'i' };
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { maSv, name, class: className } = req.body;

    if (!maSv || !name || !className) {
      return res.status(400).json({ error: 'Missing required fields: maSv, name, class' });
    }

    // Check for duplicate maSv
    const existing = await Student.findOne({ maSv });
    if (existing) {
      return res.status(400).json({ error: 'Student ID already exists' });
    }

    const student = new Student({
      maSv,
      name,
      class: className
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete associated grades
    await Grade.deleteMany({ studentId: id });

    // Delete student
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Classroom.find().sort({ name: 1 });
    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

// Get students by class ID
export const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const students = await Student.find({ class: classId }).sort({ name: 1 });
    res.json(students);
  } catch (error) {
    console.error('Get students by class error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};
