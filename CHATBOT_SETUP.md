# Chatbot Setup Guide

## 🤖 Enhanced AI Chatbot Integration

Your College Management System now includes an intelligent chatbot that can use OpenAI's ChatGPT for enhanced responses.

## 🔧 Setup Instructions

### Option 1: With OpenAI Integration (Recommended)

1. **Get OpenAI API Key:**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key (starts with `sk-...`)

2. **Add API Key to Environment:**
   ```bash
   # In backend/.env file, add:
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Install Dependencies:**
   ```bash
   cd backend
   npm install axios
   ```

### Option 2: Without OpenAI (Free)

The chatbot works perfectly without OpenAI using predefined responses and database queries.

## 🚀 Features

### With OpenAI:
- ✅ Natural language understanding
- ✅ Context-aware responses
- ✅ Dynamic conversation flow
- ✅ Database queries for system data
- ✅ Intelligent follow-up questions

### Without OpenAI:
- ✅ Predefined helpful responses
- ✅ Database queries for system data
- ✅ Quick action buttons
- ✅ Follow-up suggestions

## 💬 Available Queries

### System Data (Always Available):
- `"Show me system statistics"`
- `"Show recent notices"`
- `"List all branches"`
- `"Show available subjects"`

### General Help (Enhanced with OpenAI):
- `"How do I reset my password?"`
- `"What features are available for students?"`
- `"How can faculty upload materials?"`
- `"Explain the admin dashboard"`

## 🔒 Security Notes

- Keep your OpenAI API key secure
- Never commit API keys to version control
- Monitor API usage to avoid unexpected charges
- The system gracefully falls back to local responses if OpenAI fails

## 💰 Cost Considerations

- OpenAI charges per token used
- Typical chatbot queries cost ~$0.001-0.01 each
- Set usage limits in OpenAI dashboard
- Monitor costs regularly

## 🛠️ Troubleshooting

### If OpenAI responses aren't working:
1. Check API key is correctly set in `.env`
2. Verify internet connection
3. Check OpenAI account has credits
4. Review server logs for error messages

### Fallback behavior:
- System automatically uses local responses if OpenAI fails
- No functionality is lost without OpenAI integration
- Database queries always work regardless of OpenAI status

## 📊 Testing

Test the chatbot with these queries:
```
"Hello" - Should get AI-powered greeting
"Show stats" - Should show database statistics
"How do I login?" - Should get helpful instructions
"What can you help me with?" - Should get comprehensive response
```