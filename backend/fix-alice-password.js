require('dotenv').config();
const connectToMongo = require("./Database/db");
const StudentDetail = require("./models/details/student-details.model");

connectToMongo();

const fixAlicePassword = async () => {
  try {
    console.log("🔧 Fixing Alice's password with proper hashing...\n");

    const alice = await StudentDetail.findOne({ email: "alice@gmail.com" });
    if (!alice) {
      console.log("❌ Alice not found");
      process.exit(1);
    }

    alice.password = "student123";
    await alice.save();

    console.log("✅ Alice's password fixed successfully!");
    console.log("🔑 Login credentials:");
    console.log("   - Enrollment No: 2021001");
    console.log("   - Password: student123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixAlicePassword();