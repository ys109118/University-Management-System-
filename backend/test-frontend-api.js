require('dotenv').config();
const axios = require('axios');

const baseURL = 'http://localhost:3001/api';

const testFrontendAPI = async () => {
  try {
    console.log('🧪 Testing Frontend API calls...\n');

    // 1. Student Login (Alice)
    console.log('1️⃣ Logging in as Alice...');
    const loginResponse = await axios.post(`${baseURL}/student/login`, {
      enrollmentNo: '2021001',
      password: 'alice123'
    });

    if (!loginResponse.data.success) {
      throw new Error('Login failed');
    }

    const token = loginResponse.data.data.token;
    const userData = loginResponse.data.data.user;
    console.log('✅ Login successful');
    console.log(`   - Student ID: ${userData._id}`);
    console.log(`   - Name: ${userData.firstName} ${userData.lastName}`);
    console.log(`   - Email: ${userData.email}\n`);

    // 2. Get Allocations (what frontend calls)
    console.log('2️⃣ Getting allocations (frontend call)...');
    const allocationsResponse = await axios.get(`${baseURL}/hostel/allocations`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`✅ API returned ${allocationsResponse.data.data.length} allocations`);
    
    // 3. Filter for Alice (what frontend does)
    console.log('\n3️⃣ Filtering for Alice (frontend logic)...');
    const studentId = userData._id;
    console.log(`   - Looking for student ID: ${studentId}`);
    
    const userAllocation = allocationsResponse.data.data.find(alloc => {
      const allocStudentId = alloc.studentId?._id || alloc.studentId;
      console.log(`   - Checking allocation: ${allocStudentId} === ${studentId}`);
      return allocStudentId === studentId || allocStudentId?.toString() === studentId?.toString();
    });

    if (userAllocation) {
      console.log('✅ Found Alice\'s allocation:');
      console.log(`   - Hostel: ${userAllocation.hostelId?.name}`);
      console.log(`   - Room: ${userAllocation.roomId?.roomNumber}`);
      console.log(`   - Bed: ${userAllocation.bedNumber}`);
      console.log(`   - Status: ${userAllocation.status}`);
    } else {
      console.log('❌ No allocation found for Alice');
      console.log('\n📋 All allocations returned:');
      allocationsResponse.data.data.forEach((alloc, index) => {
        console.log(`   ${index + 1}. Student ID: ${alloc.studentId?._id || alloc.studentId}`);
        console.log(`      Name: ${alloc.studentId?.firstName} ${alloc.studentId?.lastName}`);
        console.log(`      Email: ${alloc.studentId?.email}`);
      });
    }

    // 4. Test Complaints API
    console.log('\n4️⃣ Getting complaints...');
    const complaintsResponse = await axios.get(`${baseURL}/hostel/complaints`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`✅ API returned ${complaintsResponse.data.data.length} complaints`);
    
    const userComplaints = complaintsResponse.data.data.filter(complaint => {
      const complaintStudentId = complaint.studentId?._id || complaint.studentId;
      return complaintStudentId === studentId || complaintStudentId?.toString() === studentId?.toString();
    });

    console.log(`✅ Found ${userComplaints.length} complaints for Alice`);

    console.log('\n🎉 Frontend API test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response?.status === 404) {
      console.error('❌ Server not running. Please start the backend server first.');
    }
  }
};

// Check if server is running first
const checkServer = async () => {
  try {
    await axios.get('http://localhost:3001/');
    console.log('✅ Server is running\n');
    testFrontendAPI();
  } catch (error) {
    console.error('❌ Server is not running. Please start the backend server first:');
    console.error('   cd backend && npm start');
  }
};

checkServer();