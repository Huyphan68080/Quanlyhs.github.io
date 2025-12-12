import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['Van', 'Toan', 'TiengAnh', 'Hoa', 'Su', 'Dia', 'VatLy', 'TheDuc']
  },
  score: {
    type: mongoose.Schema.Types.Mixed, // Allow both Number and String
    required: true,
    validate: {
      validator: function(value) {
        if (this.subject === 'TheDuc') {
          // TheDuc accepts "Đạt" or "Không Đạt"
          return value === 'Đạt' || value === 'Không Đạt';
        } else {
          // Other subjects: number between 0-10
          return typeof value === 'number' && value >= 0 && value <= 10;
        }
      },
      message: 'Invalid score value'
    }
  },
  term: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index: one grade per subject per student
gradeSchema.index({ studentId: 1, subject: 1 }, { unique: true });

export const Grade = mongoose.model('Grade', gradeSchema);
