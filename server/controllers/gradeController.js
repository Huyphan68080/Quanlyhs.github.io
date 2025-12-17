import { Grade } from '../models/Grade.js';
import { Student } from '../models/Student.js';
import { Classroom } from '../models/Classroom.js';

const SUBJECTS = ['Van', 'Toan', 'TiengAnh', 'Hoa', 'Su', 'Dia', 'VatLy', 'TheDuc'];

// Classification thresholds (non-overlapping ranges)
// Xuất sắc: 9.0 <= avg <= 10.0
// Giỏi: 7.0 <= avg < 9.0
// Khá: 5.0 <= avg < 7.0
// Trung Bình: 2.0 <= avg < 5.0
// Yếu: avg < 2.0
const getClassification = (average) => {
  if (average >= 9.0) return 'Xuất sắc';
  if (average >= 7.0) return 'Giỏi';
  if (average >= 5.0) return 'Khá';
  if (average >= 2.0) return 'Trung Bình';
  return 'Yếu';
};

export const getStudentGrades = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const grades = await Grade.find({ studentId: id });
    const gradesObj = {};
    let sum = 0;
    let count = 0;

    SUBJECTS.forEach(subject => {
      const gradeRecord = grades.find(g => g.subject === subject);
      gradesObj[subject] = gradeRecord ? gradeRecord.score : null;
      // Only include numeric scores in average calculation (exclude TheDuc)
      if (gradeRecord && subject !== 'TheDuc' && typeof gradeRecord.score === 'number') {
        sum += gradeRecord.score;
        count += 1;
      }
    });

    const average = count > 0 ? sum / count : 0;
    const classification = getClassification(average);

    res.json({
      student,
      grades: gradesObj,
      average: parseFloat(average.toFixed(2)),
      classification
    });
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

export const updateStudentGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const gradeData = req.body; // { Van: 8.5, Toan: 7, ..., TheDuc: "Đạt" or null }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Validate scores
    for (const [subject, score] of Object.entries(gradeData)) {
      if (!SUBJECTS.includes(subject)) {
        return res.status(400).json({ error: `Invalid subject: ${subject}` });
      }
      
      // Allow null to represent "no grade entered"
      if (score === null || score === undefined) {
        continue;
      }
      
      if (subject === 'TheDuc') {
        // TheDuc accepts "Đạt" or "Không Đạt"
        if (score !== 'Đạt' && score !== 'Không Đạt') {
          return res.status(400).json({ error: 'TheDuc must be "Đạt" or "Không Đạt"' });
        }
      } else {
        // Other subjects must be numbers between 0-10
        if (typeof score !== 'number' || score < 0 || score > 10) {
          return res.status(400).json({ error: `Score for ${subject} must be between 0 and 10` });
        }
      }
    }

    // Upsert grades (update if exists, create if not)
    for (const [subject, score] of Object.entries(gradeData)) {
      await Grade.findOneAndUpdate(
        { studentId: id, subject },
        { score },
        { upsert: true, new: true }
      );
    }

    // Fetch updated grades
    const grades = await Grade.find({ studentId: id });
    const gradesObj = {};
    let sum = 0;
    let count = 0;

    SUBJECTS.forEach(subject => {
      const gradeRecord = grades.find(g => g.subject === subject);
      gradesObj[subject] = gradeRecord ? gradeRecord.score : null;
      // Only include numeric scores in average calculation (exclude TheDuc)
      if (gradeRecord && subject !== 'TheDuc' && typeof gradeRecord.score === 'number') {
        sum += gradeRecord.score;
        count += 1;
      }
    });

    const average = count > 0 ? sum / count : 0;
    const classification = getClassification(average);

    res.json({
      student,
      grades: gradesObj,
      average: parseFloat(average.toFixed(2)),
      classification
    });
  } catch (error) {
    console.error('Update grades error:', error);
    res.status(500).json({ error: 'Failed to update grades' });
  }
};

export const getClassGrades = async (req, res) => {
  try {
    const { className } = req.params;

    const students = await Student.find({ class: className });
    if (students.length === 0) {
      return res.json({
        className,
        classAverage: 0,
        studentCount: 0,
        subjectAverages: {},
        distribution: {}
      });
    }

    const studentIds = students.map(s => s._id);

    // Get all grades for the class
    const grades = await Grade.find({ studentId: { $in: studentIds } });

    // Calculate subject averages (exclude TheDuc)
    const subjectAverages = {};
    SUBJECTS.forEach(subject => {
      const subjectGrades = grades.filter(g => g.subject === subject && g.subject !== 'TheDuc');
      if (subjectGrades.length > 0) {
        const avg = subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length;
        subjectAverages[subject] = parseFloat(avg.toFixed(2));
      } else {
        subjectAverages[subject] = 0;
      }
    });

    // Calculate student averages (exclude TheDuc)
    const studentAverages = {};
    students.forEach(student => {
      const studentGrades = grades.filter(g => g.studentId.toString() === student._id.toString() && g.subject !== 'TheDuc');
      if (studentGrades.length > 0) {
        const avg = studentGrades.reduce((sum, g) => sum + g.score, 0) / studentGrades.length;
        studentAverages[student._id] = avg;
      } else {
        studentAverages[student._id] = 0;
      }
    });

    // Calculate class average
    const classAverage = Object.values(studentAverages).length > 0
      ? parseFloat((Object.values(studentAverages).reduce((a, b) => a + b, 0) / Object.values(studentAverages).length).toFixed(2))
      : 0;

    // Calculate distribution
    const distribution = {
      'Xuất sắc': 0,
      'Giỏi': 0,
      'Khá': 0,
      'Trung Bình': 0,
      'Yếu': 0
    };

    Object.values(studentAverages).forEach(avg => {
      const classification = getClassification(avg);
      distribution[classification]++;
    });

    res.json({
      className,
      classAverage,
      studentCount: students.length,
      subjectAverages,
      distribution
    });
  } catch (error) {
    console.error('Get class grades error:', error);
    res.status(500).json({ error: 'Failed to fetch class grades' });
  }
};

// Get grades for a specific student (for user grade view)
export const getStudentGradesForUser = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const grades = await Grade.find({ studentId });
    const gradesArray = grades.map(g => ({
      subject: g.subject,
      grade: g.score
    }));

    res.json(gradesArray);
  } catch (error) {
    console.error('Get student grades for user error:', error);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

// Get top 3 students in a class by average grade
export const getTopStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const students = await Student.find({ class: classId });
    const studentIds = students.map(s => s._id);

    // Get all grades for these students
    const grades = await Grade.find({ studentId: { $in: studentIds } });

    // Calculate average for each student
    const studentAverages = students.map(student => {
      const studentGrades = grades.filter(
        g => g.studentId.toString() === student._id.toString() && g.subject !== 'TheDuc'
      );
      const avg = studentGrades.length > 0
        ? studentGrades.reduce((sum, g) => sum + g.score, 0) / studentGrades.length
        : 0;

      return {
        _id: student._id,
        name: student.name,
        studentCode: student.studentCode,
        averageGrade: parseFloat(avg.toFixed(2))
      };
    });

    // Sort by average grade descending and get top 3
    const topStudents = studentAverages
      .sort((a, b) => b.averageGrade - a.averageGrade)
      .slice(0, 3);

    res.json(topStudents);
  } catch (error) {
    console.error('Get top students error:', error);
    res.status(500).json({ error: 'Failed to fetch top students' });
  }
};

