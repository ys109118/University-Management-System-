# 🏠 Hostel Management System

## Overview
The Hostel Management System is a comprehensive module integrated into the College Management System that handles all aspects of hostel operations including room allocation, complaint management, and administrative oversight.

## Features

### 🔧 Admin Features
- **Hostel Management**: Create and manage multiple hostels with details like capacity, type (boys/girls/mixed), and facilities
- **Room Management**: Add rooms to hostels with specifications like capacity, rent, and amenities
- **Student Allocation**: Assign students to rooms with bed numbers and academic year tracking
- **Complaint Resolution**: View and manage student complaints with status tracking
- **Occupancy Tracking**: Real-time monitoring of room and hostel occupancy

### 👨‍🎓 Student Features
- **Room Information**: View current room allocation details including hostel, room number, and bed assignment
- **Complaint System**: Submit complaints for maintenance, cleanliness, security, food, utilities, and other issues
- **Complaint Tracking**: Monitor complaint status and view admin responses
- **Priority Levels**: Set complaint priority (low, medium, high, urgent)

## Database Models

### Hostel Model
- Name, type (boys/girls/mixed), total capacity
- Warden information and contact details
- Facilities list and address
- Occupancy tracking

### Room Model
- Room number, floor, capacity, type
- Rent amount and facilities
- Status (available/occupied/maintenance/reserved)

### Allocation Model
- Student-room assignment with bed number
- Academic year and allocation dates
- Check-in/check-out tracking
- Security deposit and rent information

### Complaint Model
- Title, description, category, priority
- Status tracking (pending/in-progress/resolved/closed)
- Admin remarks and resolution date

## API Endpoints

### Hostel Routes
- `GET /api/hostel/hostels` - Get all hostels
- `POST /api/hostel/hostels` - Create new hostel
- `PUT /api/hostel/hostels/:id` - Update hostel
- `DELETE /api/hostel/hostels/:id` - Delete hostel

### Room Routes
- `GET /api/hostel/hostels/:hostelId/rooms` - Get rooms by hostel
- `POST /api/hostel/rooms` - Create new room

### Allocation Routes
- `GET /api/hostel/allocations` - Get all allocations
- `POST /api/hostel/allocations` - Allocate room to student

### Complaint Routes
- `GET /api/hostel/complaints` - Get all complaints
- `POST /api/hostel/complaints` - Submit new complaint
- `PUT /api/hostel/complaints/:id` - Update complaint status

## Usage Instructions

### For Administrators
1. Navigate to Admin Dashboard → Hostel Management
2. Create hostels with basic information and facilities
3. Add rooms to hostels with capacity and rent details
4. Allocate students to available rooms
5. Monitor and resolve student complaints

### For Students
1. Navigate to Student Dashboard → Hostel Services
2. View your current room allocation details
3. Submit complaints using the complaint form
4. Track complaint status and admin responses

## Installation
The hostel management system is automatically included when setting up the main College Management System. No additional installation required.

## Future Enhancements
- Mess management integration
- Fee payment tracking
- Visitor management
- Maintenance scheduling
- Mobile app notifications