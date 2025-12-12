# 🔧 Cách Debug GitHub Actions Build Failure

## Bước 1: Xem chi tiết lỗi

1. Truy cập: https://github.com/Huyphan68080/Quanlyhs.github.io/actions
2. Click vào workflow run **"pages build and deployment"** 
3. Click vào job **"build"** (red X)
4. Scroll down để xem section **"Build"** - đó là nơi lỗi xảy ra
5. Đọc error message chi tiết

## Bước 2: Khắc phục thường gặp

### Lỗi: "Cannot find module"
- `npm ci` không cài dependency
- Giải pháp: Xóa `package-lock.json` hoặc update dependency

### Lỗi: "Command not found: npm run build"
- `client/package.json` không có script build
- Giải pháp: Kiểm tra `client/package.json` có `"build": "vite build"`

### Lỗi: "Port already in use"
- Giải pháp: Không cần, vite build không cần port

### Lỗi: "VITE_API_URL undefined"
- Environment variable chưa được set
- Giải pháp: Đã fix rồi trong workflow

## 🚀 Cách khắc phục nhanh:

### Option 1: Xóa cache GitHub Actions
```bash
# Trên máy local:
rm -rf node_modules package-lock.json
npm install
git add .
git commit -m "fix: clean node_modules and package-lock"
git push origin master
```

### Option 2: Trigger workflow lại
1. Truy cập: https://github.com/Huyphan68080/Quanlyhs.github.io/actions
2. Click workflow failed
3. Click **"Re-run failed jobs"**

### Option 3: Push commit trống
```bash
git commit --allow-empty -m "trigger: rebuild"
git push origin master
```

## 📋 Tuy chọn: Hãy bấm link trên để xem lỗi chi tiết, rồi báo tôi lỗi là gì!
