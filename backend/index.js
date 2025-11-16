require('dotenv').config();
const connectToMongo = require("./Database/db");
const express = require("express");
const app = express();
const path = require("path");
connectToMongo();
const port = process.env.PORT || 3001;
var cors = require("cors");

app.use(
  cors({
    origin: [process.env.FRONTEND_API_LINK, "http://localhost:3000", "http://localhost:3002", "https://university-management-system-7ae5.vercel.app"],
    credentials: true
  })
);

app.use(express.json()); //to convert request data to json

app.get("/", (req, res) => {
  res.send("Hello 👋 I am Working Fine 🚀");
});

// Admin seeder endpoint
app.get("/seed-admin", async (req, res) => {
  try {
    const adminDetails = require("./models/details/admin-details.model");
    
    // Check if admin already exists
    const existingAdmin = await adminDetails.findOne({ employeeId: 123456 });
    if (existingAdmin) {
      return res.json({ message: "Admin already exists", credentials: { employeeId: 123456, password: "admin123" } });
    }

    const adminDetail = {
      employeeId: 123456,
      firstName: "Admin",
      lastName: "User",
      email: "admin@gmail.com",
      phone: "1234567890",
      address: "123 College Street",
      city: "College City",
      state: "State",
      pincode: "123456",
      country: "India",
      gender: "male",
      dob: new Date("1990-01-01"),
      designation: "System Administrator",
      joiningDate: new Date(),
      salary: 50000,
      status: "active",
      password: "admin123",
    };

    await adminDetails.create(adminDetail);
    res.json({ message: "Admin created successfully!", credentials: { employeeId: 123456, password: "admin123" } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/media", express.static(path.join(__dirname, "media")));

app.use("/api/admin", require("./routes/details/admin-details.route"));
app.use("/api/faculty", require("./routes/details/faculty-details.route"));
app.use("/api/student", require("./routes/details/student-details.route"));

app.use("/api/branch", require("./routes/branch.route"));
app.use("/api/subject", require("./routes/subject.route"));
app.use("/api/notice", require("./routes/notice.route"));
app.use("/api/timetable", require("./routes/timetable.route"));
app.use("/api/material", require("./routes/material.route"));
app.use("/api/exam", require("./routes/exam.route"));
app.use("/api/marks", require("./routes/marks.route"));
app.use("/api/attendance", require("./routes/attendance.route"));

app.listen(port, () => {
  console.log(`Server Listening On http://localhost:${port}`);
});
