require('dotenv').config();
const connectToMongo = require("./Database/db");
const StudentDetail = require("./models/details/student-details.model");

connectToMongo();

const updateAlicePassword = async () => {
  try {
    console.log("🔧 Updating Alice's password...\n");

    const result = await StudentDetail.updateOne(
      { email: "alice@gmail.com" },
      { password: "student123" }
    );

    if (result.modifiedCount > 0) {
      console.log("✅ Alice's password updated successfully!");
      console.log("🔑 New login credentials:");
      console.log("   - Enrollment No: 2021001");
      console.log("   - Password: student123");
    } else {
      console.log("❌ Failed to update password or Alice not found");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

updateAlicePassword();