import { Student } from '../models/Student.js';
import { Grade } from '../models/Grade.js';

const SUBJECTS = ['Van', 'Toan', 'TiengAnh', 'Hoa', 'Su', 'Dia', 'VatLy', 'TheDuc'];

// Classification thresholds
const getClassification = (average) => {
  if (average >= 9.0) return 'Xuất sắc';
  if (average >= 7.0) return 'Giỏi';
  if (average >= 5.0) return 'Khá';
  if (average >= 2.0) return 'Trung Bình';
  return 'Yếu';
};

export const getClassesStats = async (req, res) => {
  try {
    const students = await Student.find();
    const classes = [...new Set(students.map(s => s.class))].sort();

    const classStats = [];

    for (const className of classes) {
      const classStudents = students.filter(s => s.class === className);
      if (classStudents.length === 0) continue;

      const studentIds = classStudents.map(s => s._id);
      const grades = await Grade.find({ studentId: { $in: studentIds } });

      // Calculate student averages (exclude TheDuc)
      const studentAverages = [];
      classStudents.forEach(student => {
        const studentGrades = grades.filter(g => g.studentId.toString() === student._id.toString() && g.subject !== 'TheDuc');
        if (studentGrades.length > 0) {
          const avg = studentGrades.reduce((sum, g) => sum + g.score, 0) / studentGrades.length;
          studentAverages.push(avg);
        }
      });

      // Calculate class average
      const classAverage = studentAverages.length > 0
        ? parseFloat((studentAverages.reduce((a, b) => a + b, 0) / studentAverages.length).toFixed(2))
        : 0;

      // Calculate distribution
      const distribution = {
        'Xuất sắc': 0,
        'Giỏi': 0,
        'Khá': 0,
        'Trung Bình': 0,
        'Yếu': 0
      };

      studentAverages.forEach(avg => {
        const classification = getClassification(avg);
        distribution[classification]++;
      });

      classStats.push({
        className,
        classAverage,
        studentCount: classStudents.length,
        distribution
      });
    }

    // Sort by average descending
    classStats.sort((a, b) => b.classAverage - a.classAverage);

    res.json({
      classes: classStats,
      highestClass: classStats.length > 0 ? classStats[0] : null,
      lowestClass: classStats.length > 0 ? classStats[classStats.length - 1] : null,
      totalStudents: students.length
    });
  } catch (error) {
    console.error('Get classes stats error:', error);
    res.status(500).json({ error: 'Failed to fetch class statistics' });
  }
};

export const getSubjectsStats = async (req, res) => {
  try {
    const grades = await Grade.find();

    const subjectStats = {};

    SUBJECTS.forEach(subject => {
      const subjectGrades = grades.filter(g => g.subject === subject);
      if (subjectGrades.length > 0) {
        const average = subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length;
        subjectStats[subject] = parseFloat(average.toFixed(2));
      } else {
        subjectStats[subject] = 0;
      }
    });

    res.json(subjectStats);
  } catch (error) {
    console.error('Get subjects stats error:', error);
    res.status(500).json({ error: 'Failed to fetch subject statistics' });
  }
};

export const getDistributionStats = async (req, res) => {
  try {
    const students = await Student.find();
    const studentIds = students.map(s => s._id);
    const grades = await Grade.find({ studentId: { $in: studentIds } });

    // Calculate distribution for all students (exclude TheDuc)
    const distribution = {
      'Xuất sắc': 0,
      'Giỏi': 0,
      'Khá': 0,
      'Trung Bình': 0,
      'Yếu': 0
    };

    const studentAverages = {};

    students.forEach(student => {
      const studentGrades = grades.filter(g => g.studentId.toString() === student._id.toString() && g.subject !== 'TheDuc');
      if (studentGrades.length > 0) {
        const avg = studentGrades.reduce((sum, g) => sum + g.score, 0) / studentGrades.length;
        studentAverages[student._id] = avg;
      }
    });

    Object.values(studentAverages).forEach(avg => {
      const classification = getClassification(avg);
      distribution[classification]++;
    });

    res.json(distribution);
  } catch (error) {
    console.error('Get distribution stats error:', error);
    res.status(500).json({ error: 'Failed to fetch distribution statistics' });
  }
};
