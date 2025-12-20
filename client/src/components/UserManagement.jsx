import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api.js';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAllUsers();
      setUsers(response.data || response);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Không thể tải danh sách user: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setFormData({
      username: user.username,
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setFormData({ username: '', newPassword: '', confirmPassword: '' });
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!formData.username.trim()) {
        setError('Username không được để trống');
        setLoading(false);
        return;
      }

      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setError('Mật khẩu không trùng khớp');
        setLoading(false);
        return;
      }

      if (formData.newPassword && formData.newPassword.length < 6) {
        setError('Mật khẩu phải ít nhất 6 ký tự');
        setLoading(false);
        return;
      }

      const updateData = {
        username: formData.username
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const response = await usersAPI.updateUser(editingUserId, updateData);
      
      setUsers(users.map(u => u._id === editingUserId 
        ? { ...u, username: formData.username }
        : u
      ));
      
      setSuccess('User được cập nhật thành công');
      setEditingUserId(null);
      setFormData({ username: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Cập nhật user thất bại: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa user này?')) return;

    try {
      setLoading(true);
      await usersAPI.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      setSuccess('User được xóa thành công');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Xóa user thất bại: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      setLoading(true);
      setError('');

      if (!newUserForm.username.trim() || !newUserForm.password) {
        setError('Username và password là bắt buộc');
        setLoading(false);
        return;
      }

      if (newUserForm.password !== newUserForm.confirmPassword) {
        setError('Mật khẩu không trùng khớp');
        setLoading(false);
        return;
      }

      if (newUserForm.password.length < 6) {
        setError('Mật khẩu phải ít nhất 6 ký tự');
        setLoading(false);
        return;
      }

      const response = await usersAPI.createUser({
        username: newUserForm.username,
        password: newUserForm.password,
        confirmPassword: newUserForm.confirmPassword,
        role: newUserForm.role
      });

      setUsers([...users, response.data]);
      setSuccess('User được tạo thành công');
      setIsAddingUser(false);
      setNewUserForm({ username: '', password: '', confirmPassword: '', role: 'user' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Tạo user thất bại: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-6 md:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản Lý User</h1>
          <p className="text-sm md:text-base text-gray-500 mt-2">Thêm, sửa, xóa user và đổi mật khẩu</p>
        </div>
        <button
          onClick={() => setIsAddingUser(!isAddingUser)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg btn-ripple smooth-transition text-sm md:text-base"
        >
          {isAddingUser ? 'Hủy' : '+ Thêm User'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Add User Form */}
      {isAddingUser && (
        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tạo User Mới</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={newUserForm.username}
                onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                placeholder="Nhập username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật Khẩu</label>
              <input
                type="password"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Xác Nhận Mật Khẩu</label>
              <input
                type="password"
                value={newUserForm.confirmPassword}
                onChange={(e) => setNewUserForm({ ...newUserForm, confirmPassword: e.target.value })}
                placeholder="Xác nhận mật khẩu"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vai Trò</label>
              <select
                value={newUserForm.role}
                onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              onClick={handleAddUser}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg btn-ripple smooth-transition disabled:opacity-50"
            >
              {loading ? 'Đang tạo...' : 'Tạo User'}
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        {loading && !isAddingUser ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Username</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Vai Trò</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Ngày Tạo</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    {editingUserId === user._id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          placeholder="Username"
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                          placeholder="Mật khẩu mới (để trống nếu không đổi)"
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Xác nhận mật khẩu"
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveUser}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold disabled:opacity-50"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm font-semibold"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            Không có user nào
          </div>
        )}
      </div>
    </div>
  );
}
