const mongoose = require("mongoose");

const hostelComplaintSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentDetail",
      required: true,
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["maintenance", "cleanliness", "security", "food", "electricity", "water", "other"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "closed"],
      default: "pending",
    },
    assignedTo: {
      type: String,
    },
    resolvedDate: {
      type: Date,
    },
    adminRemarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const HostelComplaint = mongoose.model("HostelComplaint", hostelComplaintSchema);
module.exports = HostelComplaint;