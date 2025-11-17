const axios = require('axios');

const testOpenAI = async () => {
  console.log('🧪 Testing OpenAI API Integration...\n');
  
  try {
    // Test the test endpoint
    const response = await axios.get('http://localhost:3001/api/chatbot/test-openai');
    
    console.log('📊 Test Results:');
    console.log('Status:', response.data.status);
    console.log('Message:', response.data.message);
    
    if (response.data.response) {
      console.log('🤖 OpenAI Response:', response.data.response);
    }
    
    console.log('\n✅ OpenAI API test completed!');
    
  } catch (error) {
    console.log('❌ Test failed:');
    if (error.code === 'ECONNREFUSED') {
      console.log('Server not running. Start with: npm run dev');
    } else {
      console.log('Error:', error.response?.data || error.message);
    }
  }
};

// Test actual chatbot query
const testChatbotQuery = async () => {
  console.log('\n🤖 Testing Chatbot Query...\n');
  
  try {
    const response = await axios.post('http://localhost:3001/api/chatbot/query', {
      message: 'Hello, can you help me understand how to use this system?'
    });
    
    console.log('✅ Chatbot Response:');
    console.log(response.data.data.response);
    
  } catch (error) {
    console.log('❌ Chatbot test failed:');
    console.log('Error:', error.response?.data || error.message);
  }
};

// Run tests
const runAllTests = async () => {
  await testOpenAI();
  await testChatbotQuery();
};

runAllTests();