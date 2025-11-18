import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseApiURL } from '../../baseUrl';
import { toast } from 'react-hot-toast';

const HostelManagement = () => {
  const [activeTab, setActiveTab] = useState('hostels');
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [hostelForm, setHostelForm] = useState({
    name: '', type: 'boys', totalRooms: '', totalCapacity: '', 
    warden: { name: '', phone: '', email: '' }, facilities: [], address: ''
  });
  const [roomForm, setRoomForm] = useState({
    roomNumber: '', hostelId: '', floor: '', capacity: '', roomType: 'single', rent: '', facilities: []
  });
  const [allocationForm, setAllocationForm] = useState({
    studentId: '', hostelId: '', roomId: '', bedNumber: '', academicYear: '2024-25', rent: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (activeTab === 'hostels') {
        const response = await axios.get(`${baseApiURL()}/hostel/hostels`, config);
        setHostels(response.data.data);
      } else if (activeTab === 'rooms') {
        const hostelsResponse = await axios.get(`${baseApiURL()}/hostel/hostels`, config);
        setHostels(hostelsResponse.data.data || []);
        
        try {
          const roomsResponse = await axios.get(`${baseApiURL()}/hostel/rooms`, config);
          setRooms(roomsResponse.data.data || []);
        } catch (roomError) {
          const allRooms = [];
          for (const hostel of hostelsResponse.data.data || []) {
            try {
              const hostelRoomsResponse = await axios.get(`${baseApiURL()}/hostel/hostels/${hostel._id}/rooms`, config);
              allRooms.push(...(hostelRoomsResponse.data.data || []));
            } catch (err) {
              // Skip this hostel if error
            }
          }
          setRooms(allRooms);
        }
      } else if (activeTab === 'allocations') {
        const [allocResponse, studentsResponse, hostelsResponse] = await Promise.all([
          axios.get(`${baseApiURL()}/hostel/allocations`, config),
          axios.get(`${baseApiURL()}/student`, config),
          axios.get(`${baseApiURL()}/hostel/hostels`, config)
        ]);
        setAllocations(allocResponse.data.data);
        setStudents(studentsResponse.data.data);
        setHostels(hostelsResponse.data.data);
      } else if (activeTab === 'complaints') {
        const response = await axios.get(`${baseApiURL()}/hostel/complaints`, config);
        setComplaints(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleCreateHostel = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${baseApiURL()}/hostel/hostels`, hostelForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHostelForm({ name: '', type: 'boys', totalRooms: '', totalCapacity: '', warden: { name: '', phone: '', email: '' }, facilities: [], address: '' });
      fetchData();
      toast.success('Hostel created successfully!');
    } catch (error) {
      console.error('Error creating hostel:', error);
      toast.error(error.response?.data?.message || 'Error creating hostel');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    
    const existingRoom = rooms.find(room => 
      room.hostelId?._id === roomForm.hostelId && room.roomNumber === roomForm.roomNumber
    );
    
    if (existingRoom) {
      toast.error(`Room ${roomForm.roomNumber} already exists in this hostel`);
      return;
    }
    
    try {
      const token = localStorage.getItem('userToken');
      const roomData = {
        ...roomForm,
        floor: parseInt(roomForm.floor),
        capacity: parseInt(roomForm.capacity),
        rent: parseFloat(roomForm.rent)
      };
      
      await axios.post(`${baseApiURL()}/hostel/rooms`, roomData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRoomForm({ roomNumber: '', hostelId: '', floor: '', capacity: '', roomType: 'single', rent: '', facilities: [] });
      await fetchData();
      toast.success('Room created successfully!');
    } catch (error) {
      console.error('Error creating room:', error);
      if (error.response?.data?.message?.includes('E11000')) {
        toast.error('Room number already exists in this hostel');
      } else {
        toast.error(error.response?.data?.message || 'Error creating room');
      }
    }
  };

  const updateComplaintStatus = async (complaintId, status) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(`${baseApiURL()}/hostel/complaints/${complaintId}`, 
        { status, adminRemarks: `Status updated to ${status}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      toast.success(`Complaint marked as ${status}`);
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Error updating complaint status');
    }
  };

  const fetchRoomsForHostel = async (hostelId) => {
    if (!hostelId) return;
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${baseApiURL()}/hostel/hostels/${hostelId}/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleCreateAllocation = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      const selectedRoom = rooms.find(r => r._id === allocationForm.roomId);
      
      const allocationData = {
        ...allocationForm,
        bedNumber: (selectedRoom.occupiedBeds || 0) + 1,
        rent: parseFloat(allocationForm.rent)
      };
      
      await axios.post(`${baseApiURL()}/hostel/allocations`, allocationData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAllocationForm({ studentId: '', hostelId: '', roomId: '', bedNumber: '', academicYear: '2024-25', rent: '' });
      fetchData();
      toast.success('Room allocated successfully!');
    } catch (error) {
      console.error('Error creating allocation:', error);
      toast.error(error.response?.data?.message || 'Error creating allocation');
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hostel Management</h1>
        </div>
        
        <div className="flex space-x-1 bg-blue-900/20 p-1 rounded-lg mb-6">
          {['hostels', 'rooms', 'allocations', 'complaints'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'hostels' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Hostel</h2>
              <form onSubmit={handleCreateHostel} className="space-y-4">
                <input
                  type="text"
                  placeholder="Hostel Name"
                  value={hostelForm.name}
                  onChange={(e) => setHostelForm({...hostelForm, name: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <select
                  value={hostelForm.type}
                  onChange={(e) => setHostelForm({...hostelForm, type: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="mixed">Mixed</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Total Rooms"
                    value={hostelForm.totalRooms}
                    onChange={(e) => setHostelForm({...hostelForm, totalRooms: e.target.value})}
                    className="p-3 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Total Capacity"
                    value={hostelForm.totalCapacity}
                    onChange={(e) => setHostelForm({...hostelForm, totalCapacity: e.target.value})}
                    className="p-3 border rounded-lg"
                    required
                  />
                </div>
                <textarea
                  placeholder="Address"
                  value={hostelForm.address}
                  onChange={(e) => setHostelForm({...hostelForm, address: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  rows="3"
                  required
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                  Create Hostel
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Hostels</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {hostels.map((hostel) => (
                  <div key={hostel._id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{hostel.name}</h3>
                    <p className="text-sm text-gray-600">Type: {hostel.type}</p>
                    <p className="text-sm text-gray-600">Rooms: {hostel.occupiedRooms}/{hostel.totalRooms}</p>
                    <p className="text-sm text-gray-600">Capacity: {hostel.occupiedCapacity}/{hostel.totalCapacity}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      hostel.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {hostel.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <input
                  type="text"
                  placeholder="Room Number"
                  value={roomForm.roomNumber}
                  onChange={(e) => setRoomForm({...roomForm, roomNumber: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <select
                  value={roomForm.hostelId}
                  onChange={(e) => setRoomForm({...roomForm, hostelId: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Select Hostel</option>
                  {hostels.map((hostel) => (
                    <option key={hostel._id} value={hostel._id}>{hostel.name}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Floor"
                    value={roomForm.floor}
                    onChange={(e) => setRoomForm({...roomForm, floor: e.target.value})}
                    className="p-3 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Capacity"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({...roomForm, capacity: e.target.value})}
                    className="p-3 border rounded-lg"
                    min="1" max="4"
                    required
                  />
                </div>
                <select
                  value={roomForm.roomType}
                  onChange={(e) => setRoomForm({...roomForm, roomType: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="quad">Quad</option>
                </select>
                <input
                  type="number"
                  placeholder="Rent per month"
                  value={roomForm.rent}
                  onChange={(e) => setRoomForm({...roomForm, rent: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                  Create Room
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Rooms ({rooms.length})</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {rooms.map((room) => (
                  <div key={room._id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">Room {room.roomNumber}</h3>
                    <p className="text-sm text-gray-600">Hostel: {room.hostelId?.name}</p>
                    <p className="text-sm text-gray-600">Floor: {room.floor}</p>
                    <p className="text-sm text-gray-600">Type: {room.roomType}</p>
                    <p className="text-sm text-gray-600">Occupied: {room.occupiedBeds || 0}/{room.capacity}</p>
                    <p className="text-sm text-gray-600">Rent: ₹{room.rent}/month</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      room.status === 'available' ? 'bg-green-100 text-green-800' :
                      room.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'allocations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Manual Allocation</h2>
              <form onSubmit={handleCreateAllocation} className="space-y-4">
                <select
                  value={allocationForm.studentId}
                  onChange={(e) => setAllocationForm({...allocationForm, studentId: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Select Student</option>
                  {students.filter(student => 
                    !allocations.some(alloc => alloc.studentId?._id === student._id)
                  ).map(student => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName} ({student.enrollmentNo})
                    </option>
                  ))}
                </select>
                <select
                  value={allocationForm.hostelId}
                  onChange={(e) => {
                    setAllocationForm({...allocationForm, hostelId: e.target.value, roomId: ''});
                    fetchRoomsForHostel(e.target.value);
                  }}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Select Hostel</option>
                  {hostels.map(hostel => (
                    <option key={hostel._id} value={hostel._id}>{hostel.name}</option>
                  ))}
                </select>
                <select
                  value={allocationForm.roomId}
                  onChange={(e) => {
                    const room = rooms.find(r => r._id === e.target.value);
                    setAllocationForm({...allocationForm, roomId: e.target.value, rent: room?.rent || ''});
                  }}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Select Room</option>
                  {rooms.filter(room => 
                    room.hostelId?._id === allocationForm.hostelId && 
                    (room.occupiedBeds || 0) < room.capacity
                  ).map(room => (
                    <option key={room._id} value={room._id}>
                      Room {room.roomNumber} (Available: {room.capacity - (room.occupiedBeds || 0)} beds)
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Academic Year"
                    value={allocationForm.academicYear}
                    onChange={(e) => setAllocationForm({...allocationForm, academicYear: e.target.value})}
                    className="p-3 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Rent"
                    value={allocationForm.rent}
                    onChange={(e) => setAllocationForm({...allocationForm, rent: e.target.value})}
                    className="p-3 border rounded-lg"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                  Allocate Room
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Current Allocations ({allocations.length})</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {allocations && allocations.length > 0 ? allocations.map((allocation) => (
                  <div key={allocation._id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">
                      {allocation.studentId?.firstName} {allocation.studentId?.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">Email: {allocation.studentId?.email}</p>
                    <p className="text-sm text-gray-600">Enrollment: {allocation.studentId?.enrollmentNo}</p>
                    <p className="text-sm text-gray-600">Hostel: {allocation.hostelId?.name}</p>
                    <p className="text-sm text-gray-600">Room: {allocation.roomId?.roomNumber}</p>
                    <p className="text-sm text-gray-600">Bed: {allocation.bedNumber}</p>
                    <p className="text-sm text-gray-600">Rent: ₹{allocation.rent}</p>
                    <p className="text-sm text-gray-600">Year: {allocation.academicYear}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      allocation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {allocation.status || 'active'}
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No allocations found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Hostel Complaints ({complaints.length})</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {complaints.map((complaint) => (
                <div key={complaint._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{complaint.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{complaint.description}</p>
                  <div className="text-sm text-gray-500 mb-2">
                    <p>Student: {complaint.studentId?.firstName} {complaint.studentId?.lastName}</p>
                    <p>Hostel: {complaint.hostelId?.name}</p>
                    <p>Room: {complaint.roomId?.roomNumber}</p>
                    <p>Category: {complaint.category} | Priority: {complaint.priority}</p>
                    <p>Date: {new Date(complaint.createdAt).toLocaleDateString()}</p>
                  </div>
                  {complaint.adminRemarks && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <p className="text-sm text-blue-800">Admin Remarks: {complaint.adminRemarks}</p>
                    </div>
                  )}
                  {complaint.status === 'pending' && (
                    <div className="mt-2 flex gap-2">
                      <button 
                        onClick={() => updateComplaintStatus(complaint._id, 'in-progress')}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Mark In Progress
                      </button>
                      <button 
                        onClick={() => updateComplaintStatus(complaint._id, 'resolved')}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelManagement;