import React, { useState, useEffect } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";
import toast from "react-hot-toast";
import CustomButton from "../../components/CustomButton";

const Attendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axiosWrapper.get("/subject");
      if (response.data && response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch subjects");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axiosWrapper.get("/student");
      if (response.data && response.data.success) {
        setStudents(response.data.data);
        // Initialize attendance data
        const initialData = {};
        response.data.data.forEach(student => {
          initialData[student._id] = "present";
        });
        setAttendanceData(initialData);
      }
    } catch (error) {
      toast.error("Failed to fetch students");
    }
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    if (e.target.value) {
      fetchStudents();
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const submitAttendance = async () => {
    if (!selectedSubject || students.length === 0) {
      toast.error("Please select subject and ensure students are loaded");
      return;
    }

    try {
      const attendanceArray = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId,
        status
      }));

      await axiosWrapper.post("/attendance/mark", {
        subjectId: selectedSubject,
        date: selectedDate,
        semester: 6, // You can make this dynamic
        branch: students[0]?.branchId, // Assuming same branch
        attendanceData: attendanceArray
      });

      toast.success("Attendance marked successfully!");
      setAttendanceData({});
      setStudents([]);
      setSelectedSubject("");
    } catch (error) {
      toast.error("Failed to mark attendance");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Students</h3>
          
          <div className="space-y-3">
            {students.map(student => (
              <div key={student._id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <span className="font-medium">{student.firstName} {student.lastName}</span>
                  <span className="text-gray-500 ml-2">({student.enrollmentNo})</span>
                </div>
                
                <div className="flex gap-2">
                  {["present", "absent", "late"].map(status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="radio"
                        name={`attendance-${student._id}`}
                        value={status}
                        checked={attendanceData[student._id] === status}
                        onChange={() => handleAttendanceChange(student._id, status)}
                        className="mr-1"
                      />
                      <span className="capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <CustomButton
              onClick={submitAttendance}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Mark Attendance
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;