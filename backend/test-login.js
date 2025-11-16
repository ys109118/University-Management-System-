require('dotenv').config();
const connectToMongo = require("./Database/db");
const studentDetails = require("./models/details/student-details.model");
const bcrypt = require("bcryptjs");

const testLogin = async () => {
  try {
    await connectToMongo();
    
    // Find the student
    const student = await studentDetails.findOne({ email: "alice@gmail.com" });
    console.log("Student found:", student ? "Yes" : "No");
    
    if (student) {
      console.log("Email:", student.email);
      console.log("Enrollment:", student.enrollmentNo);
      
      // Test password
      const isValid = await bcrypt.compare("student123", student.password);
      console.log("Password valid:", isValid);
      
      if (!isValid) {
        // Update password manually
        console.log("Updating password...");
        const hashedPassword = await bcrypt.hash("student123", 10);
        await studentDetails.findByIdAndUpdate(student._id, { password: hashedPassword });
        console.log("Password updated!");
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

testLogin();