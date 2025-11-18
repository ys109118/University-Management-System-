const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    occupiedBeds: {
      type: Number,
      default: 0,
    },
    roomType: {
      type: String,
      enum: ["single", "double", "triple", "quad"],
      required: true,
    },
    facilities: [{
      type: String,
    }],
    rent: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance", "reserved"],
      default: "available",
    },
  },
  { timestamps: true }
);

roomSchema.index({ hostelId: 1, roomNumber: 1 }, { unique: true });

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;