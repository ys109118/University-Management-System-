const Attendance = require("../models/attendance.model");
const ApiResponse = require("../utils/ApiResponse");

// Mark attendance for students
const markAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body; // Array of {studentId, status}
    const { subjectId, date, semester, branch } = req.body;
    const facultyId = req.userId;

    const attendanceRecords = attendanceData.map(record => ({
      studentId: record.studentId,
      subjectId,
      facultyId,
      date: new Date(date),
      status: record.status,
      semester,
      branch
    }));

    await Attendance.insertMany(attendanceRecords);
    return ApiResponse.success(null, "Attendance marked successfully").send(res);
  } catch (error) {
    console.error("Mark Attendance Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Get attendance for a student
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.userId;
    const { subjectId } = req.query;

    console.log("Student ID from token:", studentId);

    const query = { studentId };
    if (subjectId) query.subjectId = subjectId;

    const attendance = await Attendance.find(query)
      .populate("subjectId", "name code")
      .sort({ date: -1 });

    console.log("Found attendance records:", attendance.length);

    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(a => a.status === "present").length;
    const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(2) : 0;

    return ApiResponse.success({
      attendance,
      summary: {
        totalClasses,
        presentClasses,
        absentClasses: totalClasses - presentClasses,
        percentage
      }
    }, "Attendance fetched successfully").send(res);
  } catch (error) {
    console.error("Get Student Attendance Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Get attendance by subject for faculty
const getAttendanceBySubject = async (req, res) => {
  try {
    const { subjectId, date } = req.query;
    
    const attendance = await Attendance.find({
      subjectId,
      date: new Date(date)
    }).populate("studentId", "firstName lastName enrollmentNo");

    return ApiResponse.success(attendance, "Attendance fetched successfully").send(res);
  } catch (error) {
    console.error("Get Attendance Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

module.exports = {
  markAttendance,
  getStudentAttendance,
  getAttendanceBySubject
};