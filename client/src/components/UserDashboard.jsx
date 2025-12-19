import React, { useState, useEffect } from 'react';
import { getAccessToken, decodeToken } from '../services/api.js';

export default function UserDashboard({ onNavigate, onLogout }) {
  const [recentSearches, setRecentSearches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Get username from token
    const token = getAccessToken();
    if (token) {
      const decoded = decodeToken(token);
      setUsername(decoded?.username || 'User');
    }

    // Load recent searches from localStorage
    const searches = localStorage.getItem('recentSearches');
    if (searches) {
      setRecentSearches(JSON.parse(searches).slice(0, 5)); // Last 5 searches
    }

    // Load favorites from localStorage
    const favs = localStorage.getItem('favoriteStudents');
    if (favs) {
      setFavorites(JSON.parse(favs).slice(0, 5)); // First 5 favorites
    }
  }, []);

  const handleSearchStudent = (student) => {
    localStorage.setItem('selectedStudentData', JSON.stringify(student));
    onNavigate('grade-view');
  };

  const removeFavorite = (studentId) => {
    const updated = favorites.filter(f => f.id !== studentId);
    setFavorites(updated);
    localStorage.setItem('favoriteStudents', JSON.stringify(updated));
  };

  const removeRecent = (index) => {
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Xin chào, {username}!</h1>
          <p className="text-gray-600 mt-1">Quản lý hệ thống tra cứu điểm học sinh</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Đăng Xuất
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Searches */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Tìm Kiếm Gần Đây</h2>
            <span className="text-2xl">🕐</span>
          </div>
          
          {recentSearches.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có lịch sử tìm kiếm</p>
          ) : (
            <div className="space-y-3">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <button
                    onClick={() => handleSearchStudent(search)}
                    className="flex-1 text-left"
                  >
                    <p className="font-semibold text-gray-900">{search.maSv} - {search.name}</p>
                    <p className="text-sm text-gray-600">{search.class}</p>
                  </button>
                  <button
                    onClick={() => removeRecent(index)}
                    className="text-gray-400 hover:text-red-500 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Students */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Học Sinh Yêu Thích</h2>
            <span className="text-2xl">⭐</span>
          </div>

          {favorites.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có học sinh yêu thích</p>
          ) : (
            <div className="space-y-3">
              {favorites.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
                >
                  <button
                    onClick={() => handleSearchStudent(student)}
                    className="flex-1 text-left"
                  >
                    <p className="font-semibold text-gray-900">{student.maSv} - {student.name}</p>
                    <p className="text-sm text-gray-600">{student.class}</p>
                  </button>
                  <button
                    onClick={() => removeFavorite(student.id)}
                    className="text-yellow-500 hover:text-red-500 ml-2 text-lg"
                  >
                    ★
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hành Động Nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('grade-view')}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center"
          >
            <p className="text-2xl mb-2">🔍</p>
            <p className="font-semibold text-gray-900">Tra Cứu Điểm</p>
            <p className="text-sm text-gray-600">Tìm điểm học sinh</p>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center"
          >
            <p className="text-2xl mb-2">👤</p>
            <p className="font-semibold text-gray-900">Hồ Sơ</p>
            <p className="text-sm text-gray-600">Xem thông tin tài khoản</p>
          </button>

          <button
            onClick={() => {
              alert('Liên hệ admin để nhận hỗ trợ');
            }}
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center"
          >
            <p className="text-2xl mb-2">💬</p>
            <p className="font-semibold text-gray-900">Hỗ Trợ</p>
            <p className="text-sm text-gray-600">Liên hệ với admin</p>
          </button>
        </div>
      </div>
    </div>
  );
}
