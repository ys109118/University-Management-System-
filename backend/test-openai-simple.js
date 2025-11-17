require('dotenv').config();
const axios = require('axios');

const testOpenAI = async () => {
  console.log('🔑 API Key check:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ No OpenAI API key found in .env file');
    return;
  }
  
  try {
    console.log('🧪 Testing OpenAI API...');
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Hello, are you working?' }
      ],
      max_tokens: 50
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ OpenAI Response:', response.data.choices[0].message.content);
    
  } catch (error) {
    console.log('❌ OpenAI Error:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.error?.message || error.message);
  }
};

testOpenAI();