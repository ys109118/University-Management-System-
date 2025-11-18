require('dotenv').config();
const connectToMongo = require("./Database/db");
const StudentDetail = require("./models/details/student-details.model");
const Branch = require("./models/branch.model");

connectToMongo();

const createAliceStudent = async () => {
  try {
    console.log("👩‍🎓 Creating Alice student...");

    // Check if Alice already exists
    const existingAlice = await StudentDetail.findOne({ email: "alice@gmail.com" });
    if (existingAlice) {
      console.log("✅ Alice student already exists");
      console.log(`- Name: ${existingAlice.firstName} ${existingAlice.lastName}`);
      console.log(`- Email: ${existingAlice.email}`);
      console.log(`- Enrollment: ${existingAlice.enrollmentNo}`);
      process.exit(0);
    }

    // Get a branch (create one if doesn't exist)
    let branch = await Branch.findOne();
    if (!branch) {
      branch = await Branch.create({
        name: "Computer Science",
        code: "CS"
      });
      console.log("✅ Created Computer Science branch");
    }

    // Create Alice student
    const aliceData = {
      enrollmentNo: "2024CS001",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@gmail.com",
      phone: "9876543210",
      address: "123 Student Street",
      city: "College City",
      state: "State",
      pincode: "123456",
      country: "India",
      gender: "female",
      dob: new Date("2003-05-15"),
      branch: branch._id,
      semester: 3,
      year: 2,
      section: "A",
      admissionDate: new Date("2024-07-01"),
      status: "active",
      password: "alice123",
      fatherName: "Robert Johnson",
      motherName: "Mary Johnson",
      fatherPhone: "9876543211",
      motherPhone: "9876543212",
      emergencyContact: {
        name: "Robert Johnson",
        phone: "9876543211",
        relation: "Father"
      }
    };

    const alice = await StudentDetail.create(aliceData);
    console.log("✅ Alice student created successfully!");
    console.log(`- Name: ${alice.firstName} ${alice.lastName}`);
    console.log(`- Email: ${alice.email}`);
    console.log(`- Enrollment: ${alice.enrollmentNo}`);
    console.log(`- Password: alice123`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating Alice student:", error);
    process.exit(1);
  }
};

createAliceStudent();