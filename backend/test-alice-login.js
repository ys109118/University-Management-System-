require('dotenv').config();
const connectToMongo = require("./Database/db");
const StudentDetail = require("./models/details/student-details.model");
const bcrypt = require("bcryptjs");

connectToMongo();

const testAliceLogin = async () => {
  try {
    console.log("🔍 Testing Alice login...\n");

    const alice = await StudentDetail.findOne({ email: "alice@gmail.com" });
    if (!alice) {
      console.log("❌ Alice not found");
      process.exit(1);
    }

    console.log("👩 Alice found:");
    console.log(`   - Email: ${alice.email}`);
    console.log(`   - Enrollment: ${alice.enrollmentNo}`);
    console.log(`   - Password Hash: ${alice.password}`);

    // Test password comparison
    const testPasswords = ["student123", "alice123", "123456"];
    
    for (const pwd of testPasswords) {
      const isValid = await bcrypt.compare(pwd, alice.password);
      console.log(`   - Password "${pwd}": ${isValid ? '✅ VALID' : '❌ Invalid'}`);
    }

    // Delete and recreate Alice with correct password
    console.log("\n🔧 Recreating Alice with correct password...");
    
    await StudentDetail.deleteOne({ email: "alice@gmail.com" });
    
    const newAlice = await StudentDetail.create({
      enrollmentNo: 2021001,
      firstName: "Alice",
      middleName: "Marie",
      lastName: "Johnson", 
      email: "alice@gmail.com",
      phone: "9876543210",
      semester: 3,
      branchId: alice.branchId,
      gender: "female",
      dob: new Date("2003-05-15"),
      address: "123 Student Street",
      city: "College City",
      state: "State", 
      pincode: "123456",
      country: "India",
      status: "active",
      password: "student123"
    });

    console.log("✅ Alice recreated successfully!");
    console.log("🔑 Login credentials:");
    console.log("   - Email: alice@gmail.com");
    console.log("   - Password: student123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

testAliceLogin();