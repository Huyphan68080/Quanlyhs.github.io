# 🔍 Installation Verification

After completing the quick start steps, use this checklist to verify everything is working:

## ✅ Pre-Installation Checks

- [ ] Node.js installed (check with `node --version`)
- [ ] npm installed (check with `npm --version`)
- [ ] MongoDB Atlas account accessible
- [ ] Ports 5000 and 3000 are available

## ✅ Backend Verification

After running `npm run seed`:

```powershell
cd server

# Verify dependencies installed
npm list | Select-String "mongoose|express|jsonwebtoken|bcryptjs"

# Verify .env file exists
Test-Path .env
```

Expected output:
- All dependencies listed
- .env file exists

Check MongoDB connection:
```powershell
npm start
```

Expected:
- `✓ Connected to MongoDB`
- `🚀 Server running on http://localhost:5000`
- `GET http://localhost:5000/health` returns `{"status":"ok"}`

## ✅ Frontend Verification

```powershell
cd client

# Verify dependencies installed
npm list | Select-String "react|vite|recharts|tailwindcss"

# Verify config files exist
Test-Path vite.config.js
Test-Path tailwind.config.js
```

Expected:
- All dependencies listed
- Config files exist

Start frontend:
```powershell
npm run dev
```

Expected:
- `VITE v5.0.8 ready in ~500ms`
- Local URL shows `http://localhost:3000`

## ✅ Application Verification

### Login Test
1. Open http://localhost:3000
2. Enter credentials:
   - Username: `HuyPhan`
   - Password: `Huyphan19082008`
3. Click "Đăng nhập"

Expected:
- ✅ Login successful
- ✅ Redirected to Dashboard
- ✅ Token stored in localStorage

### Dashboard Verification
Expected to see:
- ✅ Total students: ~900
- ✅ Average score: between 0-10
- ✅ Top class: one with highest average
- ✅ Bottom class: one with lowest average
- ✅ Quick action buttons work

### Students Page Verification
1. Click "Học Sinh" in sidebar
2. Verify:
   - ✅ Student list loads (30 items per page)
   - ✅ Search by maSv works
   - ✅ Filter by class works
   - ✅ "Thêm học sinh" button opens modal

### Add Student Test
1. Click "+ Thêm học sinh"
2. Fill form:
   - maSv: TEST001
   - name: Test Student
   - class: 10A1
3. Click "Thêm"

Expected:
- ✅ Modal closes
- ✅ Success toast appears
- ✅ New student appears in list

### Student Detail Verification
1. Click "Chi tiết" on any student
2. Verify:
   - ✅ Student name displays
   - ✅ All 8 subjects show grades
   - ✅ Average calculated correctly
   - ✅ Classification label displays

### Edit Grades Test
1. Click "Chỉnh sửa"
2. Change some grades
3. Click "Lưu điểm"

Expected:
- ✅ Form becomes editable
- ✅ Average updates in real-time
- ✅ Save button works
- ✅ Success message appears
- ✅ Data persists on reload

### Charts Verification
1. Click "Biểu Đồ" in sidebar
2. Verify:
   - ✅ Bar chart shows all classes
   - ✅ Classes sorted by average (highest first)
   - ✅ Bars animated on load
   - ✅ Hover shows class details
   - ✅ Pie chart shows classification distribution
   - ✅ Pie chart animated on load
   - ✅ Statistics cards show correct percentages

### Responsive Design Test
1. Open DevTools (F12)
2. Switch to mobile view (375px width)
3. Verify:
   - ✅ Layout adapts to mobile
   - ✅ Sidebar hidden on mobile
   - ✅ All buttons accessible
   - ✅ Charts still display
   - ✅ Forms still usable

## ✅ Data Verification

### Check MongoDB Collections

Use MongoDB Atlas UI:

1. **Users Collection**
   - Should have 1 admin (HuyPhan)
   - Password is hashed (not plain text)

2. **Classrooms Collection**
   - Should have 30 documents (10A1-10A10, 11A1-11A10, 12A1-12A10)

3. **Students Collection**
   - Should have ~900 documents
   - Each has maSv, name, class
   - maSv unique index active

4. **Grades Collection**
   - Should have ~7,200 documents
   - Each has studentId, subject, score
   - Scores between 0-10

## ✅ API Endpoint Verification

Test with curl or Postman:

### 1. Login Endpoint
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "HuyPhan",
  "password": "Huyphan19082008"
}
```

Expected: 200 OK with accessToken

### 2. Get Students
```bash
GET http://localhost:5000/api/students
Authorization: Bearer <token>
```

Expected: 200 OK with array of students

### 3. Get Classes Stats
```bash
GET http://localhost:5000/api/stats/classes
Authorization: Bearer <token>
```

Expected: 200 OK with class statistics

## ✅ Performance Checks

- [ ] Dashboard loads in < 2 seconds
- [ ] Student list loads in < 1 second
- [ ] Charts render smoothly
- [ ] No console errors (F12 > Console)
- [ ] No memory leaks on long usage

## ✅ Security Checks

- [ ] Password is hashed (never plain text)
- [ ] JWT token required for protected routes
- [ ] Non-admin cannot access admin routes
- [ ] Login clears on logout
- [ ] No sensitive data in localStorage (except token)

## 🎉 Verification Complete!

If all checkboxes are checked, your Student Management System is:
- ✅ Fully installed
- ✅ Properly configured
- ✅ Connected to MongoDB
- ✅ Running all features
- ✅ Ready for production use

## 🆘 If Something Fails

1. **Check the logs** - both terminal windows for errors
2. **Verify .env files** - especially MONGODB_URI
3. **Check ports** - ensure 5000 and 3000 are free
4. **Clear cache** - browser DevTools > Application > Clear storage
5. **Restart services** - kill and restart both servers
6. **Check connection** - test MongoDB Atlas access

## 📞 Support

Refer to:
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick setup guide
- Backend `console.log` - Server error logs
- Browser DevTools - Frontend errors
- MongoDB Atlas console - Database verification

---

**Last Updated**: December 2025
**Status**: Ready for Verification ✅
