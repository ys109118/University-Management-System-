require('dotenv').config();
const axios = require('axios');

const baseURL = 'http://localhost:3001/api';

// Test credentials
const adminCredentials = {
  employeeId: 123456,
  password: 'admin123'
};

const studentCredentials = {
  enrollmentNo: '2021001',
  password: 'alice123'
};

let adminToken = '';
let studentToken = '';

const testHostelAPI = async () => {
  try {
    console.log('🧪 Testing Hostel API endpoints...\n');

    // 1. Admin Login
    console.log('1️⃣ Testing Admin Login...');
    const adminLoginResponse = await axios.post(`${baseURL}/admin/login`, adminCredentials);
    if (adminLoginResponse.data.success) {
      adminToken = adminLoginResponse.data.data.token;
      console.log('✅ Admin login successful');
    } else {
      throw new Error('Admin login failed');
    }

    // 2. Student Login
    console.log('\n2️⃣ Testing Student Login...');
    const studentLoginResponse = await axios.post(`${baseURL}/student/login`, studentCredentials);
    if (studentLoginResponse.data.success) {
      studentToken = studentLoginResponse.data.data.token;
      console.log('✅ Student login successful');
    } else {
      throw new Error('Student login failed');
    }

    // 3. Test Admin - Get Hostels
    console.log('\n3️⃣ Testing Admin - Get Hostels...');
    const hostelsResponse = await axios.get(`${baseURL}/hostel/hostels`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Found ${hostelsResponse.data.data.length} hostels`);
    hostelsResponse.data.data.forEach(hostel => {
      console.log(`   - ${hostel.name} (${hostel.type})`);
    });

    // 4. Test Admin - Get Rooms
    console.log('\n4️⃣ Testing Admin - Get Rooms...');
    const roomsResponse = await axios.get(`${baseURL}/hostel/rooms`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Found ${roomsResponse.data.data.length} rooms`);

    // 5. Test Admin - Get Allocations
    console.log('\n5️⃣ Testing Admin - Get Allocations...');
    const allocationsResponse = await axios.get(`${baseURL}/hostel/allocations`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Found ${allocationsResponse.data.data.length} allocations`);
    allocationsResponse.data.data.forEach(allocation => {
      console.log(`   - ${allocation.studentId?.firstName} ${allocation.studentId?.lastName} -> ${allocation.hostelId?.name}, Room ${allocation.roomId?.roomNumber}`);
    });

    // 6. Test Student - Get Allocations (should see only their own)
    console.log('\n6️⃣ Testing Student - Get Own Allocation...');
    const studentAllocationsResponse = await axios.get(`${baseURL}/hostel/allocations`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log(`✅ Student can see ${studentAllocationsResponse.data.data.length} total allocations`);

    // 7. Test Student - Submit Complaint
    console.log('\n7️⃣ Testing Student - Submit Complaint...');
    const studentAllocation = allocationsResponse.data.data.find(alloc => 
      alloc.studentId?.email === 'alice@gmail.com'
    );
    
    if (studentAllocation) {
      const complaintData = {
        title: 'Test Complaint - WiFi Issue',
        description: 'The WiFi connection in my room is very slow and keeps disconnecting.',
        category: 'electricity',
        priority: 'medium',
        studentId: studentAllocation.studentId._id,
        hostelId: studentAllocation.hostelId._id,
        roomId: studentAllocation.roomId._id
      };

      const complaintResponse = await axios.post(`${baseURL}/hostel/complaints`, complaintData, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.log('✅ Complaint submitted successfully');
      console.log(`   - Complaint ID: ${complaintResponse.data.data._id}`);
    } else {
      console.log('⚠️  No allocation found for Alice, skipping complaint test');
    }

    // 8. Test Admin - Get Complaints
    console.log('\n8️⃣ Testing Admin - Get Complaints...');
    const complaintsResponse = await axios.get(`${baseURL}/hostel/complaints`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Found ${complaintsResponse.data.data.length} complaints`);
    complaintsResponse.data.data.forEach(complaint => {
      console.log(`   - ${complaint.title} (${complaint.status}) by ${complaint.studentId?.firstName}`);
    });

    console.log('\n🎉 All hostel API tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log(`   ✅ Admin login: Working`);
    console.log(`   ✅ Student login: Working`);
    console.log(`   ✅ Hostels API: Working (${hostelsResponse.data.data.length} hostels)`);
    console.log(`   ✅ Rooms API: Working (${roomsResponse.data.data.length} rooms)`);
    console.log(`   ✅ Allocations API: Working (${allocationsResponse.data.data.length} allocations)`);
    console.log(`   ✅ Complaints API: Working (${complaintsResponse.data.data.length} complaints)`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
};

testHostelAPI();