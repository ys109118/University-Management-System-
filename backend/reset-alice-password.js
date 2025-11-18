require('dotenv').config();
const connectToMongo = require("./Database/db");
const StudentDetail = require("./models/details/student-details.model");

connectToMongo();

const resetAlicePassword = async () => {
  try {
    console.log("🔧 Resetting Alice's password...\n");

    // Update Alice's password to a simple one
    const result = await StudentDetail.updateOne(
      { email: "alice@gmail.com" },
      { password: "alice123" }
    );

    if (result.modifiedCount > 0) {
      console.log("✅ Alice's password reset successfully!");
      console.log("🔑 New login credentials:");
      console.log("   - Enrollment No: 2021001");
      console.log("   - Password: alice123");
    } else {
      console.log("❌ Failed to reset password or Alice not found");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

resetAlicePassword();