@echo off
echo 🚀 Starting College Management System with Chatbot...
echo.

echo 📁 Checking directories...
if not exist "backend" (
    echo ❌ Backend directory not found!
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Frontend directory not found!
    pause
    exit /b 1
)

echo ✅ Directories found!
echo.

echo 🔧 Installing dependencies...
cd backend
call npm install
cd ../frontend
call npm install
cd ..

echo.
echo 🌐 Starting servers...
echo.
echo 📝 Instructions:
echo 1. Backend will start on http://localhost:3001
echo 2. Frontend will start on http://localhost:3000
echo 3. Look for the chatbot icon in the bottom-right corner
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd frontend && npm start"

echo ✅ Servers starting...
echo 💬 Chatbot is ready to use!
pause