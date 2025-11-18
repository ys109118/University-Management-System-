require('dotenv').config();
const connectToMongo = require("./Database/db");
const Hostel = require("./models/hostel.model");
const Room = require("./models/room.model");
const HostelAllocation = require("./models/hostel-allocation.model");
const StudentDetail = require("./models/details/student-details.model");

connectToMongo();

const seedHostelData = async () => {
  try {
    console.log("🏠 Starting hostel data seeding...");

    // Clear existing data
    await Hostel.deleteMany({});
    await Room.deleteMany({});
    await HostelAllocation.deleteMany({});
    console.log("✅ Cleared existing hostel data");

    // Create hostels
    const hostels = [
      {
        name: "Sunrise Boys Hostel",
        type: "boys",
        totalRooms: 50,
        totalCapacity: 200,
        warden: {
          name: "Mr. Rajesh Kumar",
          phone: "9876543210",
          email: "rajesh.warden@college.edu"
        },
        facilities: ["WiFi", "Mess", "Laundry", "Recreation Room", "Study Hall"],
        address: "Block A, College Campus, Main Road, City - 123456"
      },
      {
        name: "Sunset Girls Hostel",
        type: "girls",
        totalRooms: 40,
        totalCapacity: 160,
        warden: {
          name: "Mrs. Priya Sharma",
          phone: "9876543211",
          email: "priya.warden@college.edu"
        },
        facilities: ["WiFi", "Mess", "Laundry", "Recreation Room", "Study Hall", "Security"],
        address: "Block B, College Campus, Main Road, City - 123456"
      }
    ];

    const createdHostels = await Hostel.insertMany(hostels);
    console.log(`✅ Created ${createdHostels.length} hostels`);

    // Create rooms for each hostel
    const rooms = [];
    
    // Boys hostel rooms (50 rooms, 4 floors)
    const boysHostel = createdHostels[0];
    for (let floor = 1; floor <= 4; floor++) {
      for (let roomNum = 1; roomNum <= 12; roomNum++) {
        if (rooms.length >= 50) break;
        
        const roomNumber = `${floor}${roomNum.toString().padStart(2, '0')}`;
        const capacity = roomNum <= 8 ? 4 : roomNum <= 10 ? 2 : 1; // Mix of room types
        const roomType = capacity === 1 ? 'single' : capacity === 2 ? 'double' : capacity === 3 ? 'triple' : 'quad';
        const rent = capacity === 1 ? 8000 : capacity === 2 ? 6000 : capacity === 3 ? 4500 : 4000;
        
        rooms.push({
          roomNumber,
          hostelId: boysHostel._id,
          floor,
          capacity,
          roomType,
          facilities: ["Bed", "Study Table", "Wardrobe", "Fan"],
          rent,
          status: "available"
        });
      }
      if (rooms.length >= 50) break;
    }

    // Girls hostel rooms (40 rooms, 4 floors)
    const girlsHostel = createdHostels[1];
    for (let floor = 1; floor <= 4; floor++) {
      for (let roomNum = 1; roomNum <= 10; roomNum++) {
        if (rooms.length >= 90) break; // 50 boys + 40 girls = 90 total
        
        const roomNumber = `G${floor}${roomNum.toString().padStart(2, '0')}`;
        const capacity = roomNum <= 6 ? 4 : roomNum <= 8 ? 2 : 1;
        const roomType = capacity === 1 ? 'single' : capacity === 2 ? 'double' : capacity === 3 ? 'triple' : 'quad';
        const rent = capacity === 1 ? 8000 : capacity === 2 ? 6000 : capacity === 3 ? 4500 : 4000;
        
        rooms.push({
          roomNumber,
          hostelId: girlsHostel._id,
          floor,
          capacity,
          roomType,
          facilities: ["Bed", "Study Table", "Wardrobe", "Fan", "Mirror"],
          rent,
          status: "available"
        });
      }
      if (rooms.length >= 90) break;
    }

    const createdRooms = await Room.insertMany(rooms);
    console.log(`✅ Created ${createdRooms.length} rooms`);

    // Find Alice student for allocation
    const alice = await StudentDetail.findOne({ email: "alice@gmail.com" });
    
    if (alice) {
      // Allocate Alice to a room
      const availableRoom = createdRooms.find(room => 
        room.hostelId.toString() === girlsHostel._id.toString() && 
        room.capacity > 1
      );

      if (availableRoom) {
        const allocation = {
          studentId: alice._id,
          hostelId: girlsHostel._id,
          roomId: availableRoom._id,
          bedNumber: 1,
          allocationDate: new Date(),
          academicYear: "2024-25",
          status: "allocated",
          rent: availableRoom.rent,
          securityDeposit: 5000,
          remarks: "Initial allocation for academic year 2024-25"
        };

        await HostelAllocation.create(allocation);
        
        // Update room occupied beds
        await Room.findByIdAndUpdate(availableRoom._id, { 
          $inc: { occupiedBeds: 1 },
          status: availableRoom.capacity === 1 ? "occupied" : "available"
        });

        // Update hostel statistics
        await Hostel.findByIdAndUpdate(girlsHostel._id, {
          $inc: { occupiedCapacity: 1 }
        });

        console.log(`✅ Allocated Alice to ${girlsHostel.name}, Room ${availableRoom.roomNumber}, Bed 1`);
      }
    } else {
      console.log("⚠️  Alice student not found. Please run student seeder first.");
    }

    console.log("🎉 Hostel data seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Hostels: ${createdHostels.length}`);
    console.log(`- Rooms: ${createdRooms.length}`);
    console.log(`- Allocations: ${alice ? 1 : 0}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding hostel data:", error);
    process.exit(1);
  }
};

seedHostelData();