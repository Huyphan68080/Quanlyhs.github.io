# 🚀 QUICK START GUIDE

Follow these steps to get the application running in minutes.

## Step 1: Install Backend Dependencies

```powershell
cd server
npm install
```

## Step 2: Configure Backend Environment

The `.env.example` already has the MongoDB connection string. Create `.env`:

```powershell
# Windows PowerShell
copy .env.example .env
```

Or create `.env` file manually with:

```
MONGODB_URI=mongodb+srv://huyphan68080_db_user:iFnQiiuHvoxlaLQ1@quanlyhocsinh.9mswsvk.mongodb.net/?appName=Quanlyhocsinh
PORT=5000
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRATION=1h
NODE_ENV=development
```

## Step 3: Seed the Database

```powershell
npm run seed
```

This will:
- ✅ Create the default admin account (HuyPhan / Huyphan19082008)
- ✅ Create all 30 classes (10A1-10A10, 11A1-11A10, 12A1-12A10)
- ✅ Create 900 sample students (30 per class)
- ✅ Create 7,200 grade records with random scores

## Step 4: Start Backend Server

```powershell
npm start
```

You should see:
```
✓ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

## Step 5: Install Frontend Dependencies

Open a NEW PowerShell terminal:

```powershell
cd client
npm install
```

## Step 6: Start Frontend Server

```powershell
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

## Step 7: Open in Browser

- Open: **http://localhost:3000**
- Login with:
  - **Username**: `HuyPhan`
  - **Password**: `Huyphan19082008`

## ✅ You're Done!

The application is now running with:
- 900 sample students
- 30 classes
- Random grades for all students
- Full dashboard, student management, and charts working

## 🔐 Important Security Notes

1. **Change Password Immediately**
   - After login, the system should prompt you to change the default password
   - Default credentials are only for initial setup

2. **Update JWT Secret**
   - In production, change `JWT_SECRET` in `.env` to a strong random string
   - Use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **MongoDB Credentials**
   - The connection string is provided and ready to use
   - In production, rotate these credentials regularly

## 🐛 Troubleshooting

### Port 5000 Already in Use
```powershell
# Kill process on port 5000
npx kill-port 5000

# Or change port in server/.env
PORT=5001
```

### MongoDB Connection Failed
- Check your internet connection
- Verify MongoDB Atlas is accessible from your IP
- Ensure .env has correct MONGODB_URI

### Port 3000 Already in Use
```powershell
# Vite will use next available port automatically
```

### Clear Cache / Reset Application
```powershell
# Backend - clear database
npm run seed  # Runs again and clears old data

# Frontend - clear localStorage
# Open DevTools (F12) > Application > LocalStorage > Clear All
```

## 📊 What to Test First

1. **Login** - Use default credentials
2. **Dashboard** - View statistics
3. **Students** - Add a new student, view their details
4. **Edit Grades** - Edit a student's grades and see average update
5. **Charts** - View animated bar and pie charts
6. **Logout** - Test logout and re-login

## 📁 Key Files

- **Backend Server**: `server/server.js`
- **Frontend App**: `client/src/App.jsx`
- **Database Seed**: `server/seed.js`
- **Configuration**: `.env` files in both folders

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Tailwind CSS](https://tailwindcss.com)

---

**Done!** 🎉 Your student management system is ready to use!
