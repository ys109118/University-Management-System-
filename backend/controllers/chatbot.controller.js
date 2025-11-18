const ApiResponse = require("../utils/ApiResponse");
const adminDetails = require("../models/details/admin-details.model");
const facultyDetails = require("../models/details/faculty-details.model");
const studentDetails = require("../models/details/student-details.model");
const Notice = require("../models/notice.model");
const Branch = require("../models/branch.model");
const Subject = require("../models/subject.model");
const Material = require("../models/material.model");
const Timetable = require("../models/timetable.model");
const axios = require('axios');

// Conversation memory store (in production, use Redis or database)
const conversationMemory = new Map();
const MAX_MEMORY_SIZE = 1000;
const MEMORY_EXPIRY = 30 * 60 * 1000; // 30 minutes

// User context tracking
const userSessions = new Map();

const callOpenAI = async (message, systemData = null, conversationHistory = []) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const systemPrompt = `You are Alex, an intelligent College Management System assistant with personality. ${systemData ? `Current system data: ${systemData}` : ''}

Your capabilities:
- 🎓 Academic guidance and system navigation
- 📊 Real-time data analysis and insights
- 🔧 Troubleshooting and technical support
- 💡 Proactive suggestions and recommendations
- 🎯 Context-aware responses based on user role

Personality traits:
- Friendly, professional, and encouraging
- Use relevant emojis to enhance communication
- Provide step-by-step guidance when needed
- Always offer follow-up assistance
- Remember conversation context

Default credentials: Admin (ID: 123456, Password: admin123)

Respond naturally and conversationally while being helpful and informative.`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6), // Keep last 6 messages for context
      { role: 'user', content: message }
    ];
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 300,
      temperature: 0.8,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw error;
  }
};

const getSystemInsights = async () => {
  try {
    const [facultyCount, studentCount, noticeCount, branchCount, materialCount, recentNotices] = await Promise.all([
      facultyDetails.countDocuments(),
      studentDetails.countDocuments(),
      Notice.countDocuments(),
      Branch.countDocuments(),
      Material.countDocuments(),
      Notice.find().sort({ createdAt: -1 }).limit(3).select('title createdAt')
    ]);
    
    return {
      stats: { facultyCount, studentCount, noticeCount, branchCount, materialCount },
      recentActivity: recentNotices.map(n => ({ title: n.title, date: n.createdAt }))
    };
  } catch (error) {
    console.error('System insights error:', error);
    return null;
  }
};

const detectUserIntent = (query) => {
  const lowerQuery = query.toLowerCase();
  
  const intents = {
    greeting: /\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/,
    login: /\b(login|log in|sign in|access|credentials|password|username)\b/,
    stats: /\b(stats|statistics|count|total|numbers|overview|dashboard)\b/,
    notices: /\b(notice|announcement|news|updates|recent)\b/,
    branches: /\b(branch|department|course|program)\b/,
    subjects: /\b(subject|course|syllabus|curriculum)\b/,
    materials: /\b(material|notes|assignment|download|upload|study)\b/,
    timetable: /\b(timetable|schedule|class|timing)\b/,
    help: /\b(help|assist|guide|how to|tutorial|support)\b/,
    features: /\b(feature|function|capability|what can|available)\b/,
    troubleshoot: /\b(problem|issue|error|bug|not working|fix)\b/
  };
  
  for (const [intent, pattern] of Object.entries(intents)) {
    if (pattern.test(lowerQuery)) {
      return intent;
    }
  }
  
  return 'general';
};

const generateContextualResponse = async (query, intent, systemData) => {
  const responses = {
    greeting: () => `👋 Hello! I'm Alex, your AI assistant for the College Management System. I'm here to help you navigate, troubleshoot, and make the most of all features. What would you like to explore today?`,
    
    login: () => `🔐 **Login Information:**\n\n**Admin Access:**\n• Employee ID: \`123456\`\n• Password: \`admin123\`\n\n**Faculty & Students:** Use credentials provided by admin\n\n**Having trouble?** I can help with password resets, account issues, or navigation once you're logged in! 🚀`,
    
    help: () => `🆘 **I'm here to help!** Here's what I can assist you with:\n\n🎯 **Quick Actions:**\n• System navigation & tutorials\n• Login assistance & troubleshooting\n• Feature explanations & guides\n• Real-time system statistics\n\n💡 **Just ask me anything like:**\n• "How do I upload materials?"\n• "Show me recent notices"\n• "What can students do?"\n\nWhat specific help do you need? 🤔`,
    
    features: () => `✨ **System Features Overview:**\n\n👨‍💼 **Admin Dashboard:**\n• Manage faculty, students & branches\n• Create notices & upload timetables\n• System oversight & reporting\n\n👨‍🏫 **Faculty Portal:**\n• Upload study materials & assignments\n• Manage class timetables\n• View student information\n\n👨‍🎓 **Student Access:**\n• Download materials & view timetables\n• Check notices & announcements\n• Update profile information\n\nWhich role interests you most? 🎯`
  };
  
  return responses[intent] ? responses[intent]() : null;
};

const processQuery = async (query, sessionId = 'default', userContext = {}) => {
  const lowerQuery = query.toLowerCase();
  const intent = detectUserIntent(query);
  
  try {
    // Get or create conversation memory
    let conversation = conversationMemory.get(sessionId) || { messages: [], lastActivity: Date.now() };
    
    // Clean expired conversations
    if (Date.now() - conversation.lastActivity > MEMORY_EXPIRY) {
      conversation = { messages: [], lastActivity: Date.now() };
    }
    
    // Handle specific data queries with enhanced responses
    if (intent === 'stats' || lowerQuery.includes('dashboard') || lowerQuery.includes('overview')) {
      const insights = await getSystemInsights();
      if (insights) {
        const { stats, recentActivity } = insights;
        let response = `📊 **Live System Dashboard**\n\n`;
        response += `👥 **User Statistics:**\n`;
        response += `• Faculty Members: ${stats.facultyCount}\n`;
        response += `• Students: ${stats.studentCount}\n`;
        response += `• Active Branches: ${stats.branchCount}\n`;
        response += `• Study Materials: ${stats.materialCount}\n`;
        response += `• Total Notices: ${stats.noticeCount}\n\n`;
        
        if (recentActivity.length > 0) {
          response += `📈 **Recent Activity:**\n`;
          recentActivity.forEach((activity, index) => {
            response += `${index + 1}. ${activity.title}\n`;
          });
        }
        
        response += `\n💡 Want to dive deeper into any specific area?`;
        return response;
      }
    }
    
    if (intent === 'notices' || (lowerQuery.includes('notice') && (lowerQuery.includes('recent') || lowerQuery.includes('latest')))) {
      const recentNotices = await Notice.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name');
      if (recentNotices.length > 0) {
        let response = "📢 **Latest Notices & Announcements:**\n\n";
        recentNotices.forEach((notice, index) => {
          const date = new Date(notice.createdAt).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric' 
          });
          response += `${index + 1}. **${notice.title}**\n`;
          response += `   📅 ${date} • By: ${notice.createdBy?.name || 'Admin'}\n\n`;
        });
        response += "🔔 Need help managing notices or want to create one?";
        return response;
      } else {
        return "📢 No recent notices found in the system.\n\n💡 **Quick tip:** Admins can create notices from the dashboard to keep everyone informed!\n\nWould you like to know how to create your first notice?";
      }
    }
    
    if (intent === 'branches' || (lowerQuery.includes('branch') && (lowerQuery.includes('list') || lowerQuery.includes('available')))) {
      const branches = await Branch.find().select('name');
      if (branches.length > 0) {
        let response = "🏢 **Available Academic Branches:**\n\n";
        branches.forEach((branch, index) => {
          response += `${index + 1}. ${branch.name}\n`;
        });
        response += "\n🎯 Each branch has its own subjects, materials, and timetables!\n\nNeed help with branch management or want to explore a specific branch?";
        return response;
      } else {
        return "🏢 No branches configured yet.\n\n🚀 **Getting started:** Admins can add branches from the dashboard to organize courses and subjects.\n\nWould you like a step-by-step guide?";
      }
    }
    
    if (intent === 'subjects' || (lowerQuery.includes('subject') && (lowerQuery.includes('list') || lowerQuery.includes('available')))) {
      const subjects = await Subject.find().limit(15).populate('branch', 'name');
      if (subjects.length > 0) {
        let response = "📚 **Available Subjects:**\n\n";
        subjects.forEach((subject, index) => {
          response += `${index + 1}. **${subject.name}** (${subject.code})\n`;
          if (subject.branch) response += `   🏢 Branch: ${subject.branch.name}\n`;
        });
        if (subjects.length === 15) response += "\n... and more!\n";
        response += "\n📖 Each subject can have materials, assignments, and timetables.\n\nInterested in a specific subject or need help with subject management?";
        return response;
      } else {
        return "📚 No subjects found in the system.\n\n💡 **Setup tip:** Add branches first, then subjects can be assigned to each branch.\n\nNeed help setting up the academic structure?";
      }
    }
    
    if (intent === 'materials' || lowerQuery.includes('material') || lowerQuery.includes('download') || lowerQuery.includes('upload')) {
      const materialCount = await Material.countDocuments();
      let response = `📁 **Study Materials System:**\n\n`;
      response += `📊 Total materials available: ${materialCount}\n\n`;
      response += `**For Faculty:**\n• Upload notes, assignments & syllabus\n• Organize by subject and semester\n• Track student downloads\n\n`;
      response += `**For Students:**\n• Access materials by subject\n• Download notes and assignments\n• Filter by type and semester\n\n`;
      response += `🎯 Want help with uploading or finding specific materials?`;
      return response;
    }
    
    // Check for contextual responses first
    const contextualResponse = await generateContextualResponse(query, intent);
    if (contextualResponse) {
      return contextualResponse;
    }

    // Use OpenAI with conversation history
    const systemInsights = await getSystemInsights();
    const systemContext = systemInsights ? JSON.stringify(systemInsights) : 'System data unavailable';
    
    const response = await callOpenAI(query, systemContext, conversation.messages);
    
    // Update conversation memory
    conversation.messages.push(
      { role: 'user', content: query },
      { role: 'assistant', content: response }
    );
    conversation.lastActivity = Date.now();
    
    // Limit conversation history
    if (conversation.messages.length > 20) {
      conversation.messages = conversation.messages.slice(-20);
    }
    
    conversationMemory.set(sessionId, conversation);
    
    // Clean up old conversations
    if (conversationMemory.size > MAX_MEMORY_SIZE) {
      const oldestKey = conversationMemory.keys().next().value;
      conversationMemory.delete(oldestKey);
    }
    
    return response;
    
  } catch (error) {
    console.error('Query processing error:', error);
    
    // Enhanced fallback responses
    const fallbackResponses = {
      greeting: "👋 Hello! I'm Alex, your AI assistant. I'm here to help you navigate the College Management System. What can I help you with today?",
      login: "🔐 **Login Help:**\n\n**Admin:** Employee ID `123456`, Password `admin123`\n**Others:** Use credentials provided by admin\n\nHaving login issues? I can guide you through troubleshooting steps!",
      help: "🆘 I'm here to help! Ask me about login, features, navigation, or any system-related questions. What do you need assistance with?",
      general: "💬 I'm your College Management System assistant! I can help with:\n\n• 🔐 Login & access issues\n• 📊 System features & navigation\n• 🎯 Step-by-step guides\n• 🔧 Troubleshooting\n\nWhat would you like to explore?"
    };
    
    return fallbackResponses[intent] || fallbackResponses.general;
  }
};

const chatQuery = async (req, res) => {
  try {
    const { message, sessionId, userContext } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json(new ApiResponse(400, null, "Message is required"));
    }
    
    if (message.length > 1000) {
      return res.status(400).json(new ApiResponse(400, null, "Message too long. Please keep it under 1000 characters."));
    }
    
    const finalSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const response = await processQuery(message, finalSessionId, userContext || {});
    
    // Generate smart suggestions based on the response
    const suggestions = generateSmartSuggestions(message, response);
    
    res.status(200).json(new ApiResponse(200, { 
      response, 
      sessionId: finalSessionId,
      suggestions,
      timestamp: new Date().toISOString()
    }, "Query processed successfully"));
  } catch (error) {
    console.error('Chat query error:', error);
    
    // Provide helpful error response
    const errorResponse = "😔 I'm experiencing some technical difficulties right now. Please try again in a moment, or ask me something else!\n\n💡 **Quick help:** You can always ask about login (ID: 123456, Password: admin123) or system features!";
    
    res.status(200).json(new ApiResponse(200, { 
      response: errorResponse,
      isError: true 
    }, "Fallback response provided"));
  }
};

const generateSmartSuggestions = (userMessage, botResponse) => {
  const lowerMessage = userMessage.toLowerCase();
  const lowerResponse = botResponse.toLowerCase();
  
  const suggestionSets = {
    login: [
      "How do I reset my password?",
      "What if I forgot my credentials?",
      "Show me the admin dashboard",
      "Help with faculty login"
    ],
    stats: [
      "Show recent notices",
      "List all branches",
      "What can faculty do?",
      "Student portal features"
    ],
    features: [
      "How to upload materials?",
      "Create a new notice",
      "Manage student accounts",
      "View system statistics"
    ],
    general: [
      "Getting started guide",
      "System overview",
      "Login help",
      "Troubleshooting tips"
    ]
  };
  
  if (lowerMessage.includes('login') || lowerResponse.includes('login')) {
    return suggestionSets.login;
  }
  if (lowerMessage.includes('stats') || lowerResponse.includes('statistics')) {
    return suggestionSets.stats;
  }
  if (lowerMessage.includes('feature') || lowerResponse.includes('dashboard')) {
    return suggestionSets.features;
  }
  
  return suggestionSets.general;
};

// Cleanup function for conversation memory
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, conversation] of conversationMemory.entries()) {
    if (now - conversation.lastActivity > MEMORY_EXPIRY) {
      conversationMemory.delete(sessionId);
    }
  }
}, 10 * 60 * 1000); // Clean every 10 minutes

module.exports = { 
  chatQuery, 
  callOpenAI, 
  processQuery, 
  getSystemInsights,
  generateSmartSuggestions 
};