const Hostel = require("../models/hostel.model");
const Room = require("../models/room.model");
const HostelAllocation = require("../models/hostel-allocation.model");
const HostelComplaint = require("../models/hostel-complaint.model");
const ApiResponse = require("../utils/ApiResponse");

// Get all hostels
const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find().sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, hostels, "Hostels fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Create hostel
const createHostel = async (req, res) => {
  try {
    const hostel = new Hostel(req.body);
    await hostel.save();
    return res.status(201).json(new ApiResponse(201, hostel, "Hostel created successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Update hostel
const updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hostel) {
      return res.status(404).json(new ApiResponse(404, null, "Hostel not found"));
    }
    return res.status(200).json(new ApiResponse(200, hostel, "Hostel updated successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Delete hostel
const deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndDelete(req.params.id);
    if (!hostel) {
      return res.status(404).json(new ApiResponse(404, null, "Hostel not found"));
    }
    return res.status(200).json(new ApiResponse(200, null, "Hostel deleted successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("hostelId").sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, rooms, "Rooms fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Get rooms by hostel
const getRoomsByHostel = async (req, res) => {
  try {
    const rooms = await Room.find({ hostelId: req.params.hostelId }).populate("hostelId");
    return res.status(200).json(new ApiResponse(200, rooms, "Rooms fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Create room
const createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    
    // Update hostel total rooms
    await Hostel.findByIdAndUpdate(req.body.hostelId, { $inc: { totalRooms: 1 } });
    
    return res.status(201).json(new ApiResponse(201, room, "Room created successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Get allocations
const getAllocations = async (req, res) => {
  try {
    const allocations = await HostelAllocation.find()
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("hostelId", "name")
      .populate("roomId", "roomNumber")
      .sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, allocations, "Allocations fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Allocate room
const allocateRoom = async (req, res) => {
  try {
    const allocation = new HostelAllocation(req.body);
    await allocation.save();
    
    // Update room occupied beds
    await Room.findByIdAndUpdate(req.body.roomId, { $inc: { occupiedBeds: 1 } });
    
    return res.status(201).json(new ApiResponse(201, allocation, "Room allocated successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Get complaints
const getComplaints = async (req, res) => {
  try {
    const complaints = await HostelComplaint.find()
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("hostelId", "name")
      .populate("roomId", "roomNumber")
      .sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, complaints, "Complaints fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Create complaint
const createComplaint = async (req, res) => {
  try {
    const complaint = new HostelComplaint(req.body);
    await complaint.save();
    return res.status(201).json(new ApiResponse(201, complaint, "Complaint submitted successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await HostelComplaint.findByIdAndUpdate(
      req.params.id,
      { 
        status: req.body.status,
        adminRemarks: req.body.adminRemarks,
        resolvedDate: req.body.status === 'resolved' ? new Date() : null
      },
      { new: true }
    );
    if (!complaint) {
      return res.status(404).json(new ApiResponse(404, null, "Complaint not found"));
    }
    return res.status(200).json(new ApiResponse(200, complaint, "Complaint updated successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

module.exports = {
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
};