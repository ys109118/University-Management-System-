require('dotenv').config();
const connectToMongo = require("./Database/db");
const StudentDetail = require("./models/details/student-details.model");

connectToMongo();

const checkAliceLogin = async () => {
  try {
    console.log("🔍 Checking Alice's login credentials...\n");

    // Find Alice student
    const alice = await StudentDetail.findOne({ email: "alice@gmail.com" });
    if (!alice) {
      console.log("❌ Alice student not found");
      process.exit(1);
    }

    console.log("👩 Alice Student Details:");
    console.log(`   - ID: ${alice._id}`);
    console.log(`   - Name: ${alice.firstName} ${alice.lastName}`);
    console.log(`   - Email: ${alice.email}`);
    console.log(`   - Enrollment: ${alice.enrollmentNo}`);
    console.log(`   - Password: ${alice.password}`);
    console.log(`   - Status: ${alice.status}`);

    console.log("\n🔑 Login Credentials to use:");
    console.log(`   - Enrollment No: ${alice.enrollmentNo}`);
    console.log(`   - Password: ${alice.password}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkAliceLogin();