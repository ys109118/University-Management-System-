import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiUsers, 
  FiCalendar, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock,
  FiSearch,
  FiFilter,
  FiDownload,
  FiBarChart2
} from 'react-icons/fi';
import { HiAcademicCap, HiClipboardCheck } from 'react-icons/hi';
import { MdSchool, MdDateRange } from 'react-icons/md';
import CustomButton from '../../components/CustomButton';
import toast from 'react-hot-toast';
import axiosWrapper from '../../utils/AxiosWrapper';

const AttendanceCard = ({ student, onMarkAttendance, attendance }) => {
  const { isDarkMode } = useTheme();
  const isPresent = attendance?.status === 'present';
  const isAbsent = attendance?.status === 'absent';
  
  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' 
        : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'
    } shadow-lg hover:shadow-xl group`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
            isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}>
            {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {student.firstName} {student.lastName}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {student.enrollmentNo}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onMarkAttendance(student._id, 'present')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isPresent 
                ? 'bg-green-500 text-white scale-110' 
                : isDarkMode 
                  ? 'bg-gray-700 text-gray-400 hover:bg-green-500/20 hover:text-green-400' 
                  : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-600'
            }`}
          >
            <FiCheckCircle className="text-lg" />
          </button>
          <button
            onClick={() => onMarkAttendance(student._id, 'absent')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isAbsent 
                ? 'bg-red-500 text-white scale-110' 
                : isDarkMode 
                  ? 'bg-gray-700 text-gray-400 hover:bg-red-500/20 hover:text-red-400' 
                  : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600'
            }`}
          >
            <FiXCircle className="text-lg" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Branch: {student.branch?.name}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isPresent 
            ? 'bg-green-100 text-green-600' 
            : isAbsent 
              ? 'bg-red-100 text-red-600' 
              : isDarkMode 
                ? 'bg-gray-700 text-gray-400' 
                : 'bg-gray-100 text-gray-500'
        }`}>
          {isPresent ? 'Present' : isAbsent ? 'Absent' : 'Not Marked'}
        </span>
      </div>
    </div>
  );
};

const AttendanceStats = ({ stats }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'
      } shadow-lg hover:shadow-xl`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Students
            </p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {stats.total || 0}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <FiUsers className="text-xl" />
          </div>
        </div>
      </div>
      
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'
      } shadow-lg hover:shadow-xl`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Present
            </p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {stats.present || 0}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
            <FiCheckCircle className="text-xl" />
          </div>
        </div>
      </div>
      
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'
      } shadow-lg hover:shadow-xl`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Absent
            </p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {stats.absent || 0}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
            <FiXCircle className="text-xl" />
          </div>
        </div>
      </div>
      
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'
      } shadow-lg hover:shadow-xl`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Attendance Rate
            </p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
            </p>
          </div>
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
            <FiBarChart2 className="text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

const AttendanceEnhanced = () => {
  const { isDarkMode } = useTheme();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const userToken = localStorage.getItem('userToken');
  
  useEffect(() => {
    fetchBranches();
    fetchSubjects();
  }, []);
  
  useEffect(() => {
    if (selectedBranch && selectedSemester) {
      fetchStudents();
    }
  }, [selectedBranch, selectedSemester]);
  
  useEffect(() => {
    if (selectedDate && selectedBranch && selectedSemester && selectedSubject) {
      fetchAttendance();
    }
  }, [selectedDate, selectedBranch, selectedSemester, selectedSubject]);
  
  const fetchBranches = async () => {
    try {
      const response = await axiosWrapper.get('/branch', {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (response.data.success) {
        setBranches(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch branches');
    }
  };
  
  const fetchSubjects = async () => {
    try {
      const response = await axiosWrapper.get('/subject', {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch subjects');
    }
  };
  
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axiosWrapper.get(`/student?branch=${selectedBranch}&semester=${selectedSemester}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAttendance = async () => {
    try {
      const response = await axiosWrapper.get(`/attendance?date=${selectedDate}&branch=${selectedBranch}&semester=${selectedSemester}&subject=${selectedSubject}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (response.data.success) {
        const attendanceMap = {};
        response.data.data.forEach(record => {
          attendanceMap[record.student] = record;
        });
        setAttendance(attendanceMap);
      }
    } catch (error) {
      console.log('No attendance records found for this date');
      setAttendance({});
    }
  };
  
  const markAttendance = async (studentId, status) => {
    try {
      const response = await axiosWrapper.post('/attendance', {
        student: studentId,
        date: selectedDate,
        subject: selectedSubject,
        status: status
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      
      if (response.data.success) {
        setAttendance(prev => ({
          ...prev,
          [studentId]: { ...prev[studentId], status }
        }));
        toast.success(`Marked as ${status}`);
      }
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };
  
  const saveAllAttendance = async () => {
    setSaving(true);
    try {
      const attendanceRecords = Object.entries(attendance).map(([studentId, record]) => ({
        student: studentId,
        date: selectedDate,
        subject: selectedSubject,
        status: record.status
      }));
      
      await axiosWrapper.post('/attendance/bulk', {
        records: attendanceRecords
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      
      toast.success('Attendance saved successfully');
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };
  
  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const stats = {
    total: filteredStudents.length,
    present: Object.values(attendance).filter(a => a.status === 'present').length,
    absent: Object.values(attendance).filter(a => a.status === 'absent').length
  };
  
  return (
    <div className="w-full mx-auto flex justify-center items-start flex-col mb-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
            <HiClipboardCheck className="text-3xl" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Attendance Management
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Mark and track student attendance
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <CustomButton 
            variant="outline"
            onClick={() => window.print()}
            className="px-4 py-2"
          >
            <FiDownload className="mr-2" />
            Export
          </CustomButton>
          
          <CustomButton 
            onClick={saveAllAttendance}
            loading={saving}
            className="px-6 py-3"
          >
            <FiCheckCircle className="mr-2" />
            Save Attendance
          </CustomButton>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className={`w-full p-6 rounded-2xl border mb-8 ${
        isDarkMode 
          ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'
      } shadow-lg`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiCalendar className="inline mr-2" />
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500/20' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
              }`}
            />
          </div>
          
          <div>
            <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <HiAcademicCap className="inline mr-2" />
              Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500/20' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
              }`}
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <MdDateRange className="inline mr-2" />
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500/20' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
              }`}
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <MdSchool className="inline mr-2" />
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500/20' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
              }`}
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiSearch className="inline mr-2" />
              Search
            </label>
            <div className="relative">
              <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500/20' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <AttendanceStats stats={stats} />
      
      {/* Students Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className={`w-full rounded-2xl border p-16 text-center ${
          isDarkMode 
            ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' 
            : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'
        } shadow-lg`}>
          <FiUsers className={`mx-auto text-6xl mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No Students Found
          </h3>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Please select branch and semester to view students
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredStudents.map(student => (
            <AttendanceCard
              key={student._id}
              student={student}
              attendance={attendance[student._id]}
              onMarkAttendance={markAttendance}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceEnhanced;