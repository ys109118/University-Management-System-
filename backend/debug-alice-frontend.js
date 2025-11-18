require('dotenv').config();
const connectToMongo = require("./Database/db");
const Hostel = require("./models/hostel.model");
const Room = require("./models/room.model");
const HostelAllocation = require("./models/hostel-allocation.model");
const StudentDetail = require("./models/details/student-details.model");
const Branch = require("./models/branch.model");

connectToMongo();

const debugAliceFrontend = async () => {
  try {
    console.log("🔍 Debugging Alice's frontend issues...\n");

    // 1. Check Alice's login data
    const alice = await StudentDetail.findOne({ email: "alice@gmail.com" })
      .select("-password")
      .populate("branchId");
    
    console.log("👩 Alice's data (what frontend gets):");
    console.log(`   - ID: ${alice._id}`);
    console.log(`   - Name: ${alice.firstName} ${alice.lastName}`);
    console.log(`   - Email: ${alice.email}`);
    console.log(`   - Gender: ${alice.gender}`);
    console.log(`   - Branch: ${alice.branchId?.name || 'No branch'}`);

    // 2. Check Alice's allocation
    const allocation = await HostelAllocation.findOne({ studentId: alice._id })
      .populate("studentId", "firstName lastName email")
      .populate("hostelId", "name type")
      .populate("roomId", "roomNumber floor");

    console.log("\n🏠 Alice's allocation:");
    if (allocation) {
      console.log(`   - Student: ${allocation.studentId.firstName} ${allocation.studentId.lastName}`);
      console.log(`   - Hostel: ${allocation.hostelId.name} (${allocation.hostelId.type})`);
      console.log(`   - Room: ${allocation.roomId.roomNumber}`);
      console.log(`   - Status: ${allocation.status}`);
    } else {
      console.log("   - ❌ No allocation found");
    }

    // 3. Check hostels (what dropdown should show)
    const hostels = await Hostel.find();
    console.log("\n🏢 Available hostels:");
    hostels.forEach(h => {
      console.log(`   - ${h.name} (${h.type}) - ${h.status}`);
    });

    // 4. Check rooms for girls hostel
    const girlsHostel = hostels.find(h => h.type === 'girls');
    if (girlsHostel) {
      const rooms = await Room.find({ hostelId: girlsHostel._id });
      console.log(`\n🚪 Rooms in ${girlsHostel.name}: ${rooms.length}`);
      console.log(`   - Available rooms: ${rooms.filter(r => (r.occupiedBeds || 0) < r.capacity).length}`);
    }

    // 5. Test what API calls return
    console.log("\n🔧 API Response simulation:");
    
    // Simulate /hostel/allocations call
    const allAllocations = await HostelAllocation.find()
      .populate("studentId", "firstName lastName email")
      .populate("hostelId", "name type")
      .populate("roomId", "roomNumber floor");
    
    console.log(`   - Total allocations: ${allAllocations.length}`);
    const aliceAlloc = allAllocations.find(a => 
      a.studentId?._id?.toString() === alice._id.toString()
    );
    console.log(`   - Alice found in allocations: ${aliceAlloc ? 'YES' : 'NO'}`);

    // Simulate /hostel/hostels call
    console.log(`   - Hostels API would return: ${hostels.length} hostels`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

debugAliceFrontend();