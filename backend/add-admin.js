const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const AdminDetails = require("./models/details/admin-details.model");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const addAdmin = async () => {
  try {
    const email = "ys109118@gmail.com";
    const password = "admin123";

    // Check if admin already exists
    const existingAdmin = await AdminDetails.findOne({ email });
    if (existingAdmin) {
      console.log("❌ Admin with this email already exists");
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate employee ID
    const employeeId = Math.floor(100000 + Math.random() * 900000);

    // Create admin
    const admin = await AdminDetails.create({
      firstName: "Yash",
      lastName: "Sharma",
      email: email,
      password: hashedPassword,
      employeeId: employeeId,
      phone: "1234567890",
      profile: "default.jpg",
      address: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
      gender: "male",
      dob: new Date("1995-01-01"),
      designation: "System Administrator",
      joiningDate: new Date(),
      salary: 50000
    });

    console.log("✅ Admin created successfully:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Employee ID: ${employeeId}`);

  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  }
};

connectDB().then(addAdmin);