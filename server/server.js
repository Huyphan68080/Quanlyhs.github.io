import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import gradeRoutes from './routes/gradeRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
  });

// Serve static files from dist
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../client/dist')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/stats', statsRoutes);

// Health check (Render dùng để kiểm tra service đang chạy)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve index.html for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Render auto cấp PORT, bắt buộc phải dùng process.env.PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at port ${PORT}`);
});
