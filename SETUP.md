# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v14+)
- MongoDB
- Git

## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd College-Management-System
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Environment Setup**

**Backend (.env)**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/College-Management-System
PORT=3001
FRONTEND_API_LINK=http://localhost:3000
JWT_SECRET=THISISSECRET

NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASS=your_app_password

# Optional: For AI chatbot
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Frontend (.env)**
```env
REACT_APP_APILINK=http://localhost:3001/api
REACT_APP_MEDIA_LINK=http://localhost:3001/media
```

4. **Start the application**
```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm start
```

5. **Create admin account**
```bash
cd backend
node admin-seeder.js
```

## 🔑 Default Credentials

**Admin:** 123456 / admin123  
**Student:** alice@gmail.com / student123

## 🏠 Hostel Features

- ✅ Room allocation system
- ✅ Student room requests  
- ✅ Complaint management
- ✅ Admin hostel management
- ✅ Gender-based filtering

Access: http://localhost:3000