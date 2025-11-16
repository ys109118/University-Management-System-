const studentDetails = require("./models/details/student-details.model");
const Branch = require("./models/branch.model");
const connectToMongo = require("./database/db");
const mongoose = require("mongoose");

const seedData = async () => {
  try {
    await connectToMongo();

    // Get or create branch
    let branch = await Branch.findOne({ branchId: "CSE" });
    if (!branch) {
      branch = await Branch.create({
        branchId: "CSE",
        name: "Computer Science Engineering"
      });
    }

    const password = "student123";
    const enrollmentNo = 123456;

    const studentDetail = {
      enrollmentNo: enrollmentNo,
      firstName: "Jane",
      middleName: "M",
      lastName: "Smith",
      email: `${enrollmentNo}@gmail.com`,
      phone: "8765432109",
      profile: "Faculty_Profile_123456.jpg",
      address: "789 Student Street",
      city: "Student City",
      state: "State",
      pincode: "789012",
      country: "India",
      gender: "female",
      dob: new Date("2000-08-20"),
      joiningDate: new Date(),
      semester: 1,
      branchId: branch._id,
      status: "active",
      emergencyContact: {
        name: "John Smith",
        relationship: "Father",
        phone: "9876543210",
      },
      bloodGroup: "B+",
      password: password,
    };

    await studentDetails.create(studentDetail);

    console.log("\n=== Student Credentials ===");
    console.log("Enrollment No:", enrollmentNo);
    console.log("Password:", password);
    console.log("Email:", studentDetail.email);
    console.log("=======================\n");
    console.log("Student seeding completed successfully!");
  } catch (error) {
    console.error("Error while seeding student:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedData();