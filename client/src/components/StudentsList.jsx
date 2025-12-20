import React, { useState, useEffect } from 'react';
import { studentsAPI, gradesAPI } from '../services/api.js';

const CLASSES = ['10A1', '10A2', '10A3', '10A4', '10A5', '10A6', '10A7', '10A8', '10A9', '10A10',
                 '11A1', '11A2', '11A3', '11A4', '11A5', '11A6', '11A7', '11A8', '11A9', '11A10',
                 '12A1', '12A2', '12A3', '12A4', '12A5', '12A6', '12A7', '12A8', '12A9', '12A10'];

export default function StudentsList({ onSelectStudent, onNavigate }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [searchMaSv, setSearchMaSv] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ maSv: '', name: '', class: '10A1' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, searchMaSv]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getAll(selectedClass, searchMaSv);
      setStudents(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await studentsAPI.create(newStudent.maSv, newStudent.name, newStudent.class);
      setNewStudent({ maSv: '', name: '', class: '10A1' });
      setShowAddModal(false);
      setToast('Học sinh được thêm thành công');
      fetchStudents();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add student');
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await studentsAPI.delete(id);
      setToast('Học sinh được xóa thành công');
      setDeleteConfirm(null);
      fetchStudents();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete student');
    }
  };

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản Lý Học Sinh</h1>
        <p className="text-sm md:text-base text-gray-500 mt-2">Danh sách và quản lý thông tin học sinh</p>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 left-4 md:left-auto bg-green-500 text-white px-4 md:px-6 py-3 rounded-lg shadow-lg animate-slide-up z-50 text-sm md:text-base">
          {toast}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-4 md:mb-6 text-sm md:text-base">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm mã học sinh..."
            value={searchMaSv}
            onChange={(e) => setSearchMaSv(e.target.value)}
            className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          >
            <option value="">Tất cả lớp</option>
            {CLASSES.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 md:px-6 py-2 rounded-lg btn-ripple smooth-transition text-sm md:text-base whitespace-nowrap"
          >
            + Thêm HS
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8 md:py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-lg md:rounded-xl shadow-md p-8 md:p-12 text-center">
          <p className="text-gray-500 text-sm md:text-base">Không có học sinh nào</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mã HS</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Lớp</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.maSv}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-3">
                      <button
                        onClick={() => onSelectStudent(student)}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem('selectedStudentData', JSON.stringify({
                            id: student._id,
                            maSv: student.maSv,
                            name: student.name,
                            class: student.class
                          }));
                          if (onNavigate) {
                            onNavigate('grade-view');
                          }
                        }}
                        className="text-green-600 hover:text-green-700 font-semibold"
                      >
                        Xem Điểm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(student._id)}
                        className="text-red-600 hover:text-red-700 font-semibold"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {students.map((student) => (
              <div key={student._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                    <p className="text-xs text-gray-500">Mã: {student.maSv}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                    {student.class}
                  </span>
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="flex-1 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded text-xs"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('selectedStudentData', JSON.stringify({
                        id: student._id,
                        maSv: student.maSv,
                        name: student.name,
                        class: student.class
                      }));
                      if (onNavigate) {
                        onNavigate('grade-view');
                      }
                    }}
                    className="flex-1 text-green-600 hover:bg-green-50 font-semibold py-2 rounded text-xs"
                  >
                    Xem Điểm
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(student._id)}
                    className="flex-1 text-red-600 hover:bg-red-50 font-semibold py-2 rounded text-xs"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg md:rounded-xl shadow-xl p-6 w-full max-w-md animate-fade-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Thêm Học Sinh</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Mã học sinh
                </label>
                <input
                  type="text"
                  value={newStudent.maSv}
                  onChange={(e) => setNewStudent({...newStudent, maSv: e.target.value})}
                  placeholder="VD: 10A101"
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Tên học sinh
                </label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Lớp
                </label>
                <select
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                >
                  {CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg text-sm md:text-base"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm md:text-base"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg md:rounded-xl shadow-xl p-6 w-full max-w-sm animate-fade-in">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">Bạn chắc chắn muốn xóa học sinh này? Thao tác này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg text-sm md:text-base"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteStudent(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg text-sm md:text-base"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
