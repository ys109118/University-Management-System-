# 🎓 College Management System with AI Chatbot

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)](https://www.mongodb.com/mern-stack)
[![OpenAI](https://img.shields.io/badge/AI-OpenAI%20GPT-green)](https://openai.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v18+-blue)](https://reactjs.org)

> A comprehensive MERN stack College Management System enhanced with an intelligent AI chatbot assistant powered by OpenAI GPT-3.5

A comprehensive MERN stack-based College Management System that helps manage academic activities, student information, faculty details, and administrative tasks. This system streamlines the management of educational institutions by providing a centralized platform for administrators, faculty, and students.

## Features

### Admin Features

- Manage faculty accounts with detailed profiles and emergency contacts
- Manage student accounts with enrollment numbers and academic details
- Manage academic branches
- Handle subject/course management by semester and branch
- Generate and manage notices for students and faculty
- Upload and manage timetables by branch and semester
- **Hostel Management** - Manage hostels, rooms, allocations, and complaints
- Profile management and password updates

### Faculty Features

- View and manage personal profile with emergency contacts
- Upload and manage study materials (notes, assignments, syllabus)
- Filter and organize materials by subject, semester, and type
- Upload and manage timetables for their branches
- Search and view student information by enrollment, name, or semester
- View and respond to notices
- Update profile and credentials
- Password management and reset functionality

### Student Features

- View personal profile and academic details
- Access study materials filtered by subject and type
- View class timetables with download option
- Access notices and announcements
- **Hostel Services** - View room allocation and submit complaints
- Update profile information
- Password management and reset functionality

### 🤖 AI Chatbot Assistant "Alex"

- 🎆 **Intelligent AI Assistant** - Powered by OpenAI GPT-3.5 Turbo
- 💬 **Natural Conversations** - Human-like interactions and responses
- 🚀 **Smart Suggestions** - Context-aware quick actions and follow-ups
- 📊 **Real-time Data** - Live system statistics and information
- 🎨 **Modern UI** - Glassmorphism design with smooth animations
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Instant Help** - 24/7 assistance for navigation and troubleshooting
- 🔍 **Multi-query Support** - Handles complex questions intelligently

## 🛠️ Tech Stack

### Core Technologies
- **Frontend**: React.js 18+ with Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

### AI Integration
- **AI Engine**: OpenAI GPT-3.5 Turbo
- **Chat Interface**: Custom React components
- **Real-time Features**: Axios for API communication

### UI/UX
- **Styling**: Tailwind CSS with custom animations
- **Design**: Glassmorphism effects and modern gradients
- **Responsive**: Mobile-first responsive design

## Prerequisites

- Node.js
- MongoDB
- npm

## Setup Instructions

Project Setup Video Tutorial: https://youtu.be/gw4jh4RHzuo

Sample .env file is added in both backend and frontend, copy that variables and create `.env` in both the folders and then follow below given instructions

1. Clone the repository:

```bash
git clone https://github.com/ys109118/University-Management-System-.git
cd University-Management-System-
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:

```
MONGODB_URI =mongodb://127.0.0.1:27017/College-Management-System
PORT = 4000
FRONTEND_API_LINK = http://localhost:3000
JWT_SECRET = THISISSECRET

NODEMAILER_EMAIL =
NODEMAILER_PASS =
```

4. Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/College-Management-System
PORT=3001
FRONTEND_API_LINK=http://localhost:3000
JWT_SECRET=THISISSECRET

NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASS=your_app_password

# OpenAI Configuration (Optional - for enhanced chatbot)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

5. Create a `.env` file in the frontend directory:

```env
REACT_APP_APILINK=http://localhost:3001/api
REACT_APP_MEDIA_LINK=http://localhost:3001/media
```

6. Start the development servers:

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm start
```

## 🚀 Initial Setup

### 1. Create Admin Account
```bash
cd backend
npm run seed
```

**Default Admin Credentials:**
- Employee ID: `123456`
- Password: `admin123`
- Email: `admin@gmail.com`

### 2. AI Chatbot Setup (Optional)

**To enable AI-powered responses:**

1. Get OpenAI API Key:
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create account and generate API key
   - Copy the key (starts with `sk-`)

2. Add to backend `.env`:
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. Restart backend server

**Without OpenAI:** Chatbot works with predefined responses + database queries

**With OpenAI:** Enhanced with intelligent, context-aware conversations

## 🤖 AI Chatbot Features

### Intelligent Conversations
- **Natural Language Processing** - Understands complex queries
- **Context Awareness** - Remembers conversation flow
- **Smart Suggestions** - Provides relevant follow-up questions
- **Multi-turn Conversations** - Maintains context across messages

### System Integration
- **Live Data Queries** - Real-time statistics and information
- **Database Integration** - Fetches current notices, branches, subjects
- **User Role Awareness** - Tailored responses for admin/faculty/student
- **Feature Navigation** - Step-by-step guidance through system features

### Modern UI/UX
- **Glassmorphism Design** - Modern transparent effects
- **Smooth Animations** - Fade-in, slide-up, and hover effects
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Typing Indicators** - Shows when AI is thinking/responding
- **Message Timestamps** - Professional chat experience

### Example Queries
```
“I’m new to this system, where should I start?”
“How do I upload study materials as a faculty?”
“Show me the latest notices”
“What are the system statistics?”
“How can students access their timetables?”
```

## 📁 Project Structure

```
college-management-system/
├── backend/
│   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── media/
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── public/
└── README.md
```

## For Any Doubt Feel Free To Contact Me 🚀

**Yash Sharma**
- Email: [ys109118@gmail.com](mailto:ys109118@gmail.com)
- [Linkedin](https://www.linkedin.com/in/yash-sharma-99282a251/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
