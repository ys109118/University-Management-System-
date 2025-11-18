require('dotenv').config();
const connectToMongo = require("./Database/db");
const StudentDetail = require("./models/details/student-details.model");
const Branch = require("./models/branch.model");

connectToMongo();

const createTestStudents = async () => {
  try {
    console.log("👥 Creating test students for hostel allocation...\n");

    // Get or create a branch
    let branch = await Branch.findOne();
    if (!branch) {
      branch = await Branch.create({
        name: "Computer Science",
        code: "CS"
      });
    }

    const testStudents = [
      {
        enrollmentNo: 2021002,
        firstName: "Bob",
        middleName: "Michael",
        lastName: "Smith",
        email: "bob@gmail.com",
        gender: "male",
        password: "bob123"
      },
      {
        enrollmentNo: 2021003, 
        firstName: "Carol",
        middleName: "Anne",
        lastName: "Johnson",
        email: "carol@gmail.com",
        gender: "female",
        password: "carol123"
      },
      {
        enrollmentNo: 2021004,
        firstName: "David",
        middleName: "James",
        lastName: "Brown",
        email: "david@gmail.com", 
        gender: "male",
        password: "david123"
      },
      {
        enrollmentNo: 2021005,
        firstName: "Emma",
        middleName: "Rose",
        lastName: "Davis",
        email: "emma@gmail.com",
        gender: "female", 
        password: "emma123"
      }
    ];

    const createdStudents = [];

    for (const studentData of testStudents) {
      // Check if student already exists
      const existing = await StudentDetail.findOne({ 
        $or: [
          { email: studentData.email },
          { enrollmentNo: studentData.enrollmentNo }
        ]
      });

      if (existing) {
        console.log(`⚠️  ${studentData.firstName} already exists`);
        continue;
      }

      const fullStudentData = {
        ...studentData,

        phone: "9876543210",
        address: "123 Student Street",
        city: "College City", 
        state: "State",
        pincode: "123456",
        country: "India",
        dob: new Date("2003-01-01"),
        branchId: branch._id,
        semester: 3,
        year: 2,
        section: "A",
        admissionDate: new Date("2024-07-01"),
        status: "active",
        fatherName: "Father Name",
        motherName: "Mother Name",
        fatherPhone: "9876543211",
        motherPhone: "9876543212",
        emergencyContact: {
          name: "Father Name",
          phone: "9876543211", 
          relation: "Father"
        }
      };

      const student = await StudentDetail.create(fullStudentData);
      createdStudents.push(student);
      console.log(`✅ Created ${student.firstName} ${student.lastName} (${student.enrollmentNo})`);
    }

    console.log(`\n🎉 Created ${createdStudents.length} new test students!`);
    console.log("\n🔑 Login Credentials:");
    testStudents.forEach(student => {
      console.log(`   - ${student.firstName}: ${student.enrollmentNo} / ${student.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createTestStudents();