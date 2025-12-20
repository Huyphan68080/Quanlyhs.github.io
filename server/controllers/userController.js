import { User } from '../models/User.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-passwordHash');
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, '-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create new user (admin only)
export const createUser = async (req, res) => {
  try {
    const { username, password, confirmPassword, role } = req.body;

    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Username, password và confirm password là bắt buộc' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Mật khẩu không trùng khớp' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu phải ít nhất 6 ký tự' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });
    if (existingUser) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
    }

    // Create new user
    const newUser = new User({
      username,
      passwordHash: password,
      role: role || 'user'
    });

    await newUser.save();

    // Return user without password
    const userResponse = await User.findById(newUser._id, '-passwordHash');
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update username if provided
    if (username && username.trim()) {
      // Check if new username already exists
      const existingUser = await User.findOne({ 
        username: { $regex: `^${username}$`, $options: 'i' },
        _id: { $ne: id }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
      }
      user.username = username;
    }

    // Update password if provided
    if (password && password.length >= 6) {
      user.passwordHash = password; // Will be hashed by pre-save hook
    } else if (password && password.length > 0 && password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu phải ít nhất 6 ký tự' });
    }

    await user.save();

    // Return user without password
    const userResponse = await User.findById(id, '-passwordHash');
    res.json(userResponse);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
