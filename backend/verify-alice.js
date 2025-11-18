require('dotenv').config();
const connectToMongo = require("./Database/db");
const StudentDetail = require("./models/details/student-details.model");
const bcrypt = require("bcryptjs");

connectToMongo();

const verifyAlice = async () => {
  try {
    console.log("🔍 Verifying Alice's current data...\n");

    const alice = await StudentDetail.findOne({ email: "alice@gmail.com" });
    if (!alice) {
      console.log("❌ Alice not found");
      process.exit(1);
    }

    console.log("👩 Alice's current data:");
    console.log(`   - Email: ${alice.email}`);
    console.log(`   - Enrollment: ${alice.enrollmentNo}`);
    console.log(`   - Name: ${alice.firstName} ${alice.lastName}`);
    console.log(`   - Password Hash: ${alice.password.substring(0, 20)}...`);

    // Test the password
    const isValid = await bcrypt.compare("student123", alice.password);
    console.log(`   - Password "student123": ${isValid ? '✅ VALID' : '❌ Invalid'}`);

    if (isValid) {
      console.log("\n✅ Alice's login should work with:");
      console.log("   - Email: alice@gmail.com");
      console.log("   - Password: student123");
    } else {
      console.log("\n❌ Password verification failed");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

verifyAlice();