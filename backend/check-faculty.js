require("dotenv").config();
const mongoose = require("mongoose");
const facultyDetails = require("./models/details/faculty-details.model");
const bcrypt = require("bcryptjs");

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    console.log("Connected to MongoDB");
    
    const faculty = await facultyDetails.findOne({email: 'faculty@gmail.com'});
    
    if (faculty) {
      console.log("✅ Faculty found:");
      console.log("Email:", faculty.email);
      console.log("Password hash:", faculty.password.substring(0, 20) + "...");
      
      // Test password comparison
      const isValid = await bcrypt.compare("faculty123", faculty.password);
      console.log("Password 'faculty123' valid:", isValid);
      
    } else {
      console.log("❌ Faculty not found");
    }
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

testLogin();