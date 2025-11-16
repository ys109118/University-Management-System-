require('dotenv').config();
const connectToMongo = require("./Database/db");
const adminDetails = require("./models/details/admin-details.model");
const facultyDetails = require("./models/details/faculty-details.model");
const studentDetails = require("./models/details/student-details.model");
const bcrypt = require("bcryptjs");

const fixPasswords = async () => {
  try {
    await connectToMongo();
    
    console.log("🔧 Fixing all passwords...\n");
    
    // Fix admin password
    const admin = await adminDetails.findOne({ employeeId: 123456 });
    if (admin) {
      const hashedAdminPass = await bcrypt.hash("admin123", 10);
      await adminDetails.findByIdAndUpdate(admin._id, { password: hashedAdminPass });
      console.log("✅ Admin password fixed");
    }
    
    // Fix faculty passwords
    const faculty = await facultyDetails.find({});
    for (let f of faculty) {
      const hashedFacultyPass = await bcrypt.hash("faculty123", 10);
      await facultyDetails.findByIdAndUpdate(f._id, { password: hashedFacultyPass });
    }
    console.log("✅ Faculty passwords fixed");
    
    // Fix student passwords
    const students = await studentDetails.find({});
    for (let s of students) {
      const hashedStudentPass = await bcrypt.hash("student123", 10);
      await studentDetails.findByIdAndUpdate(s._id, { password: hashedStudentPass });
    }
    console.log("✅ Student passwords fixed");
    
    console.log("\n🎉 All passwords fixed!\n");
    console.log("=== CORRECT LOGIN CREDENTIALS ===");
    console.log("👨💼 ADMIN:");
    console.log("   Employee ID: 123456");
    console.log("   Password: admin123\n");
    
    console.log("👨🏫 FACULTY:");
    console.log("   Employee ID: 654321");
    console.log("   Password: faculty123\n");
    
    console.log("👨🎓 STUDENT:");
    console.log("   Email: alice@gmail.com");
    console.log("   Password: student123");
    console.log("   (Use EMAIL not enrollment number!)");
    console.log("================================\n");
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

fixPasswords();