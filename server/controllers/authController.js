import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Case-insensitive username search
    const user = await User.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const seedAdmin = async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'HuyPhan' });
    if (existingAdmin) {
      return res.status(200).json({ message: 'Default admin already exists' });
    }

    // Create default admin
    const admin = new User({
      username: 'HuyPhan',
      passwordHash: 'Huyphan19082008',
      role: 'admin'
    });

    await admin.save();
    res.status(201).json({ message: 'Default admin created successfully' });
  } catch (error) {
    console.error('Seed admin error:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
};
