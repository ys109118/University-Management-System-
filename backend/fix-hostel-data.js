require('dotenv').config();
const connectToMongo = require("./Database/db");
const Hostel = require("./models/hostel.model");
const Room = require("./models/room.model");
const HostelAllocation = require("./models/hostel-allocation.model");
const StudentDetail = require("./models/details/student-details.model");

connectToMongo();

const fixHostelData = async () => {
  try {
    console.log("🔧 Fixing hostel data...\n");

    // Get Alice
    const alice = await StudentDetail.findOne({ email: "alice@gmail.com" });
    if (!alice) {
      console.log("❌ Alice not found");
      process.exit(1);
    }

    // Clear existing allocations for Alice
    await HostelAllocation.deleteMany({ 
      $or: [
        { studentId: alice._id },
        { studentId: { $exists: false } },
        { studentId: null }
      ]
    });

    // Get girls hostel and available room
    const girlsHostel = await Hostel.findOne({ type: "girls" });
    const availableRoom = await Room.findOne({ 
      hostelId: girlsHostel._id,
      roomNumber: "G101"
    });

    // Create proper allocation for Alice
    const allocation = await HostelAllocation.create({
      studentId: alice._id,
      hostelId: girlsHostel._id,
      roomId: availableRoom._id,
      bedNumber: 1,
      allocationDate: new Date(),
      academicYear: "2024-25",
      status: "allocated",
      rent: availableRoom.rent,
      securityDeposit: 5000
    });

    // Update room occupancy
    await Room.findByIdAndUpdate(availableRoom._id, {
      $set: { occupiedBeds: 1 }
    });

    console.log("✅ Alice's allocation fixed:");
    console.log(`   - Hostel: ${girlsHostel.name}`);
    console.log(`   - Room: ${availableRoom.roomNumber}`);
    console.log(`   - Bed: 1`);
    console.log(`   - Rent: ₹${availableRoom.rent}`);

    // Verify the fix
    const verifyAllocation = await HostelAllocation.findById(allocation._id)
      .populate('studentId', 'firstName lastName email')
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber');

    console.log("\n✅ Verification:");
    console.log(`   - Student: ${verifyAllocation.studentId.firstName} ${verifyAllocation.studentId.lastName}`);
    console.log(`   - Email: ${verifyAllocation.studentId.email}`);
    console.log(`   - Hostel: ${verifyAllocation.hostelId.name}`);
    console.log(`   - Room: ${verifyAllocation.roomId.roomNumber}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixHostelData();