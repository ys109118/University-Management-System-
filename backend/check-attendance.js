require("dotenv").config();
const mongoose = require("mongoose");
const Attendance = require("./models/attendance.model");
const Student = require("./models/details/student-details.model");
const Subject = require("./models/subject.model");

const addAttendanceForStudent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    console.log("Connected to MongoDB");
    
    const student = await Student.findOne({ enrollmentNo: 123456 });
    const subject = await Subject.findOne({ code: "SPCC" });
    const Faculty = require("./models/details/faculty-details.model");
    const Branch = require("./models/branch.model");
    const faculty = await Faculty.findOne({ email: "faculty@gmail.com" });
    const branch = await Branch.findOne({ branchId: "CSE" });
    
    if (!student || !subject || !faculty || !branch) {
      console.log("Missing data:");
      console.log("Student:", !!student);
      console.log("Subject:", !!subject);
      console.log("Faculty:", !!faculty);
      console.log("Branch:", !!branch);
      return;
    }
    
    // Clear existing attendance
    await Attendance.deleteMany({ studentId: student._id });
    
    // Create new attendance records
    const attendanceRecords = [];
    const statuses = ["present", "present", "absent", "present", "late", "present", "present", "absent", "present", "present"];
    
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
    
    await Attendance.insertMany(attendanceRecords);
    
    console.log("✅ Attendance added for student 123456");
    console.log(`Student ID: ${student._id}`);
    console.log(`Created ${attendanceRecords.length} records`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

addAttendanceForStudent();