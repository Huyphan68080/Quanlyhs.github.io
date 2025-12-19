import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Có Lỗi Xảy Ra</h2>
            <p className="text-gray-700 mb-4">Ứng dụng gặp phải một lỗi:</p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto mb-4">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Tải Lại Trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
