require("dotenv").config();
const mongoose = require("mongoose");
const Attendance = require("./models/attendance.model");
const Student = require("./models/details/student-details.model");
const Faculty = require("./models/details/faculty-details.model");
const Subject = require("./models/subject.model");
const Branch = require("./models/branch.model");

const seedAttendance = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    console.log("Connected to MongoDB");
    
    // Get student, faculty, subject, and branch
    const student = await Student.findOne({ email: "123456@gmail.com" });
    const faculty = await Faculty.findOne({ email: "faculty@gmail.com" });
    const subject = await Subject.findOne({ code: "SPCC" });
    const branch = await Branch.findOne({ branchId: "CSE" });
    
    if (!student || !faculty || !subject || !branch) {
      console.log("Missing required data. Make sure student, faculty, subject, and branch exist.");
      return;
    }
    
    // Create sample attendance records for the last 10 days
    const attendanceRecords = [];
    const statuses = ["present", "absent", "present", "present", "late", "present", "present", "absent", "present", "present"];
    
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      attendanceRecords.push({
        studentId: student._id,
        subjectId: subject._id,
        facultyId: faculty._id,
        date: date,
        status: statuses[i],
        semester: 6,
        branch: branch._id
      });
    }
    
    // Clear existing attendance and insert new records
    await Attendance.deleteMany({});
    await Attendance.insertMany(attendanceRecords);
    
    console.log("✅ Sample attendance data created successfully!");
    console.log(`Created ${attendanceRecords.length} attendance records`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedAttendance();