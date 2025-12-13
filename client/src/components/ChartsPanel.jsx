import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statsAPI } from '../services/api.js';

const COLORS = ['#dc2626', '#f59e0b', '#3b82f6', '#10b981', '#f59e0b'];
const CLASSIFICATION_NAMES = ['Yếu', 'Trung Bình', 'Khá', 'Giỏi', 'Xuất sắc'];

export default function ChartsPanel() {
  const [classStats, setClassStats] = useState([]);
  const [distributionStats, setDistributionStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [classRes, distRes] = await Promise.all([
        statsAPI.getClassesStats(),
        statsAPI.getDistributionStats()
      ]);

      // Sort classes by average descending
      const sortedClasses = classRes.data.classes.sort((a, b) => b.classAverage - a.classAverage);
      setClassStats(sortedClasses);
      setDistributionStats(distRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load chart data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Prepare pie chart data
  const pieData = CLASSIFICATION_NAMES.map(name => ({
    name,
    value: distributionStats[name] || 0
  })).filter(item => item.value > 0);

  const totalStudents = Object.values(distributionStats).reduce((a, b) => a + b, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      if (payload[0].payload.classAverage !== undefined) {
        // Bar chart tooltip
        return (
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
            <p className="font-semibold text-gray-900">{payload[0].payload.className}</p>
            <p className="text-blue-600">Điểm TB: {payload[0].value.toFixed(2)}</p>
            <p className="text-gray-600 text-sm">HS: {payload[0].payload.studentCount}</p>
          </div>
        );
      } else {
        // Pie chart tooltip
        const percentage = totalStudents > 0 ? ((payload[0].value / totalStudents) * 100).toFixed(1) : 0;
        return (
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
            <p className="font-semibold text-gray-900">{payload[0].name}</p>
            <p className="text-blue-600">{payload[0].value} học sinh</p>
            <p className="text-gray-600 text-sm">{percentage}%</p>
          </div>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biểu Đồ Thống Kê</h1>
          <p className="text-gray-500 mt-2">Phân tích điểm học sinh theo lớp và xếp loại</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg btn-ripple smooth-transition disabled:opacity-50"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Cập nhật
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Class Averages */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Điểm Trung Bình Theo Lớp</h2>
          {classStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={classStats} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="className" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="classAverage" 
                  fill="#0b6ef6" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              Không có dữ liệu
            </div>
          )}
        </div>

        {/* Pie Chart - Classification Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Phân Bố Xếp Loại</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => {
                    const percentage = totalStudents > 0 ? ((value / totalStudents) * 100).toFixed(0) : 0;
                    return `${name} ${percentage}%`;
                  }}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1000}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Thống Kê Chi Tiết</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Yếu</p>
            <p className="text-2xl font-bold text-red-600">{distributionStats['Yếu'] || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalStudents > 0 ? (((distributionStats['Yếu'] || 0) / totalStudents * 100).toFixed(1)) : 0}%
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Trung Bình</p>
            <p className="text-2xl font-bold text-orange-600">{distributionStats['Trung Bình'] || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalStudents > 0 ? (((distributionStats['Trung Bình'] || 0) / totalStudents * 100).toFixed(1)) : 0}%
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Khá</p>
            <p className="text-2xl font-bold text-blue-600">{distributionStats['Khá'] || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalStudents > 0 ? (((distributionStats['Khá'] || 0) / totalStudents * 100).toFixed(1)) : 0}%
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Giỏi</p>
            <p className="text-2xl font-bold text-green-600">{distributionStats['Giỏi'] || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalStudents > 0 ? (((distributionStats['Giỏi'] || 0) / totalStudents * 100).toFixed(1)) : 0}%
            </p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Xuất Sắc</p>
            <p className="text-2xl font-bold text-yellow-600">{distributionStats['Xuất sắc'] || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalStudents > 0 ? (((distributionStats['Xuất sắc'] || 0) / totalStudents * 100).toFixed(1)) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
