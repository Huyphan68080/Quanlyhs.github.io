import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { gradesAPI, getAccessToken } from '../services/api';

export default function UserGradeView({ onLogout }) {
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [studentGrades, setStudentGrades] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [average, setAverage] = useState(0);
  const [classification, setClassification] = useState('');

  // Load on mount
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setIsReady(true);
    } else {
      setError('Vui lòng đăng nhập lại');
    }
  }, []);

  const handleSearchStudent = async (e) => {
    e.preventDefault();
    
    if (!studentCodeInput.trim()) {
      setError('Vui lòng nhập mã học sinh');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Call API to get grades by student code (maSv)
      const response = await gradesAPI.getStudentGradesByCode(studentCodeInput.trim());
      
      setStudentInfo(response.data.student);
      
      // Convert grades object to array for display
      const gradesArray = Object.entries(response.data.grades).map(([subject, score]) => ({
        subject,
        grade: score
      }));
      
      setStudentGrades(gradesArray);
      setAverage(response.data.average);
      setClassification(response.data.classification);
    } catch (err) {
      console.error('Lỗi tải điểm:', err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        onLogout();
      } else if (err.response?.status === 404) {
        setError('Không tìm thấy học sinh với mã này');
      } else {
        setError('Lỗi tải điểm: ' + (err.response?.data?.error || err.message));
      }
      setStudentGrades([]);
      setStudentInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const getAverageGrade = (grades) => {
    if (grades.length === 0) return 0;
    const numericGrades = grades.filter(g => typeof g.grade === 'number').map(g => g.grade);
    if (numericGrades.length === 0) return 0;
    const sum = numericGrades.reduce((acc, g) => acc + g, 0);
    return (sum / numericGrades.length).toFixed(2);
  };

  const prepareChartData = () => {
    return studentGrades
      .filter(g => typeof g.grade === 'number') // Exclude TheDuc which is string
      .map(g => ({
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhập Mã Học Sinh
            </label>
            <input
              type="text"
              value={studentCodeInput}
              onChange={(e) => setStudentCodeInput(e.target.value)}
              placeholder="Nhập mã HS..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={!studentCodeInput.trim() || loading}
            className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tải...' : 'Tra Cứu'}
          </button>
        </form>
      </div>

      {/* Results */}
      {studentGrades.length > 0 && studentInfo && (
        <div className="space-y-6">
          {/* Student Info & Average Grade */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
              Kết Quả Tra Cứu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Học Sinh</p>
                <p className="text-lg font-bold text-blue-600">
                  {studentInfo.name || 'N/A'}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Mã HS</p>
                <p className="text-lg font-bold text-green-600">
                  {studentInfo.maSv || 'N/A'}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Lớp</p>
                <p className="text-lg font-bold text-purple-600">
                  {studentInfo.class || 'N/A'}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Điểm Trung Bình</p>
                <p className="text-lg font-bold text-orange-600">
                  {average}/10
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <p className="text-gray-600 text-sm">Xếp Loại</p>
              <p className="text-lg font-bold text-indigo-600">
                {classification}
              </p>
            </div>
          </div>

          {/* Grades Chart */}
          {prepareChartData().length > 0 && (
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
          )}

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
                  let gradeLevel = 'Chưa có';
                  let colorClass = 'bg-gray-100 text-gray-700';
                  
                  if (grade.grade === null || grade.grade === undefined) {
                    gradeLevel = 'Chưa có';
                    colorClass = 'bg-gray-100 text-gray-700';
                  } else if (typeof grade.grade === 'string') {
                    // For TheDuc (Thể Dục)
                    if (grade.grade === 'Đạt' || grade.grade === 'dat') {
                      gradeLevel = 'Đạt';
                      colorClass = 'bg-green-100 text-green-700';
                    } else if (grade.grade === 'Không Đạt' || grade.grade === 'khong dat') {
                      gradeLevel = 'Không Đạt';
                      colorClass = 'bg-red-100 text-red-700';
                    } else {
                      gradeLevel = grade.grade;
                      colorClass = 'bg-gray-100 text-gray-700';
                    }
                  } else {
                    const gradeValue = parseFloat(grade.grade) || 0;
                    if (gradeValue >= 8) {
                      gradeLevel = 'Giỏi';
                      colorClass = 'bg-green-100 text-green-700';
                    } else if (gradeValue >= 6.5) {
                      gradeLevel = 'Khá';
                      colorClass = 'bg-blue-100 text-blue-700';
                    } else if (gradeValue >= 5) {
                      gradeLevel = 'Trung Bình';
                      colorClass = 'bg-yellow-100 text-yellow-700';
                    } else {
                      gradeLevel = 'Yếu';
                      colorClass = 'bg-red-100 text-red-700';
                    }
                  }

                  return (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{grade.subject}</td>
                      <td className="px-4 py-2 font-bold text-blue-600">{grade.grade !== null ? grade.grade : 'Chưa có'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${colorClass}`}>
                          {gradeLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {studentGrades.length === 0 && isReady && (
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">Nhập mã học sinh và nhấn "Tra Cứu" để xem điểm</p>
        </div>
      )}
    </div>
  );
}
