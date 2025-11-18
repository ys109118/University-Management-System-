const express = require("express");
const {
  getAllHostels,
  createHostel,
  updateHostel,
  deleteHostel,
  getAllRooms,
  getRoomsByHostel,
  createRoom,
  getAllocations,
  allocateRoom,
  getComplaints,
  createComplaint,
  updateComplaintStatus,
} = require("../controllers/hostel.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

// Hostel routes
router.get("/hostels", auth, getAllHostels);
router.post("/hostels", auth, createHostel);
router.put("/hostels/:id", auth, updateHostel);
router.delete("/hostels/:id", auth, deleteHostel);

// Room routes
router.get("/rooms", auth, getAllRooms);
router.get("/hostels/:hostelId/rooms", auth, getRoomsByHostel);
router.post("/rooms", auth, createRoom);

// Allocation routes
router.get("/allocations", auth, getAllocations);
router.post("/allocations", auth, allocateRoom);

// Complaint routes
router.get("/complaints", auth, getComplaints);
router.post("/complaints", auth, createComplaint);
router.put("/complaints/:id", auth, updateComplaintStatus);

module.exports = router;