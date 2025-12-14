import React, { useState, useEffect } from 'react';
import { gradesAPI } from '../services/api.js';

const SUBJECTS = [
  { key: 'Van', label: 'Văn' },
  { key: 'Toan', label: 'Toán' },
  { key: 'TiengAnh', label: 'Tiếng Anh' },
  { key: 'Hoa', label: 'Hóa' },
  { key: 'Su', label: 'Sử' },
  { key: 'Dia', label: 'Địa' },
  { key: 'VatLy', label: 'Vật Lý' },
  { key: 'TheDuc', label: 'Thể Dục' }
];

const getClassification = (average) => {
  if (average >= 9.0) return 'Xuất sắc';
  if (average >= 7.0) return 'Giỏi';
  if (average >= 5.0) return 'Khá';
  if (average >= 2.0) return 'Trung Bình';
  return 'Yếu';
};

const getClassificationColor = (classification) => {
  switch (classification) {
    case 'Xuất sắc': return 'text-yellow-600 bg-yellow-100';
    case 'Giỏi': return 'text-green-600 bg-green-100';
    case 'Khá': return 'text-blue-600 bg-blue-100';
    case 'Trung Bình': return 'text-orange-600 bg-orange-100';
    case 'Yếu': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export default function StudentDetail({ student, onBack, onRefresh, onRefreshCharts, onRefreshStudents, onUpdateStudent }) {
  const [grades, setGrades] = useState(student?.grades || {});
  const [average, setAverage] = useState(student?.average || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch grades from server when component mounts or student changes
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const response = await gradesAPI.getStudentGrades(student._id);
        console.log('Fetched grades response:', response.data);
        setGrades(response.data.grades);
        setAverage(response.data.average);
        setError('');
      } catch (err) {
        console.error('Failed to fetch grades:', err);
        setError('Không thể tải điểm');
        // Fallback to props data if fetch fails
        setGrades(student?.grades || {});
        setAverage(student?.average || 0);
      } finally {
        setLoading(false);
      }
    };

    if (student?._id) {
      fetchGrades();
    }
  }, [student?._id]);

  const handleGradeChange = (subject, value) => {
    if (subject === 'TheDuc') {
      // Thể Dục: lưu "Đạt" hoặc "Không Đạt"
      const newGrades = { ...grades, [subject]: value };
      setGrades(newGrades);
      
      // Calculate new average (exclude Thể Dục) - chỉ lấy những môn có điểm
      const values = SUBJECTS.filter(s => s.key !== 'TheDuc')
        .map(s => parseFloat(newGrades[s.key]))
        .filter(v => !isNaN(v) && v !== null);
      const newAverage = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      setAverage(parseFloat(newAverage.toFixed(2)));
    } else {
      const numValue = parseFloat(value);
      if (numValue >= 0 && numValue <= 10) {
        const newGrades = { ...grades, [subject]: numValue };
        setGrades(newGrades);
        
        // Calculate new average (exclude Thể Dục) - chỉ lấy những môn có điểm
        const values = SUBJECTS.filter(s => s.key !== 'TheDuc')
          .map(s => parseFloat(newGrades[s.key]))
          .filter(v => !isNaN(v) && v !== null);
        const newAverage = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        setAverage(parseFloat(newAverage.toFixed(2)));
      }
    }
  };

  const handleSaveGrades = async () => {
    try {
      setLoading(true);
      setError('');
      const gradeData = {};
      SUBJECTS.forEach(subject => {
        // Only send grades that are not null/undefined (only changed values)
        if (grades[subject.key] !== null && grades[subject.key] !== undefined) {
          gradeData[subject.key] = grades[subject.key];
        }
      });
      
      // Check if any grades were entered
      if (Object.keys(gradeData).length === 0) {
        setError('Vui lòng nhập ít nhất một điểm');
        setLoading(false);
        return;
      }
      
      console.log('Sending grade data:', gradeData);
      const response = await gradesAPI.updateStudentGrades(student._id, gradeData);
      console.log('Response from update:', response.data);
      setGrades(response.data.grades);
      setAverage(response.data.average);
      setIsEditing(false);
      setSuccess('Điểm được cập nhật thành công');
      
      // Update parent component with new student data
      if (onUpdateStudent) {
        onUpdateStudent({
          ...student,
          grades: response.data.grades,
          average: response.data.average
        });
      }
      
      // Trigger refresh in parent components immediately
      if (onRefresh) {
        onRefresh();
      }
      if (onRefreshCharts) {
        onRefreshCharts();
      }
      if (onRefreshStudents) {
        onRefreshStudents();
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update grades');
    } finally {
      setLoading(false);
    }
  };

  const classification = getClassification(average);

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-semibold"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{student?.name}</h1>
            <p className="text-gray-500 mt-1">Mã: {student?.maSv}</p>
            <p className="text-gray-500">Lớp: <span className="font-semibold text-blue-600">{student?.class}</span></p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg btn-ripple smooth-transition"
          >
            {isEditing ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grades Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Điểm các môn</h2>
          <div className="space-y-4">
            {SUBJECTS.map((subject) => (
              <div key={subject.key} className="flex items-center justify-between">
                <label className="font-medium text-gray-700 w-24">{subject.label}</label>
                {isEditing ? (
                  subject.key === 'TheDuc' ? (
                    <select
                      value={grades[subject.key] ?? ''}
                      onChange={(e) => handleGradeChange(subject.key, e.target.value)}
                      className="flex-1 mx-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Chọn --</option>
                      <option value="Đạt">Đạt</option>
                      <option value="Không Đạt">Không Đạt</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={grades[subject.key] ?? ''}
                      onChange={(e) => handleGradeChange(subject.key, e.target.value)}
                      className="flex-1 mx-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )
                ) : (
                  <div className="flex-1 mx-4 px-3 py-2 bg-gray-50 rounded-lg">
                    {grades[subject.key] !== null && grades[subject.key] !== undefined ? (
                      <span className={`font-semibold ${
                        subject.key === 'TheDuc' 
                          ? grades[subject.key] === 'Đạt' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                          : 'text-gray-900'
                      }`}>
                        {grades[subject.key]}
                      </span>
                    ) : (
                      <span className="text-gray-400">Chưa có điểm</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <button
              onClick={handleSaveGrades}
              disabled={loading}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg btn-ripple smooth-transition disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu điểm'}
            </button>
          )}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Tóm tắt</h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Điểm trung bình</p>
              <div className="text-4xl font-bold text-blue-600">{average.toFixed(2)}</div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Xếp loại</p>
              <div className={`px-4 py-2 rounded-lg font-semibold text-center ${getClassificationColor(classification)}`}>
                {classification}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Xuất sắc (9.0-10.0)</span>
                </div>
                <div className="flex justify-between">
                  <span>Giỏi (7.0-8.9)</span>
                </div>
                <div className="flex justify-between">
                  <span>Khá (5.0-6.9)</span>
                </div>
                <div className="flex justify-between">
                  <span>Trung bình (2.0-4.9)</span>
                </div>
                <div className="flex justify-between">
                  <span>Yếu (&lt;2.0)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
