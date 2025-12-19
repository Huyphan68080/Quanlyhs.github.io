import React, { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import StudentsList from './components/StudentsList.jsx';
import StudentDetail from './components/StudentDetail.jsx';
import ChartsPanel from './components/ChartsPanel.jsx';
import ClassesList from './components/ClassesList.jsx';
import UserGradeView from './components/UserGradeView.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import UserProfile from './components/UserProfile.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { getAccessToken, clearAccessToken, isAdmin } from './services/api.js';
import './index.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);
  const [chartsRefreshKey, setChartsRefreshKey] = useState(0);
  const [studentsRefreshKey, setStudentsRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      const role = isAdmin() ? 'admin' : 'user';
      setUserRole(role);
      // Redirect user to grade-view, admin to dashboard
      setCurrentPage(role === 'admin' ? 'dashboard' : 'grade-view');
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    clearAccessToken();
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentPage('dashboard');
    setSelectedStudent(null);
    setSidebarOpen(false);
    setAuthView('login');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const role = isAdmin() ? 'admin' : 'user';
    setUserRole(role);
    // Redirect admin to dashboard, user to user-dashboard
    setCurrentPage(role === 'admin' ? 'dashboard' : 'user-dashboard');
    setAuthView('login');
  };

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
    // New registered users are 'user' role
    setUserRole('user');
    setCurrentPage('user-dashboard');
    setAuthView('login');
  };

  const handleNavClick = (page) => {
    // Prevent non-admin users from accessing admin pages
    const adminPages = ['dashboard', 'students', 'student-detail', 'charts', 'classes'];
    if (userRole === 'user' && adminPages.includes(page)) {
      return; // Silently block access
    }
    
    setCurrentPage(page);
    setSelectedStudent(null);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return authView === 'login' ? (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setAuthView('register')}
      />
    ) : (
      <Register 
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setAuthView('login')}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static top-0 left-0 h-screen w-64 bg-white shadow-md p-6 transform md:transform-none transition-transform duration-300 ease-in-out z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } overflow-y-auto`}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-blue-600">QuanLyHS</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500">v1.0</p>
        </div>

        <nav className="space-y-2 mb-8">
          {/* Dashboard - Admin only */}
          {userRole === 'admin' && (
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium smooth-transition flex items-center gap-3 ${
                currentPage === 'dashboard'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-2m-6 0l-4-2" />
              </svg>
              <span>Dashboard</span>
            </button>
          )}

          {/* User Dashboard - For non-admin users */}
          {userRole === 'user' && (
            <button
              onClick={() => handleNavClick('user-dashboard')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium smooth-transition flex items-center gap-3 ${
                currentPage === 'user-dashboard'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-2m-6 0l-4-2" />
              </svg>
              <span>Trang Chủ</span>
            </button>
          )}

          {/* Tra Cứu Điểm - For all users */}
          <button
            onClick={() => handleNavClick('grade-view')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium smooth-transition flex items-center gap-3 ${
              currentPage === 'grade-view'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Tra Cứu Điểm</span>
          </button>

          {/* Học Sinh - Admin only */}
          {userRole === 'admin' && (
            <button
              onClick={() => handleNavClick('students')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium smooth-transition flex items-center gap-3 ${
                currentPage === 'students' || currentPage === 'student-detail'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Học Sinh</span>
            </button>
          )}

          {/* Biểu Đồ - Admin only */}
          {userRole === 'admin' && (
            <button
              onClick={() => handleNavClick('charts')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium smooth-transition flex items-center gap-3 ${
                currentPage === 'charts'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Biểu Đồ</span>
            </button>
          )}

          {/* In Danh Sách - Admin only */}
          {userRole === 'admin' && (
            <button
              onClick={() => handleNavClick('classes')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium smooth-transition flex items-center gap-3 ${
                currentPage === 'classes'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>In Danh Sách</span>
            </button>
          )}
        </nav>

        <div className="border-t pt-6">
          {/* Profile Button - For all users */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium smooth-transition flex items-center gap-3 mb-3 ${
              currentPage === 'profile'
                ? 'bg-green-100 text-green-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Hồ Sơ</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg smooth-transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Đăng Xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-white shadow-sm sticky top-0 z-20 flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-blue-600">QuanLyHS</h1>
          <div className="w-10" />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <ErrorBoundary>
            {selectedStudent && currentPage === 'students' ? (
              <StudentDetail 
                student={selectedStudent} 
                onBack={() => setSelectedStudent(null)}
                onRefresh={handleRefreshDashboard}
                onRefreshCharts={handleRefreshCharts}
                onRefreshStudents={handleRefreshStudents}
                onUpdateStudent={(updatedStudent) => setSelectedStudent(updatedStudent)}
              />
            ) : currentPage === 'dashboard' ? (
              <Dashboard key={dashboardRefreshKey} refreshKey={dashboardRefreshKey} onNavigate={setCurrentPage} />
            ) : currentPage === 'user-dashboard' ? (
              <UserDashboard onNavigate={setCurrentPage} onLogout={handleLogout} />
            ) : currentPage === 'profile' ? (
              <UserProfile onLogout={handleLogout} onBack={() => setCurrentPage(userRole === 'admin' ? 'dashboard' : 'user-dashboard')} />
            ) : currentPage === 'grade-view' ? (
              <UserGradeView onLogout={handleLogout} />
            ) : currentPage === 'students' ? (
              <StudentsList onSelectStudent={(student) => setSelectedStudent(student)} />
            ) : currentPage === 'charts' ? (
              <ChartsPanel key={chartsRefreshKey} />
            ) : currentPage === 'classes' ? (
              <ClassesList />
            ) : null}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
