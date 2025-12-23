# 🚀 Netlify Deployment Guide

## 📋 **Pre-Deployment Checklist:**

### **1. Environment Variables Setup:**

Create a `.env` file in your `frontend` folder:

```bash
# Frontend Environment Variables
VITE_BACKEND_URL=https://your-backend-url.herokuapp.com
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

### **2. Update Backend URL:**

Make sure your backend is deployed and update the `VITE_BACKEND_URL` in your frontend `.env` file.

## 🌐 **Netlify Deployment Steps:**

### **Step 1: Connect to GitHub**

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Choose "GitHub" as your Git provider
5. Select your repository

### **Step 2: Configure Build Settings**

Netlify will auto-detect these settings from `netlify.toml`:

- **Build command**: `cd frontend && npm install && npm run build`
- **Publish directory**: `frontend/dist`
- **Node version**: 18

### **Step 3: Set Environment Variables**

In Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add these variables:
   ```
   VITE_BACKEND_URL = https://your-backend-url.herokuapp.com
   VITE_RAZORPAY_KEY_ID = your-razorpay-key-id
   ```

### **Step 4: Deploy**

1. Click "Deploy site"
2. Wait for build to complete
3. Your site will be live at `https://your-site-name.netlify.app`

## 🔧 **Backend Deployment (Required):**

### **Option 1: Heroku (Recommended)**

1. Create `Procfile` in your backend root:
   ```
   web: node index.js
   ```
2. Deploy to Heroku
3. Set environment variables in Heroku dashboard

### **Option 2: Railway**

1. Connect your GitHub repo to Railway
2. Set environment variables
3. Deploy automatically

## 🛠️ **Troubleshooting:**

### **Common Issues:**

1. **Build fails**: Check Node.js version (should be 18+)
2. **Environment variables not working**: Make sure they start with `VITE_`
3. **Backend connection fails**: Check CORS settings in backend
4. **Images not loading**: Check image paths and Cloudinary setup

### **CORS Configuration:**

In your backend `index.js`, update CORS:

```javascript
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-site.netlify.app"],
    credentials: true,
  })
);
```

## 📝 **Post-Deployment:**

1. Test all functionality
2. Check payment integration
3. Verify image uploads
4. Test admin features
5. Update any hardcoded URLs

## 🔒 **Security Reminders:**

- Never commit `.env` files
- Use production API keys
- Enable HTTPS
- Set up proper CORS







