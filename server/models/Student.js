import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  maSv: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for maSv
studentSchema.index({ maSv: 1 });

export const Student = mongoose.model('Student', studentSchema);
