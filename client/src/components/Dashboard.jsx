import React, { useState, useEffect } from 'react';
import { statsAPI } from '../services/api.js';

export default function Dashboard({ onNavigate, refreshKey }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await statsAPI.getClassesStats();
      setStats(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalStudents = stats?.totalStudents || 0;
  const highestClass = stats?.highestClass;
  const lowestClass = stats?.lowestClass;
  const avgAllClasses = stats?.classes?.length > 0
    ? (stats.classes.reduce((sum, c) => sum + c.classAverage, 0) / stats.classes.length).toFixed(2)
    : 0;

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-500 mt-2">Tổng quan quản lý học sinh</p>
      </div>

      <div className="mb-4 md:mb-6 flex justify-end">
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 md:px-4 py-2 rounded-lg btn-ripple smooth-transition disabled:opacity-50 text-sm md:text-base"
        >
          <svg className={`w-4 h-4 md:w-5 md:h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">Cập nhật</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-4 md:mb-6 text-sm md:text-base">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {/* Total Students Card */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 smooth-transition hover:shadow-lg hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">Tổng học sinh</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{totalStudents}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-2 md:p-3">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Highest Class Card */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 smooth-transition hover:shadow-lg hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">Lớp cao nhất</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">{highestClass?.className}</p>
              <p className="text-xs md:text-sm text-gray-400 mt-1">{highestClass?.classAverage} điểm</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-2 md:p-3">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Lowest Class Card */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 smooth-transition hover:shadow-lg hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">Lớp thấp nhất</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">{lowestClass?.className}</p>
              <p className="text-xs md:text-sm text-gray-400 mt-1">{lowestClass?.classAverage} điểm</p>
            </div>
            <div className="bg-red-100 rounded-full p-2 md:p-3">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0-10l-6 3v7l6 3 6-3v-7l-6-3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Average Score Card */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 smooth-transition hover:shadow-lg hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">Điểm TB</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{avgAllClasses}</p>
            </div>
            <div className="bg-green-100 rounded-full p-2 md:p-3">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6">
        <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <button
            onClick={() => onNavigate('students')}
            className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg btn-ripple smooth-transition text-sm md:text-base"
          >
            <span className="font-semibold">Quản lý HS</span>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={() => onNavigate('charts')}
            className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg btn-ripple smooth-transition text-sm md:text-base"
          >
            <span className="font-semibold">Xem biểu đồ</span>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={() => onNavigate('users')}
            className="flex items-center justify-between bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg btn-ripple smooth-transition text-sm md:text-base"
          >
            <span className="font-semibold">Quản lý User</span>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
