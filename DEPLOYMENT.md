# Deployment Guide

## Frontend - GitHub Pages

The frontend is deployed to GitHub Pages automatically on every push to the master branch.

### Setup:
1. The homepage in `client/package.json` is set to: `https://huyphan68080.github.io/Quanlyhs.github.io`
2. GitHub Actions workflow (`.github/workflows/deploy.yml`) handles automatic deployment
3. Environment variables in `client/.env.production` point to the Render backend

### Manual Deployment:
```bash
cd client
npm run build
npm run deploy
```

## Backend - Render.com

The server is deployed on Render.com and runs on: `https://quanlyhs.onrender.com`

### Setup Instructions:

1. **Create a new Web Service on Render:**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `https://github.com/Huyphan68080/Quanlyhs.github.io.git`

2. **Configure the service:**
   - **Name:** quanlyhs-server
   - **Environment:** Node
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Plan:** Free (or upgrade as needed)

3. **Set Environment Variables:**
   - Add `MONGODB_URI`: Your MongoDB connection string
   - Add `HOST`: `0.0.0.0`
   - Add `NODE_ENV`: `production`
   - Add `PORT`: `5000`

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically deploy and provide a URL like: `https://quanlyhs.onrender.com`

### MongoDB Setup:

You'll need a MongoDB database. Use MongoDB Atlas (free tier):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/quanlyhs`
4. Add this as the `MONGODB_URI` environment variable on Render

## API Endpoints

The frontend automatically points to the Render backend for all API calls.

Example API call from frontend:
- Development: `http://localhost:5000/api/students`
- Production: `https://quanlyhs.onrender.com/api/students`

## Testing

1. **Frontend:** https://huyphan68080.github.io/Quanlyhs.github.io
2. **API Health Check:** https://quanlyhs.onrender.com/health

## Troubleshooting

- **Frontend not loading:** Check GitHub Actions workflow in `.github/workflows/deploy.yml`
- **API not responding:** Check Render logs on https://dashboard.render.com/
- **CORS issues:** CORS is enabled in `server/server.js`
- **MongoDB connection:** Verify `MONGODB_URI` on Render dashboard
