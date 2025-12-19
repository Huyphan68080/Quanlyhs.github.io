import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { studentsAPI, gradesAPI } from '../services/api';

export default function UserGradeView({ onLogout }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentGrades, setStudentGrades] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load classes on mount
  useEffect(() => {
    loadClasses();
  }, []);

  // Load students when class changes
  useEffect(() => {
    if (selectedClass) {
      loadStudentsByClass();
    }
  }, [selectedClass]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getClasses();
      setClasses(response.data || response);
      setError('');
    } catch (err) {
      setError('Lỗi tải danh sách lớp');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsByClass = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getByClass(selectedClass);
      setStudents(response.data || response);
      setSelectedStudent('');
      setStudentGrades([]);
      setTopStudents([]);
      setError('');
    } catch (err) {
      setError('Lỗi tải danh sách học sinh');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchStudent = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError('Vui lòng chọn học sinh');
      return;
    }

    try {
      setLoading(true);
      const grades = await gradesAPI.getByStudent(selectedStudent);
      setStudentGrades(grades.data || grades);
      setError('');
      
      // Load top students for comparison
      await loadTopStudents();
    } catch (err) {
      setError('Lỗi tải điểm của học sinh');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTopStudents = async () => {
    try {
      const response = await gradesAPI.getTopStudents(selectedClass);
      setTopStudents((response.data || response).slice(0, 3));
    } catch (err) {
      console.error('Lỗi tải top students:', err);
    }
  };

  const getAverageGrade = (grades) => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, g) => acc + (parseFloat(g.grade) || 0), 0);
    return (sum / grades.length).toFixed(2);
  };

  const prepareChartData = () => {
    return studentGrades.map(g => ({
      subject: g.subject || 'N/A',
      grade: parseFloat(g.grade) || 0,
      fullMark: 10
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tra Cứu Điểm</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm md:text-base"
        >
          Đăng Xuất
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <form onSubmit={handleSearchStudent} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Class Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn Lớp
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">-- Chọn lớp --</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn Học Sinh (Mã SV - Tên)
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!selectedClass || loading}
              >
                <option value="">-- Chọn học sinh --</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.studentCode} - {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedStudent || loading}
            className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tải...' : 'Tra Cứu'}
          </button>
        </form>
      </div>

      {/* Results */}
      {studentGrades.length > 0 && (
        <div className="space-y-6">
          {/* Student Info & Average Grade */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
              Kết Quả Tra Cứu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Học Sinh</p>
                <p className="text-lg font-bold text-blue-600">
                  {students.find(s => s._id === selectedStudent)?.name || 'N/A'}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Mã SV</p>
                <p className="text-lg font-bold text-green-600">
                  {students.find(s => s._id === selectedStudent)?.studentCode || 'N/A'}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Điểm Trung Bình</p>
                <p className="text-lg font-bold text-purple-600">
                  {getAverageGrade(studentGrades)}/10
                </p>
              </div>
            </div>
          </div>

          {/* Grades Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Biểu Đồ Điểm Các Môn</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="grade" fill="#3b82f6" name="Điểm" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Grades Table */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Chi Tiết Điểm Các Môn</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Môn Học</th>
                  <th className="px-4 py-2 text-left">Điểm</th>
                  <th className="px-4 py-2 text-left">Xếp Loại</th>
                </tr>
              </thead>
              <tbody>
                {studentGrades.map((grade, idx) => {
                  const gradeValue = parseFloat(grade.grade) || 0;
                  let gradeLevel = 'Cần Cải Thiện';
                  if (gradeValue >= 8) gradeLevel = 'Giỏi';
                  else if (gradeValue >= 6.5) gradeLevel = 'Khá';
                  else if (gradeValue >= 5) gradeLevel = 'Trung Bình';

                  return (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{grade.subject}</td>
                      <td className="px-4 py-2 font-bold text-blue-600">{grade.grade}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          gradeValue >= 8 ? 'bg-green-100 text-green-700' :
                          gradeValue >= 6.5 ? 'bg-blue-100 text-blue-700' :
                          gradeValue >= 5 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {gradeLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Top Students */}
          {topStudents.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                🏆 Top 3 Học Sinh Có Điểm Cao Nhất (Lớp {classes.find(c => c._id === selectedClass)?.name})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topStudents.map((student, idx) => {
                  const medals = ['🥇', '🥈', '🥉'];
                  return (
                    <div key={student._id} className="border-2 border-yellow-300 rounded-lg p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
                      <div className="text-3xl text-center mb-2">{medals[idx]}</div>
                      <p className="text-sm text-gray-600">Xếp Hạng {idx + 1}</p>
                      <p className="text-lg font-bold text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-600 mb-2">Mã SV: {student.studentCode}</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {student.averageGrade?.toFixed(2) || 'N/A'}/10
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {studentGrades.length === 0 && selectedClass && (
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">Chọn học sinh và nhấn "Tra Cứu" để xem điểm</p>
        </div>
      )}
    </div>
  );
}
