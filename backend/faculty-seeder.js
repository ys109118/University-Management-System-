const facultyDetails = require("./models/details/faculty-details.model");
const Branch = require("./models/branch.model");
const connectToMongo = require("./database/db");
const mongoose = require("mongoose");

const seedData = async () => {
  try {
    await connectToMongo();

    // Create branch first
    let branch = await Branch.findOne({ branchId: "CSE" });
    if (!branch) {
      branch = await Branch.create({
        branchId: "CSE",
        name: "Computer Science Engineering"
      });
    }

    const password = "faculty123";
    const employeeId = 654321;

    const facultyDetail = {
      employeeId: employeeId,
      firstName: "John",
      middleName: "A",
      lastName: "Doe",
      email: "faculty@gmail.com",
      phone: "9876543210",
      profile: "Faculty_Profile_123456.jpg",
      address: "456 Faculty Street",
      city: "Faculty City",
      state: "State",
      pincode: "654321",
      country: "India",
      gender: "male",
      dob: new Date("1985-05-15"),
      designation: "Professor",
      joiningDate: new Date(),
      salary: 60000,
      status: "active",
      branchId: branch._id,
      emergencyContact: {
        name: "Jane Doe",
        relationship: "Spouse",
        phone: "1234567890",
      },
      bloodGroup: "A+",
      password: password,
    };

    await facultyDetails.create(facultyDetail);

    console.log("\n=== Faculty Credentials ===");
    console.log("Employee ID:", employeeId);
    console.log("Password:", password);
    console.log("Email:", facultyDetail.email);
    console.log("=======================\n");
    console.log("Faculty seeding completed successfully!");
  } catch (error) {
    console.error("Error while seeding faculty:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedData();