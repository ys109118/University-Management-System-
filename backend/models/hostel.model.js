const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["boys", "girls", "mixed"],
      required: true,
    },
    totalRooms: {
      type: Number,
      required: true,
    },
    totalCapacity: {
      type: Number,
      required: true,
    },
    occupiedRooms: {
      type: Number,
      default: 0,
    },
    occupiedCapacity: {
      type: Number,
      default: 0,
    },
    warden: {
      name: String,
      phone: String,
      email: String,
    },
    facilities: [{
      type: String,
    }],
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Hostel = mongoose.model("Hostel", hostelSchema);
module.exports = Hostel;