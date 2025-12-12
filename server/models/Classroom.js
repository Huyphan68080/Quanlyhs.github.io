import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  grade: {
    type: Number,
    required: true,
    enum: [10, 11, 12]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Classroom = mongoose.model('Classroom', classroomSchema);
