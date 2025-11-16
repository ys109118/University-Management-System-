require('dotenv').config();
const connectToMongo = require("./Database/db");
const adminDetails = require("./models/details/admin-details.model");
const facultyDetails = require("./models/details/faculty-details.model");
const studentDetails = require("./models/details/student-details.model");
const branchModel = require("./models/branch.model");
const subjectModel = require("./models/subject.model");

const seedAll = async () => {
  try {
    console.log('🌱 Starting comprehensive seeding...\n');
    
    // Connect to MongoDB
    await connectToMongo();
    
    // Clear existing data (optional)
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      adminDetails.deleteMany({}),
      facultyDetails.deleteMany({}),
      studentDetails.deleteMany({}),
      branchModel.deleteMany({}),
      subjectModel.deleteMany({})
    ]);
    
    // 1. Create Branches
    console.log('📚 Creating branches...');
    const branches = await branchModel.insertMany([
      { branchId: 'CS001', name: 'Computer Science' },
      { branchId: 'IT001', name: 'Information Technology' },
      { branchId: 'EC001', name: 'Electronics' },
      { branchId: 'ME001', name: 'Mechanical' },
      { branchId: 'CE001', name: 'Civil' }
    ]);
    console.log(`✅ Created ${branches.length} branches`);
    
    // 2. Create Subjects
    console.log('📖 Creating subjects...');
    const subjects = await subjectModel.insertMany([
      { name: 'Data Structures', code: 'DS101', branch: branches[0]._id, semester: 3, credits: 4 },
      { name: 'Database Management', code: 'DBMS201', branch: branches[0]._id, semester: 4, credits: 4 },
      { name: 'Web Development', code: 'WD301', branch: branches[0]._id, semester: 5, credits: 3 },
      { name: 'Machine Learning', code: 'ML401', branch: branches[0]._id, semester: 6, credits: 4 },
      { name: 'Network Security', code: 'NS101', branch: branches[1]._id, semester: 4, credits: 3 },
      { name: 'Software Engineering', code: 'SE201', branch: branches[1]._id, semester: 5, credits: 4 }
    ]);
    console.log(`✅ Created ${subjects.length} subjects`);
    
    // 3. Create Admin
    console.log('👨‍💼 Creating admin...');
    const admin = await adminDetails.create({
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
      password: "admin123"
    });
    console.log('✅ Admin created');
    
    // 4. Create Faculty
    console.log('👨‍🏫 Creating faculty...');
    const faculty = await facultyDetails.insertMany([
      {
        employeeId: 654321,
        firstName: "John",
        lastName: "Doe",
        email: "faculty@gmail.com",
        phone: "9876543210",
        address: "456 Faculty Lane",
        city: "College City",
        state: "State",
        pincode: "123456",
        country: "India",
        gender: "male",
        dob: new Date("1985-05-15"),
        designation: "Professor",
        joiningDate: new Date("2020-01-01"),
        salary: 75000,
        status: "active",
        password: "faculty123",
        branchId: branches[0]._id
      },
      {
        employeeId: 654322,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@gmail.com",
        phone: "9876543211",
        address: "789 Professor St",
        city: "College City",
        state: "State",
        pincode: "123456",
        country: "India",
        gender: "female",
        dob: new Date("1988-08-20"),
        designation: "Assistant Professor",
        joiningDate: new Date("2021-06-01"),
        salary: 65000,
        status: "active",
        password: "faculty123",
        branchId: branches[1]._id
      }
    ]);
    console.log(`✅ Created ${faculty.length} faculty members`);
    
    // 5. Create Students
    console.log('👨‍🎓 Creating students...');
    const students = await studentDetails.insertMany([
      {
        enrollmentNo: "CS2021001",
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice@gmail.com",
        phone: "8765432109",
        address: "101 Student Ave",
        city: "College City",
        state: "State",
        pincode: "123456",
        country: "India",
        gender: "female",
        dob: new Date("2003-03-10"),
        branch: branches[0]._id,
        semester: 3,
        admissionYear: 2021,
        status: "active",
        password: "student123"
      },
      {
        enrollmentNo: "CS2021002",
        firstName: "Bob",
        lastName: "Wilson",
        email: "bob@gmail.com",
        phone: "8765432108",
        address: "102 Student Ave",
        city: "College City",
        state: "State",
        pincode: "123456",
        country: "India",
        gender: "male",
        dob: new Date("2003-07-22"),
        branch: branches[0]._id,
        semester: 3,
        admissionYear: 2021,
        status: "active",
        password: "student123"
      },
      {
        enrollmentNo: "IT2021001",
        firstName: "Carol",
        lastName: "Davis",
        email: "carol@gmail.com",
        phone: "8765432107",
        address: "103 Student Ave",
        city: "College City",
        state: "State",
        pincode: "123456",
        country: "India",
        gender: "female",
        dob: new Date("2003-11-05"),
        branch: branches[1]._id,
        semester: 4,
        admissionYear: 2021,
        status: "active",
        password: "student123"
      }
    ]);
    console.log(`✅ Created ${students.length} students`);
    
    console.log('\n🎉 Seeding completed successfully!\n');
    console.log('=== LOGIN CREDENTIALS ===');
    console.log('👨‍💼 ADMIN:');
    console.log('   Employee ID: 123456');
    console.log('   Password: admin123');
    console.log('   Email: admin@gmail.com\n');
    
    console.log('👨‍🏫 FACULTY:');
    console.log('   Employee ID: 654321');
    console.log('   Password: faculty123');
    console.log('   Email: faculty@gmail.com\n');
    
    console.log('👨‍🎓 STUDENT:');
    console.log('   Enrollment No: CS2021001');
    console.log('   Password: student123');
    console.log('   Email: alice@gmail.com');
    console.log('========================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAll();