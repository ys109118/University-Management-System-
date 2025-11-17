const ApiResponse = require("../utils/ApiResponse");
const adminDetails = require("../models/details/admin-details.model");
const facultyDetails = require("../models/details/faculty-details.model");
const studentDetails = require("../models/details/student-details.model");
const Notice = require("../models/notice.model");
const Branch = require("../models/branch.model");
const Subject = require("../models/subject.model");
const axios = require('axios');

const callOpenAI = async (message, systemData = null) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const systemPrompt = `You are an expert College Management System assistant. ${systemData ? `System info: ${systemData}` : ''}

You help with:
- Login procedures (Admin: ID 123456, Password admin123)
- Navigation and features for Admin, Faculty, and Students
- Step-by-step instructions for all system functions
- Troubleshooting and best practices

Always be helpful, conversational, and end with a relevant follow-up question.`;
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 250,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw error;
  }
};

const processQuery = async (query) => {
  const lowerQuery = query.toLowerCase();
  
  try {
    // Handle specific data queries with database
    if (lowerQuery.includes('stats') || lowerQuery.includes('count') || lowerQuery.includes('total')) {
      const [facultyCount, studentCount, noticeCount, branchCount] = await Promise.all([
        facultyDetails.countDocuments(),
        studentDetails.countDocuments(),
        Notice.countDocuments(),
        Branch.countDocuments()
      ]);
      return `📊 System Statistics:\n\n👨🏫 Total Faculty: ${facultyCount}\n👨🎓 Total Students: ${studentCount}\n📢 Total Notices: ${noticeCount}\n🏢 Total Branches: ${branchCount}\n\nWhat would you like to know about these numbers?`;
    }
    
    if (lowerQuery.includes('notice') && (lowerQuery.includes('recent') || lowerQuery.includes('latest'))) {
      const recentNotices = await Notice.find().sort({ createdAt: -1 }).limit(3);
      if (recentNotices.length > 0) {
        return "📢 Recent Notices:\n\n" + recentNotices.map((notice, index) => 
          `${index + 1}. ${notice.title}\n   📅 ${new Date(notice.createdAt).toLocaleDateString()}`
        ).join('\n\n') + "\n\nWould you like help creating or managing notices?";
      } else {
        return "📢 No recent notices found.\n\nWould you like to know how to create your first notice?";
      }
    }
    
    if (lowerQuery.includes('branch') && (lowerQuery.includes('list') || lowerQuery.includes('available'))) {
      const branches = await Branch.find();
      if (branches.length > 0) {
        return "🏢 Available Branches:\n\n" + branches.map((branch, index) => 
          `${index + 1}. ${branch.name}`
        ).join('\n') + "\n\nNeed help managing any of these branches?";
      } else {
        return "🏢 No branches found.\n\nWould you like to know how to add branches to the system?";
      }
    }
    
    if (lowerQuery.includes('subject') && (lowerQuery.includes('list') || lowerQuery.includes('available'))) {
      const subjects = await Subject.find().limit(10);
      if (subjects.length > 0) {
        return "📚 Available Subjects (first 10):\n\n" + subjects.map((subject, index) => 
          `${index + 1}. ${subject.name} (${subject.code})`
        ).join('\n') + "\n\nNeed help with subject management or materials?";
      } else {
        return "📚 No subjects found.\n\nWould you like to know how to add subjects to the system?";
      }
    }

    // Use OpenAI for everything else
    const systemContext = `College Management System features:
    - Admin Dashboard: Manage faculty, students, branches, subjects, notices, timetables
    - Faculty Dashboard: Upload materials, manage timetables, view students, respond to notices  
    - Student Dashboard: View materials, timetables, notices, update profile
    - Default admin login: Employee ID 123456, Password admin123`;
    
    return await callOpenAI(query, systemContext);
    
  } catch (error) {
    console.error('Query processing error:', error);
    
    // Fallback responses if OpenAI fails
    if (lowerQuery.match(/\b(hi|hello|hey|greetings)\b/)) {
      return "Hello! I'm your College Management Assistant. I can help you with login procedures, system navigation, and feature explanations. What would you like to know?";
    }
    
    if (lowerQuery.includes('login')) {
      return "For admin login, use Employee ID: 123456 and Password: admin123. Faculty and students use credentials provided by admin. Need help with a specific login issue?";
    }
    
    return "I'm here to help with the College Management System! You can ask me about:\n\n• Login procedures\n• Admin, Faculty, or Student features\n• System navigation\n• Troubleshooting\n\nWhat would you like to know?";
  }
};

const chatQuery = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json(new ApiResponse(400, null, "Message is required"));
    }

    const response = await processQuery(message);
    
    res.status(200).json(new ApiResponse(200, { response }, "Query processed successfully"));
  } catch (error) {
    console.error('Chat query error:', error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};

module.exports = { chatQuery, callOpenAI };