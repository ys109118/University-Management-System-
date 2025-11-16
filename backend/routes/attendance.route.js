const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getStudentAttendance,
  getAttendanceBySubject
} = require("../controllers/attendance.controller");
const auth = require("../middlewares/auth.middleware");

// Faculty routes
router.post("/mark", auth, markAttendance);
router.get("/subject", auth, getAttendanceBySubject);

// Student routes
router.get("/student", auth, getStudentAttendance);

module.exports = router;