# Quản Lý Học Sinh - Student Management System

A complete, production-ready student management web application for managing grades and class administration. Built with React (Vite), Node.js (Express), MongoDB, and JWT authentication.

## 🎯 Features

- **Admin Authentication** - Secure JWT-based login system
- **Student Management** - Add, view, and delete student records
- **Grade Management** - Track grades for 8 subjects (Văn, Toán, Tiếng Anh, Hóa, Sử, Địa, Vật Lý, Thể Dục)
- **Automated Classification** - Automatic student classification based on averages
- **Analytics & Charts** - Animated bar charts (class averages) and pie charts (classification distribution)
- **Dashboard** - Overview of total students, average scores, and class rankings
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Blue and white theme with smooth animations

## 📋 Subjects Tracked

1. **Văn** (Literature)
2. **Toán** (Mathematics)
3. **Tiếng Anh** (English)
4. **Hóa** (Chemistry)
5. **Sử** (History)
6. **Địa** (Geography)
7. **Vật Lý** (Physics)
8. **Thể Dục** (Physical Education)

## 📊 Classification Thresholds

Students are automatically classified based on their average score:

| Classification | Range | Average |
|---|---|---|
| **Xuất sắc** (Outstanding) | 9.0 - 10.0 | 9.0 ≤ avg ≤ 10.0 |
| **Giỏi** (Excellent) | 7.0 - 8.9 | 7.0 ≤ avg < 9.0 |
| **Khá** (Good) | 5.0 - 6.9 | 5.0 ≤ avg < 7.0 |
| **Trung Bình** (Average) | 2.0 - 4.9 | 2.0 ≤ avg < 5.0 |
| **Yếu** (Poor) | < 2.0 | avg < 2.0 |

⚠️ **Note**: These ranges are non-overlapping and deterministic. To change thresholds, modify the `getClassification()` function in:
- Backend: `server/controllers/gradeController.js`
- Backend: `server/controllers/statsController.js`
- Frontend: `client/src/components/StudentDetail.jsx`
- Frontend: `client/src/components/ChartsPanel.jsx`

## 🗂️ Classes Included

The system automatically creates 30 classes:

- **Grade 10**: 10A1 through 10A10
- **Grade 11**: 11A1 through 11A10
- **Grade 12**: 12A1 through 12A10

Each class is seeded with 30 sample students and random grades for demonstration.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas account (connection string provided)
- npm or yarn

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Seed the database (create admin and classes)
npm run seed

# Start the server
npm start
# For development with auto-reload:
npm run dev
```

The server will start on **http://localhost:5000**

### 2. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on **http://localhost:3000**

### 3. Access the Application

- Open: **http://localhost:3000**
- Default credentials:
  - **Username**: `HuyPhan`
  - **Password**: `Huyphan19082008`

⚠️ **Important**: Change the password immediately after first login!

## 📦 Project Structure

```
Quanlyhocsinh/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Grade.js
│   │   └── Classroom.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── gradeController.js
│   │   └── statsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── gradeRoutes.js
│   │   └── statsRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudentsList.jsx
│   │   │   ├── StudentDetail.jsx
│   │   │   └── ChartsPanel.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🔌 API Endpoints

### Authentication

- **POST** `/api/auth/login` - Login and get JWT token
- **POST** `/api/auth/seed-admin` - Create default admin (run once)

### Students

- **GET** `/api/students` - Get all students (with optional filters)
- **POST** `/api/students` - Create new student
- **GET** `/api/students/:id` - Get student by ID
- **DELETE** `/api/students/:id` - Delete student

### Grades

- **GET** `/api/grades/:id/grades` - Get all subject grades for a student
- **POST** `/api/grades/:id/grades` - Update grades for a student
- **GET** `/api/grades/class/:className/grades` - Get aggregated class grades

### Statistics

- **GET** `/api/stats/classes` - Get statistics for all classes
- **GET** `/api/stats/subjects` - Get average scores by subject
- **GET** `/api/stats/distribution` - Get classification distribution

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Role-Based Access** - Only admins can access management features
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Properly configured CORS headers
- **Environment Variables** - Sensitive data stored in .env files

## 🎨 UI/UX Features

- **Blue & White Theme** - Modern, professional color scheme (#0b6ef6)
- **Responsive Layout** - Mobile-friendly design with Tailwind CSS
- **Smooth Animations** - Micro-interactions on buttons and transitions
- **Loading States** - Spinner animations during data fetching
- **Toast Notifications** - Success/error feedback messages
- **Modals** - Confirmation dialogs for destructive actions
- **Interactive Charts** - Animated Recharts with hover tooltips

## 📱 Pages Overview

### Login Page
- Secure admin authentication
- Professional design with gradient background

### Dashboard
- Overview cards with key metrics
- Quick access buttons to main sections
- Statistics for top/bottom performing classes

### Students Management
- Search by student ID (maSv)
- Filter by class
- Add new students
- Delete students with confirmation
- View student details

### Student Details
- View all 8 subject grades
- Edit grades with real-time average calculation
- Classification label display
- Grade classification reference table

### Charts & Analytics
- **Bar Chart**: Class averages sorted by performance
- **Pie Chart**: Distribution of students across classifications
- **Statistics Cards**: Breakdown by classification level
- Interactive tooltips showing detailed information

## 🛠️ Development

### Adding New Features

1. **Backend**: Add routes → controllers → update models
2. **Frontend**: Create components → add API calls → integrate with App
3. **Database**: Update seed.js if adding new collections

### Running Tests

```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```

### Building for Production

```bash
# Frontend
cd client
npm run build

# Backend
No additional build needed, but configure environment variables
```

## 📄 MongoDB Connection

The application uses MongoDB Atlas with the provided connection string:

```
mongodb+srv://huyphan68080_db_user:iFnQiiuHvoxlaLQ1@quanlyhocsinh.9mswsvk.mongodb.net/?appName=Quanlyhocsinh
```

This is configured in the `.env` file automatically.

## 🎓 Sample Data

The seed script (`seed.js`) creates:

- **1 Default Admin Account** (HuyPhan / Huyphan19082008)
- **30 Classes** (10A1-10A10, 11A1-11A10, 12A1-12A10)
- **900 Sample Students** (30 per class)
- **7,200 Grade Records** (8 subjects per student with random scores)

Run `npm run seed` to generate this data.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify `.env` file contains correct MONGODB_URI
- Check internet connection to MongoDB Atlas
- Whitelist IP address in MongoDB Atlas security settings

### Port Already in Use
- Change PORT in `.env` (default: 5000)
- Or kill process: `npx kill-port 5000`

### CORS Error
- Ensure frontend proxy is configured in `vite.config.js`
- Check backend CORS settings in `server.js`

### JWT Token Invalid
- Clear localStorage in browser DevTools
- Re-login to get a fresh token

## 📚 Technologies Used

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Recharts** - Chart library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📝 Environment Variables

### Server (.env)

```
MONGODB_URI=mongodb+srv://huyphan68080_db_user:iFnQiiuHvoxlaLQ1@quanlyhocsinh.9mswsvk.mongodb.net/?appName=Quanlyhocsinh
PORT=5000
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRATION=1h
NODE_ENV=development
```

### Client (.env)

```
VITE_API_URL=http://localhost:5000
```

## 📖 API Request Examples

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "HuyPhan",
  "password": "Huyphan19082008"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create Student
```bash
POST /api/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "maSv": "10A101",
  "name": "Nguyễn Văn A",
  "class": "10A1"
}
```

### Update Grades
```bash
POST /api/grades/:studentId/grades
Authorization: Bearer <token>
Content-Type: application/json

{
  "Van": 8.5,
  "Toan": 7.0,
  "TiengAnh": 6.5,
  "Hoa": 5.0,
  "Su": 6.0,
  "Dia": 7.5,
  "VatLy": 8.0,
  "TheDuc": 9.0
}
```

## ✅ Acceptance Criteria Met

- ✅ Admin login with JWT authentication
- ✅ Add/delete/view students
- ✅ Set and update grades for 8 subjects
- ✅ Automatic average and classification calculation
- ✅ Animated bar chart (class averages)
- ✅ Animated pie chart (classification distribution)
- ✅ Blue and white theme with animations
- ✅ Responsive mobile design
- ✅ MongoDB integration with provided connection string
- ✅ Seed script for classes, admin, and sample data

## 📄 License

This project is provided as-is for educational and administrative purposes.

## 👨‍💻 Support

For issues or questions, refer to the code comments or review the component structure.

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Status**: Production Ready ✅
