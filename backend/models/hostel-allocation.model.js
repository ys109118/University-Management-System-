const mongoose = require("mongoose");

const hostelAllocationSchema = new mongoose.Schema(
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
      required: true,
    },
    bedNumber: {
      type: Number,
      required: true,
    },
    allocationDate: {
      type: Date,
      default: Date.now,
    },
    checkInDate: {
      type: Date,
    },
    checkOutDate: {
      type: Date,
    },
    academicYear: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["allocated", "checked-in", "checked-out", "cancelled"],
      default: "allocated",
    },
    rent: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

hostelAllocationSchema.index({ studentId: 1, academicYear: 1 }, { unique: true });

const HostelAllocation = mongoose.model("HostelAllocation", hostelAllocationSchema);
module.exports = HostelAllocation;