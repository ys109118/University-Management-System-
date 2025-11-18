import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseApiURL } from '../../baseUrl';
import { toast } from 'react-hot-toast';

const HostelServices = () => {
  const [activeTab, setActiveTab] = useState('allocation');
  const [allocation, setAllocation] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [complaintForm, setComplaintForm] = useState({
    title: '', description: '', category: 'maintenance', priority: 'medium'
  });
  const [requestForm, setRequestForm] = useState({
    hostelId: '', roomId: '', preferences: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Always fetch fresh user data
      const userResponse = await axios.get(`${baseApiURL()}/student/my-details`, config);
      const userData = userResponse.data.data;
      localStorage.setItem('userData', JSON.stringify(userData));
      
      const studentId = userData._id;
      console.log('🔍 Debug - Student ID:', studentId);
      
      if (!studentId) {
        console.error('Student ID not found');
        setLoading(false);
        return;
      }

      if (activeTab === 'allocation') {
        const response = await axios.get(`${baseApiURL()}/hostel/allocations`, config);
        console.log('🔍 Debug - All allocations:', response.data.data);
        console.log('🔍 Debug - Looking for student ID:', studentId);
        console.log('🔍 Debug - Student ID type:', typeof studentId);
        
        const userAllocation = response.data.data.find(alloc => {
          const allocStudentId = alloc.studentId?._id || alloc.studentId;
          console.log('🔍 Debug - Checking allocation:', {
            allocId: alloc._id,
            allocStudentId,
            allocStudentIdType: typeof allocStudentId,
            match1: allocStudentId === studentId,
            match2: allocStudentId?.toString() === studentId?.toString()
          });
          return allocStudentId === studentId || allocStudentId?.toString() === studentId?.toString();
        });
        console.log('🔍 Debug - Found allocation:', userAllocation);
        setAllocation(userAllocation);
      } else if (activeTab === 'request') {
        const [hostelsRes, roomsRes] = await Promise.all([
          axios.get(`${baseApiURL()}/hostel/hostels`, config),
          axios.get(`${baseApiURL()}/hostel/rooms`, config)
        ]);
        setHostels(hostelsRes.data.data);
        const available = roomsRes.data.data.filter(room => 
          (room.occupiedBeds || 0) < room.capacity
        );
        setAvailableRooms(available);
      } else if (activeTab === 'complaints') {
        const response = await axios.get(`${baseApiURL()}/hostel/complaints`, config);
        const userComplaints = response.data.data.filter(complaint => {
          const complaintStudentId = complaint.studentId?._id || complaint.studentId;
          return complaintStudentId === studentId || complaintStudentId?.toString() === studentId?.toString();
        });
        setComplaints(userComplaints);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      const userData = JSON.parse(localStorage.getItem('userData'));
      const studentId = userData?._id;
      
      if (!studentId) {
        toast.error('Student information not found. Please login again.');
        return;
      }
      
      if (!allocation) {
        toast.error('You must be allocated to a hostel room to submit complaints.');
        return;
      }
      
      const complaintData = {
        ...complaintForm,
        studentId,
        hostelId: allocation.hostelId?._id || allocation.hostelId,
        roomId: allocation.roomId?._id || allocation.roomId
      };
      
      console.log('Submitting complaint:', complaintData);

      await axios.post(`${baseApiURL()}/hostel/complaints`, complaintData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComplaintForm({ title: '', description: '', category: 'maintenance', priority: 'medium' });
      fetchData();
      toast.success('Complaint submitted successfully!');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error(error.response?.data?.message || 'Error submitting complaint');
    }
  };

  const handleRoomRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      const userData = JSON.parse(localStorage.getItem('userData'));
      const studentId = userData?._id;
      
      if (allocation) {
        toast.error('You already have a room allocation.');
        return;
      }
      
      const selectedRoom = availableRooms.find(room => room._id === requestForm.roomId);
      if (!selectedRoom) {
        toast.error('Please select a valid room.');
        return;
      }
      
      const allocationData = {
        studentId,
        hostelId: requestForm.hostelId,
        roomId: requestForm.roomId,
        bedNumber: (selectedRoom.occupiedBeds || 0) + 1,
        academicYear: '2024-25',
        rent: selectedRoom.rent
      };
      
      await axios.post(`${baseApiURL()}/hostel/allocations`, allocationData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRequestForm({ hostelId: '', roomId: '', preferences: '' });
      setActiveTab('allocation');
      fetchData();
      toast.success('Room allocated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error requesting room');
    }
  };

  const getFilteredRooms = () => {
    if (!requestForm.hostelId) return [];
    return availableRooms.filter(room => 
      room.hostelId._id === requestForm.hostelId
    );
  };

  const getFilteredHostels = () => {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString || userDataString === 'undefined') return hostels;
    
    try {
      const userData = JSON.parse(userDataString);
      const userGender = userData?.gender;
      
      return hostels.filter(hostel => {
        if (userGender === 'male') return hostel.type === 'boys' || hostel.type === 'mixed';
        if (userGender === 'female') return hostel.type === 'girls' || hostel.type === 'mixed';
        return true;
      });
    } catch (error) {
      console.error('Error parsing userData:', error);
      return hostels;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hostel Services</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-blue-900/20 p-1 rounded-lg mb-6">
          {['allocation', 'request', 'complaints'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              {tab === 'allocation' ? 'My Room' : tab === 'request' ? 'Request Room' : 'Complaints'}
            </button>
          ))}
        </div>

        {/* Allocation Tab */}
        {activeTab === 'allocation' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Room Allocation</h2>
            {allocation ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Hostel Details</h3>
                    <p className="text-blue-600">Name: {allocation.hostelId.name}</p>
                    <p className="text-blue-600">Type: {allocation.hostelId.type}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800">Room Details</h3>
                    <p className="text-green-600">Room: {allocation.roomId.roomNumber}</p>
                    <p className="text-green-600">Floor: {allocation.roomId.floor}</p>
                    <p className="text-green-600">Bed: {allocation.bedNumber}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Allocation Info</h3>
                  <p className="text-gray-600">Status: {allocation.status}</p>
                  <p className="text-gray-600">Academic Year: {allocation.academicYear}</p>
                  <p className="text-gray-600">Rent: ₹{allocation.rent}/month</p>
                  <p className="text-gray-600">Allocated: {new Date(allocation.allocationDate).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No room allocation found.</p>
                <button 
                  onClick={() => setActiveTab('request')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Request Room
                </button>
              </div>
            )}
          </div>
        )}

        {/* Request Room Tab */}
        {activeTab === 'request' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Request Hostel Room</h2>
            {allocation ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You already have a room allocation. Check the 'My Room' tab.</p>
              </div>
            ) : (
              <form onSubmit={handleRoomRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Hostel</label>
                  <select
                    value={requestForm.hostelId}
                    onChange={(e) => setRequestForm({...requestForm, hostelId: e.target.value, roomId: ''})}
                    className="w-full p-3 border rounded-lg"
                    required
                  >
                    <option value="">Choose a hostel...</option>
                    {getFilteredHostels().map(hostel => (
                      <option key={hostel._id} value={hostel._id}>
                        {hostel.name} ({hostel.type})
                      </option>
                    ))}
                  </select>
                </div>
                
                {requestForm.hostelId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Rooms</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                      {getFilteredRooms().map(room => (
                        <div 
                          key={room._id}
                          onClick={() => setRequestForm({...requestForm, roomId: room._id})}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            requestForm.roomId === room._id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <h4 className="font-semibold">Room {room.roomNumber}</h4>
                          <p className="text-sm text-gray-600">Floor {room.floor} • {room.roomType}</p>
                          <p className="text-sm text-gray-600">Available: {room.capacity - (room.occupiedBeds || 0)} beds</p>
                          <p className="text-sm font-medium text-green-600">₹{room.rent}/month</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Preferences (Optional)</label>
                  <textarea
                    value={requestForm.preferences}
                    onChange={(e) => setRequestForm({...requestForm, preferences: e.target.value})}
                    placeholder="Any special requirements or preferences..."
                    className="w-full p-3 border rounded-lg"
                    rows="3"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                  disabled={!requestForm.hostelId || !requestForm.roomId}
                >
                  Request Room Allocation
                </button>
              </form>
            )}
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === 'complaints' && (
          <div className="space-y-6">
            {/* Submit Complaint Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Submit Complaint</h2>
              <form onSubmit={handleSubmitComplaint} className="space-y-4">
                <input
                  type="text"
                  placeholder="Complaint Title"
                  value={complaintForm.title}
                  onChange={(e) => setComplaintForm({...complaintForm, title: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Describe your complaint..."
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  rows="4"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({...complaintForm, category: e.target.value})}
                    className="p-3 border rounded-lg"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="cleanliness">Cleanliness</option>
                    <option value="security">Security</option>
                    <option value="food">Food</option>
                    <option value="electricity">Electricity</option>
                    <option value="water">Water</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    value={complaintForm.priority}
                    onChange={(e) => setComplaintForm({...complaintForm, priority: e.target.value})}
                    className="p-3 border rounded-lg"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                  disabled={!allocation}
                >
                  Submit Complaint
                </button>
              </form>
            </div>

            {/* Complaints List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">My Complaints</h2>
              <div className="space-y-4">
                {complaints.length > 0 ? complaints.map((complaint) => (
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
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Category: {complaint.category}</span>
                      <span>Priority: {complaint.priority}</span>
                      <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                    {complaint.adminRemarks && (
                      <div className="mt-2 p-2 bg-blue-50 rounded">
                        <p className="text-sm text-blue-800">Admin Remarks: {complaint.adminRemarks}</p>
                      </div>
                    )}
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">No complaints submitted yet.</p>
                )}
              </div>
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

export default HostelServices;