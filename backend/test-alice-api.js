require('dotenv').config();
const axios = require('axios');

const testAliceAPI = async () => {
  try {
    console.log("🧪 Testing Alice API calls...\n");

    // 1. Login as Alice
    const loginResponse = await axios.post('http://localhost:3001/api/student/login', {
      email: "alice@gmail.com",
      password: "student123"
    });

    console.log("✅ Login successful");
    console.log("📦 Full login response:", loginResponse.data);
    
    const { token, user } = loginResponse.data.data;
    console.log(`👩 User data from login:`, user ? {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      gender: user.gender
    } : 'No user data');

    // 2. Get allocations
    const allocationsResponse = await axios.get('http://localhost:3001/api/hostel/allocations', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`\n🏠 Allocations API returned ${allocationsResponse.data.data.length} allocations:`);
    allocationsResponse.data.data.forEach((alloc, index) => {
      console.log(`   ${index + 1}. Student ID: ${alloc.studentId?._id || 'No ID'}`);
      console.log(`      Name: ${alloc.studentId?.firstName || 'Unknown'} ${alloc.studentId?.lastName || ''}`);
      console.log(`      Hostel: ${alloc.hostelId?.name || 'Unknown'}`);
      console.log(`      Room: ${alloc.roomId?.roomNumber || 'Unknown'}`);
    });

    // 3. Check if Alice's allocation exists
    const aliceAllocation = allocationsResponse.data.data.find(alloc => {
      const allocStudentId = alloc.studentId?._id || alloc.studentId;
      return allocStudentId === user._id || allocStudentId?.toString() === user._id?.toString();
    });

    console.log(`\n🔍 Alice's allocation found: ${aliceAllocation ? 'YES' : 'NO'}`);
    if (aliceAllocation) {
      console.log(`   - Hostel: ${aliceAllocation.hostelId?.name}`);
      console.log(`   - Room: ${aliceAllocation.roomId?.roomNumber}`);
      console.log(`   - Bed: ${aliceAllocation.bedNumber}`);
    }

  } catch (error) {
    console.error("❌ Test failed:", error.response?.data?.message || error.message);
  }
};

testAliceAPI();