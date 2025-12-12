# 🎯 GETTING STARTED - VISUAL GUIDE

## Step 1️⃣: Download & Navigate

Open Terminal/PowerShell and navigate to project:

```powershell
cd d:\Demo\Quanlyhocsinh
```

## Step 2️⃣: Setup Backend

```powershell
# Open Terminal 1: Backend
cd server
npm install

# Wait for installation to complete...
```

**Expected Output:**
```
up to date, audited X packages
```

## Step 3️⃣: Seed Database

```powershell
# Still in server folder
npm run seed
```

**Expected Output:**
```
✓ Connected to MongoDB
🗑️  Clearing existing data...
👤 Creating default admin user...
✓ Admin user created
📚 Creating classrooms...
✓ Created 30 classrooms
👥 Creating fake students...
✓ Created 900 students with grades

✅ Database seeded successfully!

📝 Default admin credentials:
   Username: HuyPhan
   Password: Huyphan19082008

⚠️  Please change the password after first login!

✓ Disconnected from MongoDB
```

## Step 4️⃣: Start Backend Server

```powershell
# Still in server folder
npm start
```

**Expected Output:**
```
✓ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

✅ **Leave this terminal running**

## Step 5️⃣: Setup Frontend

```powershell
# Open NEW Terminal 2: Frontend
cd d:\Demo\Quanlyhocsinh\client
npm install

# Wait for installation to complete...
```

**Expected Output:**
```
up to date, audited X packages
```

## Step 6️⃣: Start Frontend

```powershell
# Still in client folder
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose

press h + enter to show help
```

## Step 7️⃣: Open in Browser

Click or open in your browser:

```
http://localhost:3000
```

You should see the login page:

```
╔════════════════════════════════════╗
║                                    ║
║    Quản Lý Học Sinh                ║
║                                    ║
║    [Tên đăng nhập input]           ║
║    [Mật khẩu input]                ║
║    [Đăng nhập button]              ║
║                                    ║
║    Mặc định: HuyPhan /...          ║
╚════════════════════════════════════╝
```

## Step 8️⃣: Login

Enter credentials:
- **Username**: `HuyPhan`
- **Password**: `Huyphan19082008`

Click **"Đăng nhập"**

## Step 9️⃣: Dashboard Appears

You should see the dashboard with:

```
📊 Dashboard
├── 👥 Tổng học sinh: ~900
├── 📈 Điểm trung bình: ~5.0
├── 🏆 Lớp cao nhất: (e.g., 11A5 with 5.2)
├── 📉 Lớp thấp nhất: (e.g., 12A1 with 4.8)
└── 🎯 Thao tác nhanh
    ├── Quản lý học sinh
    └── Xem biểu đồ
```

## 🎓 Now You Can:

### 1. View Dashboard Statistics
- Click Dashboard in sidebar
- See overview cards
- Check top/bottom classes

### 2. Manage Students
- Click "Học Sinh" in sidebar
- View list of 900 students
- Search by student ID (maSv)
- Filter by class
- Add new students
- Delete students
- Click "Chi tiết" to view student grades

### 3. Edit Student Grades
- Click on any student's "Chi tiết"
- See all 8 subject grades
- Click "Chỉnh sửa" to edit
- Change grades (0-10 scale)
- Click "Lưu điểm" to save
- See average update automatically

### 4. View Charts
- Click "Biểu Đồ" in sidebar
- See animated bar chart (class averages)
- See animated pie chart (classification distribution)
- See statistics breakdown by classification

## 🔐 Security Note

⚠️ **Change password immediately!**

Default credentials are for setup only. Change password:
- This feature is part of user profile (add if needed)
- Or use database tools to update manually

## 📱 Mobile Testing

Resize browser to mobile width (375px):
- Sidebar hides automatically
- Layout adapts to mobile
- All features still work
- Touch-friendly buttons

## 🆘 Troubleshooting

### Issue: Cannot connect to MongoDB
- Check internet connection
- Verify MongoDB Atlas is accessible from your IP
- Check .env file has correct MONGODB_URI

### Issue: Port 5000 already in use
```powershell
# Kill process on port 5000
npx kill-port 5000

# Or change port in server/.env
PORT=5001
```

### Issue: Port 3000 already in use
- Vite will automatically use next available port
- Or close other applications using port 3000

### Issue: Dependencies not installing
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -r node_modules
rm package-lock.json

# Reinstall
npm install
```

### Issue: Nothing shows on charts
- Wait 2-3 seconds for data to load
- Check browser console (F12) for errors
- Verify backend is running

## 📊 Sample Data Included

When you seed the database, you get:

```
30 Classes:
├── Grade 10: 10A1, 10A2, ..., 10A10
├── Grade 11: 11A1, 11A2, ..., 11A10
└── Grade 12: 12A1, 12A2, ..., 12A10

900 Students: 30 per class
├── Realistic Vietnamese names
├── Unique student IDs (maSv)
└── Random grades for all subjects

7,200 Grades: 8 subjects per student
├── Văn (Literature)
├── Toán (Math)
├── Tiếng Anh (English)
├── Hóa (Chemistry)
├── Sử (History)
├── Địa (Geography)
├── Vật Lý (Physics)
└── Thể Dục (PE)
```

## 🎨 Features to Explore

1. **Search Students**
   - Try searching: "10A1"
   - Try searching by name

2. **Filter by Class**
   - Select "10A1" from dropdown
   - See only students in that class

3. **Add Student**
   - Click "+ Thêm học sinh"
   - Fill in: maSv, name, class
   - See it appear in list

4. **View Details**
   - Click "Chi tiết" on any student
   - See all grades and average

5. **Edit Grades**
   - Click "Chỉnh sửa"
   - Change some grades
   - Watch average update
   - Click "Lưu điểm" to save

6. **View Charts**
   - See bar chart of class averages
   - See pie chart of classifications
   - Hover for tooltips
   - Watch animations

7. **Delete Student**
   - Click "Xóa" on any student
   - Confirm in modal
   - Student removed

## 📈 Performance Expectations

- Dashboard loads: < 2 seconds
- Student list loads: < 1 second
- Adding student: < 1 second
- Editing grades: < 1 second
- Charts render: < 2 seconds
- Smooth animations: 60 FPS

## 🔒 Security Checklist

- ✅ Login requires username + password
- ✅ Password is hashed in database
- ✅ JWT token required for API calls
- ✅ Token stored in browser localStorage
- ✅ Token sent with Bearer header
- ✅ Token expires in 1 hour
- ✅ Only admins can manage data
- ✅ Input validated on server

## 💾 Saving & Persistence

All data is automatically saved to MongoDB:
- New students added
- Grades updated
- No manual save needed
- Data persists between sessions

## 🚀 Next Steps

1. **Customize** (Optional)
   - Change theme colors in `client/tailwind.config.js`
   - Change classification thresholds in controller files
   - Add more subjects if needed

2. **Deploy** (Optional)
   - Build frontend: `npm run build` (in client)
   - Host on Vercel, Netlify, or server
   - Deploy backend on Heroku, Railway, or server

3. **Backup** (Optional)
   - Set up MongoDB Atlas backup
   - Export data regularly

## 📚 More Information

For detailed information, see:
- **README.md** - Full documentation
- **QUICKSTART.md** - Quick setup guide
- **VERIFICATION.md** - Testing checklist
- **FILE_MANIFEST.md** - File listing
- **PROJECT_SUMMARY.md** - Project overview

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Dashboard shows ~900 students
- ✅ Student list loads with data
- ✅ You can edit a student's grades
- ✅ Charts display with animations
- ✅ You can add a new student
- ✅ No errors in console (F12)

## 🎉 You're Ready!

Your student management system is ready to use. Start exploring and enjoy! 🚀

---

**For issues**: Check browser console (F12) and terminal output
**For help**: Read README.md and QUICKSTART.md
**For verification**: Follow VERIFICATION.md checklist

**Total Setup Time**: ~10 minutes
**Result**: Fully functional student management system with 900 sample students!
