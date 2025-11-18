require('dotenv').config();
const axios = require('axios');

const testLoginResponse = async () => {
  try {
    console.log("🧪 Testing Alice login response...\n");

    const response = await axios.post('http://localhost:3001/api/student/login', {
      email: "alice@gmail.com",
      password: "student123"
    });

    console.log("✅ Login successful!");
    console.log("📦 Response data structure:");
    console.log(`   - Success: ${response.data.success}`);
    console.log(`   - Message: ${response.data.message}`);
    console.log(`   - Has token: ${!!response.data.data.token}`);
    console.log(`   - Has user: ${!!response.data.data.user}`);
    
    if (response.data.data.user) {
      const user = response.data.data.user;
      console.log("\n👩 User data:");
      console.log(`   - ID: ${user._id}`);
      console.log(`   - Name: ${user.firstName} ${user.lastName}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Gender: ${user.gender}`);
      console.log(`   - Branch: ${user.branchId?.name || 'No branch'}`);
    }

  } catch (error) {
    console.error("❌ Login failed:");
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

testLoginResponse();