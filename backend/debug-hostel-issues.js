require('dotenv').config();
const connectToMongo = require("./Database/db");
const Hostel = require("./models/hostel.model");
const Room = require("./models/room.model");
const HostelAllocation = require("./models/hostel-allocation.model");
const StudentDetail = require("./models/details/student-details.model");

connectToMongo();

const debugHostelIssues = async () => {
  try {
    console.log("🔍 Debugging hostel issues...\n");

    // Check hostels
    const hostels = await Hostel.find();
    console.log(`📊 Hostels: ${hostels.length}`);
    hostels.forEach(h => console.log(`   - ${h.name} (${h.type})`));

    // Check rooms
    const rooms = await Room.find().populate('hostelId');
    console.log(`\n📊 Rooms: ${rooms.length}`);
    rooms.slice(0, 3).forEach(r => console.log(`   - Room ${r.roomNumber} in ${r.hostelId?.name}`));

    // Check allocations
    const allocations = await HostelAllocation.find()
      .populate('studentId', 'firstName lastName email')
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber');
    console.log(`\n📊 Allocations: ${allocations.length}`);
    allocations.forEach(a => console.log(`   - ${a.studentId?.firstName} -> ${a.hostelId?.name}, Room ${a.roomId?.roomNumber}`));

    // Check Alice specifically
    const alice = await StudentDetail.findOne({ email: "alice@gmail.com" });
    if (alice) {
      console.log(`\n👩 Alice ID: ${alice._id}`);
      const aliceAllocation = allocations.find(a => 
        a.studentId?._id?.toString() === alice._id.toString()
      );
      console.log(`   - Alice allocation: ${aliceAllocation ? 'Found' : 'Not found'}`);
    }

    // Check students
    const students = await StudentDetail.find().select('firstName lastName email');
    console.log(`\n📊 Students: ${students.length}`);
    students.slice(0, 5).forEach(s => console.log(`   - ${s.firstName} ${s.lastName} (${s.email})`));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

debugHostelIssues();