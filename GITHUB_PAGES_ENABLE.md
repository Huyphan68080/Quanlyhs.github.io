# ✅ Cách kích hoạt GitHub Pages

Lỗi hiện tại là **GitHub Pages chưa được enable** trong repository settings.

## 📝 Bước 1: Kích hoạt GitHub Pages

1. Truy cập: **https://github.com/Huyphan68080/Quanlyhs.github.io/settings/pages**

2. Tìm mục **"Build and deployment"**

3. Under **"Source"**, chọn:
   - **Deploy from a branch**

4. Chọn branch và folder:
   - **Branch:** `master` (mới sửa từ main)
   - **Folder:** `/(root)`

5. Click **Save**

## 🔄 Bước 2: Trigger deployment lại

Sau khi enable GitHub Pages:

1. Đi đến: https://github.com/Huyphan68080/Quanlyhs.github.io/actions

2. Tìm workflow **"Deploy to GitHub Pages"** bị failed

3. Click **Re-run all jobs**

Hoặc đơn giản: push một commit mới
```bash
cd d:\Demo\Quanlyhocsinh
git add .
git commit -m "trigger: re-run deployment"
git push origin master
```

## ✨ Frontend sẽ có tại:
- **https://huyphan68080.github.io/Quanlyhs.github.io/**

## 🔗 Sau khi bật GitHub Pages:
- GitHub Actions sẽ tự động build và deploy trên mỗi push
- Nó sẽ update `gh-pages` branch tự động
- Frontend sẽ accessible tại URL trên

---

**Đã sửa:** Branch trong workflow từ `main` → `master` để match repo của bạn
