require('dotenv').config();
const axios = require('axios');

const testLoginAPI = async () => {
  try {
    console.log("🧪 Testing Alice login API...\n");

    const loginData = {
      email: "alice@gmail.com",
      password: "student123"
    };

    console.log("📤 Sending login request:");
    console.log(`   - URL: http://localhost:3001/api/student/login`);
    console.log(`   - Email: ${loginData.email}`);
    console.log(`   - Password: ${loginData.password}`);

    const response = await axios.post('http://localhost:3001/api/student/login', loginData);

    console.log("\n✅ Login successful!");
    console.log(`   - Token: ${response.data.data.token.substring(0, 20)}...`);
    console.log(`   - Message: ${response.data.message}`);

  } catch (error) {
    console.error("\n❌ Login failed:");
    if (error.response) {
      console.error(`   - Status: ${error.response.status}`);
      console.error(`   - Message: ${error.response.data.message}`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error("   - Server not running. Please start the backend server first.");
    } else {
      console.error(`   - Error: ${error.message}`);
    }
  }
};

testLoginAPI();