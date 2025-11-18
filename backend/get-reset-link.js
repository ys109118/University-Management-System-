const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import models
const AdminDetails = require("./models/details/admin-details.model");
const FacultyDetails = require("./models/details/faculty-details.model");
const StudentDetails = require("./models/details/student-details.model");
const ResetPassword = require("./models/reset-password.model");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const generateResetLink = async (email, userType) => {
  try {
    let user;
    let modelType;

    // Find user based on type
    switch (userType.toLowerCase()) {
      case 'admin':
        user = await AdminDetails.findOne({ email });
        modelType = "AdminDetails";
        break;
      case 'faculty':
        user = await FacultyDetails.findOne({ email });
        modelType = "FacultyDetails";
        break;
      case 'student':
        user = await StudentDetails.findOne({ email });
        modelType = "StudentDetails";
        break;
      default:
        throw new Error("Invalid user type. Use: admin, faculty, or student");
    }

    if (!user) {
      throw new Error(`No ${userType} found with email: ${email}`);
    }

    // Generate reset token
    const resetToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        timestamp: Date.now()
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // Clean up existing reset tokens
    await ResetPassword.deleteMany({
      type: modelType,
      userId: user._id,
    });

    // Create new reset token record
    const resetRecord = await ResetPassword.create({
      resetToken: resetToken,
      type: modelType,
      userId: user._id,
    });

    // Generate reset link
    const resetLink = `${process.env.FRONTEND_API_LINK}/${userType.toLowerCase()}/update-password/${resetRecord._id}`;

    console.log("\n🔗 Password Reset Link Generated:");
    console.log("=====================================");
    console.log(`User: ${user.name || user.firstName + ' ' + user.lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Type: ${userType}`);
    console.log(`Expires: 15 minutes from now`);
    console.log("\nReset Link:");
    console.log(resetLink);
    console.log("=====================================\n");

    return resetLink;

  } catch (error) {
    console.error("❌ Error generating reset link:", error.message);
    throw error;
  }
};

const main = async () => {
  await connectDB();

  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log("\n📋 Usage: node get-reset-link.js <email> <userType>");
    console.log("Example: node get-reset-link.js admin@gmail.com admin");
    console.log("User types: admin, faculty, student\n");
    process.exit(1);
  }

  const [email, userType] = args;

  try {
    await generateResetLink(email, userType);
  } catch (error) {
    console.error("❌ Failed to generate reset link:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateResetLink };