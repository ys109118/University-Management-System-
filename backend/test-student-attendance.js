require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/details/student-details.model");
const Attendance = require("./models/attendance.model");
const Subject = require("./models/subject.model");
const jwt = require("jsonwebtoken");

const testStudentAttendance = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    console.log("Connected to MongoDB");
    
    // Find student
    const student = await Student.findOne({ email: "123456@gmail.com" });
    console.log("Student found:", !!student);
    console.log("Student ID:", student?._id);
    
    // Generate token like login does
    const token = jwt.sign({ userId: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Generated token:", token.substring(0, 20) + "...");
    
    // Find attendance records
    const attendance = await Attendance.find({ studentId: student._id })
      .populate("subjectId", "name code")
      .sort({ date: -1 });
    
    console.log("Attendance records found:", attendance.length);
    
    if (attendance.length > 0) {
      const totalClasses = attendance.length;
      const presentClasses = attendance.filter(a => a.status === "present").length;
      const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(2) : 0;
      
      console.log("Summary:");
      console.log("- Total Classes:", totalClasses);
      console.log("- Present:", presentClasses);
      console.log("- Percentage:", percentage + "%");
    }
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

testStudentAttendance();