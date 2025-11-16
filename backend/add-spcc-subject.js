require("dotenv").config();
const mongoose = require("mongoose");
const Subject = require("./models/subject.model");
const Branch = require("./models/branch.model");

const addSPCCSubject = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    console.log("Connected to MongoDB");
    
    // Find CSE branch (or create if doesn't exist)
    let branch = await Branch.findOne({ branchId: "CSE" });
    if (!branch) {
      branch = await Branch.create({
        branchId: "CSE",
        name: "Computer Science Engineering"
      });
      console.log("Created CSE branch");
    }
    
    // Check if SPCC subject already exists
    const existingSubject = await Subject.findOne({ code: "SPCC" });
    if (existingSubject) {
      console.log("SPCC subject already exists:", existingSubject);
      return;
    }
    
    // Create SPCC subject
    const spccSubject = await Subject.create({
      name: "System Programming and Compiler Construction",
      code: "SPCC",
      branch: branch._id,
      semester: 6,
      credits: 4
    });
    
    console.log("✅ SPCC Subject added successfully:");
    console.log("Name:", spccSubject.name);
    console.log("Code:", spccSubject.code);
    console.log("Semester:", spccSubject.semester);
    console.log("Credits:", spccSubject.credits);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

addSPCCSubject();