import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiCheckCircle, 
  FiBell,
  FiBook,
  FiCalendar
} from 'react-icons/fi';
import { 
  HiClipboardCheck 
} from 'react-icons/hi';
import { MdAssignment, MdGrade } from 'react-icons/md';
import EnhancedDashboard from '../../components/EnhancedDashboard';
import axiosWrapper from '../../utils/AxiosWrapper';
import toast from 'react-hot-toast';

const StudentDashboardEnhanced = ({ onMenuSelect }) => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const userToken = localStorage.getItem('userToken');

  useEffect(() => {
    fetchStudentStats();
  }, []);

  const fetchStudentStats = async () => {
    try {
      setLoading(true);
      
      // Fetch student-specific stats
      const [attendanceRes, materialsRes, noticesRes] = await Promise.all([
        axiosWrapper.get('/attendance/my-attendance', { headers: { Authorization: `Bearer ${userToken}` } }).catch(() => ({ data: { success: false } })),
        axiosWrapper.get('/material', { headers: { Authorization: `Bearer ${userToken}` } }).catch(() => ({ data: { success: false } })),
        axiosWrapper.get('/notice', { headers: { Authorization: `Bearer ${userToken}` } }).catch(() => ({ data: { success: false } }))
      ]);

      // Calculate attendance rate
      let attendanceRate = '0%';
      if (attendanceRes.data.success && attendanceRes.data.data.length > 0) {
        const totalClasses = attendanceRes.data.data.length;
        const presentClasses = attendanceRes.data.data.filter(a => a.status === 'present').length;
        attendanceRate = `${Math.round((presentClasses / totalClasses) * 100)}%`;
      }

      const newNotices = noticesRes.data.success ? noticesRes.data.data.filter(notice => {
        const noticeDate = new Date(notice.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return noticeDate > weekAgo;
      }).length : 0;

      setStats({
        attendanceRate: attendanceRate,
        assignmentsDue: Math.floor(Math.random() * 5) + 1, // Mock data
        cgpa: '8.5', // Mock data
        newNotices: newNotices
      });
    } catch (error) {
      toast.error('Failed to fetch student statistics');
      console.error('Student stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'attendance':
        onMenuSelect && onMenuSelect('Attendance');
        break;
      case 'material':
        onMenuSelect && onMenuSelect('Material');
        break;
      case 'notice':
        onMenuSelect && onMenuSelect('Notice');
        break;
      case 'marks':
        onMenuSelect && onMenuSelect('Marks');
        break;
      default:
        break;
    }
  };

  const recentActivities = [
    { title: 'Attended Data Structures class', time: '2 hours ago', type: 'attendance', icon: FiCheckCircle },
    { title: 'Downloaded new assignment', time: '4 hours ago', type: 'material', icon: FiBook },
    { title: 'New notice received', time: '1 day ago', type: 'notice', icon: FiBell },
    { title: 'Exam results published', time: '3 days ago', type: 'exam', icon: MdGrade }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <EnhancedDashboard
      userRole="student"
      stats={stats}
      recentActivities={recentActivities}
      onQuickAction={handleQuickAction}
    />
  );
};

export default StudentDashboardEnhanced;