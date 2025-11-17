const axios = require('axios');

const testChatbot = async () => {
  try {
    const response = await axios.post('http://localhost:4000/api/chatbot/query', {
      message: 'Hello, how do I login as admin?'
    });
    
    console.log('✅ Chatbot API Test Successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Chatbot API Test Failed!');
    console.log('Error:', error.response?.data || error.message);
  }
};

// Test different queries
const testQueries = [
  'Hello',
  'How do I login as admin?',
  'What can faculty do?',
  'How do students access materials?',
  'Help with password reset'
];

const runAllTests = async () => {
  console.log('🚀 Testing Chatbot API...\n');
  
  // First check if server is running
  try {
    await axios.get('http://localhost:3001/');
    console.log('✅ Server is running on port 3001');
  } catch (error) {
    console.log('❌ Server is not running on port 3001');
    console.log('Please start the backend server with: npm run dev');
    console.log('Make sure PORT=3001 in your .env file\n');
    return;
  }
  
  // Check if chatbot route is registered
  try {
    await axios.get('http://localhost:3001/api/chatbot/test');
    console.log('✅ Chatbot route is registered\n');
  } catch (error) {
    console.log('❌ Chatbot route not found');
    console.log('Error:', error.response?.status, error.response?.statusText);
    console.log('Make sure the server is restarted after adding chatbot routes\n');
    return;
  }
  
  for (const query of testQueries) {
    try {
      const response = await axios.post('http://localhost:3001/api/chatbot/query', {
        message: query
      });
      
      console.log(`✅ Query: "${query}"`);
      console.log(`Response: "${response.data.data.response}"`);
      console.log('---');
    } catch (error) {
      console.log(`❌ Failed for query: "${query}"`);
      if (error.code === 'ECONNREFUSED') {
        console.log('Error: Connection refused - Server not running');
      } else {
        console.log('Error:', error.response?.data || error.message);
      }
      console.log('---');
    }
  }
};

// Run tests if server is running
runAllTests();