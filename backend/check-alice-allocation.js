require('dotenv').config();
const connectToMongo = require("./Database/db");
const HostelAllocation = require("./models/hostel-allocation.model");
const StudentDetail = require("./models/details/student-details.model");
const Hostel = require("./models/hostel.model");
const Room = require("./models/room.model");

connectToMongo();

const checkAliceAllocation = async () => {
  try {
    console.log("🔍 Checking Alice's allocation...\n");

    // Find Alice student
    const alice = await StudentDetail.findOne({ email: "alice@gmail.com" });
    if (!alice) {
      console.log("❌ Alice student not found");
      process.exit(1);
    }

    console.log("👩 Alice Student Found:");
    console.log(`   - ID: ${alice._id}`);
    console.log(`   - Name: ${alice.firstName} ${alice.lastName}`);
    console.log(`   - Email: ${alice.email}`);
    console.log(`   - Enrollment: ${alice.enrollmentNo}\n`);

    // Find Alice's allocation
    const allocation = await HostelAllocation.findOne({ studentId: alice._id })
      .populate("studentId", "firstName lastName email enrollmentNo")
      .populate("hostelId", "name type")
      .populate("roomId", "roomNumber floor");

    if (allocation) {
      console.log("🏠 Alice's Allocation Found:");
      console.log(`   - Hostel: ${allocation.hostelId.name} (${allocation.hostelId.type})`);
      console.log(`   - Room: ${allocation.roomId.roomNumber} (Floor ${allocation.roomId.floor})`);
      console.log(`   - Bed: ${allocation.bedNumber}`);
      console.log(`   - Status: ${allocation.status}`);
      console.log(`   - Academic Year: ${allocation.academicYear}`);
      console.log(`   - Rent: ₹${allocation.rent}`);
      console.log(`   - Allocated Date: ${allocation.allocationDate.toLocaleDateString()}`);
    } else {
      console.log("❌ No allocation found for Alice");
      
      // Check all allocations to see what's there
      const allAllocations = await HostelAllocation.find()
        .populate("studentId", "firstName lastName email")
        .populate("hostelId", "name")
        .populate("roomId", "roomNumber");
      
      console.log(`\n📋 All Allocations (${allAllocations.length}):`);
      allAllocations.forEach((alloc, index) => {
        console.log(`   ${index + 1}. ${alloc.studentId?.firstName} ${alloc.studentId?.lastName} (${alloc.studentId?.email})`);
        console.log(`      -> ${alloc.hostelId?.name}, Room ${alloc.roomId?.roomNumber}, Bed ${alloc.bedNumber}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkAliceAllocation();