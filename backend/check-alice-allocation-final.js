require('dotenv').config();
const connectToMongo = require("./Database/db");
const Hostel = require("./models/hostel.model");
const Room = require("./models/room.model");
const HostelAllocation = require("./models/hostel-allocation.model");
const StudentDetail = require("./models/details/student-details.model");
const Branch = require("./models/branch.model");

connectToMongo();

const checkAliceAllocationFinal = async () => {
  try {
    console.log("🔍 Final check of Alice's allocation...\n");

    // 1. Find Alice
    const alice = await StudentDetail.findOne({ email: "alice@gmail.com" });
    console.log("👩 Alice:");
    console.log(`   - ID: ${alice._id}`);
    console.log(`   - Name: ${alice.firstName} ${alice.lastName}`);
    console.log(`   - Email: ${alice.email}`);

    // 2. Find Alice's allocation
    const allocation = await HostelAllocation.findOne({ studentId: alice._id })
      .populate("studentId", "firstName lastName email")
      .populate("hostelId", "name type")
      .populate("roomId", "roomNumber floor");

    if (allocation) {
      console.log("\n🏠 Alice's Allocation:");
      console.log(`   - Allocation ID: ${allocation._id}`);
      console.log(`   - Student ID in allocation: ${allocation.studentId._id}`);
      console.log(`   - Student name: ${allocation.studentId.firstName} ${allocation.studentId.lastName}`);
      console.log(`   - Hostel: ${allocation.hostelId.name}`);
      console.log(`   - Room: ${allocation.roomId.roomNumber}`);
      console.log(`   - Bed: ${allocation.bedNumber}`);
      console.log(`   - Status: ${allocation.status}`);
      
      // Check if IDs match
      console.log("\n🔍 ID Comparison:");
      console.log(`   - Alice._id: ${alice._id}`);
      console.log(`   - allocation.studentId._id: ${allocation.studentId._id}`);
      console.log(`   - Match: ${alice._id.toString() === allocation.studentId._id.toString()}`);
    } else {
      console.log("\n❌ No allocation found for Alice");
    }

    // 3. Check all allocations
    const allAllocations = await HostelAllocation.find()
      .populate("studentId", "firstName lastName email");
    
    console.log(`\n📊 All allocations (${allAllocations.length}):`);
    allAllocations.forEach((alloc, index) => {
      console.log(`   ${index + 1}. ${alloc.studentId?.firstName || 'Unknown'} ${alloc.studentId?.lastName || ''} (${alloc.studentId?._id || 'No ID'})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkAliceAllocationFinal();