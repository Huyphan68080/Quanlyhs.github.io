import React, { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import StudentsList from './components/StudentsList.jsx';
import StudentDetail from './components/StudentDetail.jsx';
import ChartsPanel from './components/ChartsPanel.jsx';
import ClassesList from './components/ClassesList.jsx';
import { getAccessToken, clearAccessToken } from './services/api.js';
import './index.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);
  const [chartsRefreshKey, setChartsRefreshKey] = useState(0);
  const [studentsRefreshKey, setStudentsRefreshKey] = useState(0);

  const handleRefreshDashboard = () => {
    setDashboardRefreshKey(prev => prev + 1);
  };

  const handleRefreshCharts = () => {
    setChartsRefreshKey(prev => prev + 1);
  };

  const handleRefreshStudents = () => {
    setStudentsRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    // Check if token exists in localStorage
    const token = getAccessToken();
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    clearAccessToken();
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
    setSelectedStudent(null);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-600">QuanLyHS</h1>
          <p className="text-sm text-gray-500">v1.0</p>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => {
              setCurrentPage('dashboard');
              setSelectedStudent(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium smooth-transition ${
              currentPage === 'dashboard'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="inline w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-2m-6 0l-4-2" />
            </svg>
            Dashboard
          </button>

          <button
            onClick={() => {
              setCurrentPage('students');
              setSelectedStudent(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium smooth-transition ${
              currentPage === 'students' || currentPage === 'student-detail'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="inline w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Học Sinh
          </button>

          <button
            onClick={() => {
              setCurrentPage('charts');
              setSelectedStudent(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium smooth-transition ${
              currentPage === 'charts'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="inline w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Biểu Đồ
          </button>

          <button
            onClick={() => {
              setCurrentPage('classes');
              setSelectedStudent(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium smooth-transition ${
              currentPage === 'classes'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="inline w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            In Danh Sách
          </button>
        </nav>

        <div className="absolute bottom-6 left-6">
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg smooth-transition whitespace-nowrap"
          >
            <svg className="inline w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {selectedStudent && currentPage === 'students' ? (
            <StudentDetail 
              student={selectedStudent} 
              onBack={() => setSelectedStudent(null)}
              onRefresh={handleRefreshDashboard}
              onRefreshCharts={handleRefreshCharts}
            />
          ) : currentPage === 'dashboard' ? (
            <Dashboard key={dashboardRefreshKey} onNavigate={setCurrentPage} />
          ) : currentPage === 'students' ? (
            <StudentsList onSelectStudent={(student) => setSelectedStudent(student)} />
          ) : currentPage === 'charts' ? (
            <ChartsPanel key={chartsRefreshKey} />
          ) : currentPage === 'classes' ? (
            <ClassesList />
          ) : null}
        </div>
      </main>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold p-4 rounded-full shadow-lg btn-ripple"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
