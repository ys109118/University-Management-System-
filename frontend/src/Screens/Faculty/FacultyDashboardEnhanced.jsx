import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiUsers, 
  FiBook, 
  FiCheckCircle, 
  FiBell,
  FiCalendar
} from 'react-icons/fi';
import { 
  HiClipboardCheck, 
  HiDocumentText 
} from 'react-icons/hi';
import { MdSchedule, MdAssignment } from 'react-icons/md';
import EnhancedDashboard from '../../components/EnhancedDashboard';
import axiosWrapper from '../../utils/AxiosWrapper';
import toast from 'react-hot-toast';

const FacultyDashboardEnhanced = ({ onMenuSelect }) => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const userToken = localStorage.getItem('userToken');

  useEffect(() => {
    fetchFacultyStats();
  }, []);

  const fetchFacultyStats = async () => {
    try {
      setLoading(true);
      
      // Fetch faculty-specific stats
      const [materialsRes, studentsRes] = await Promise.all([
        axiosWrapper.get('/material', { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get('/student', { headers: { Authorization: `Bearer ${userToken}` } })
      ]);

      const materialsCount = materialsRes.data.success ? materialsRes.data.data.length : 0;
      const studentsCount = studentsRes.data.success ? studentsRes.data.data.length : 0;

      // Calculate today's classes (mock data for now)
      const today = new Date().getDay();
      const classesToday = today >= 1 && today <= 5 ? Math.floor(Math.random() * 4) + 2 : 0;

      setStats({
        totalStudents: studentsCount,
        classesToday: classesToday,
        materialsUploaded: materialsCount,
        attendanceRate: '85%'
      });
    } catch (error) {
      toast.error('Failed to fetch faculty statistics');
      console.error('Faculty stats error:', error);
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
      case 'timetable':
        onMenuSelect && onMenuSelect('Timetable');
        break;
      default:
        break;
    }
  };

  const recentActivities = [
    { title: 'Attendance marked for CS-A', time: '2 hours ago', type: 'attendance', icon: FiCheckCircle },
    { title: 'New material uploaded', time: '4 hours ago', type: 'material', icon: FiBook },
    { title: 'Notice published', time: '1 day ago', type: 'notice', icon: FiBell },
    { title: 'Timetable updated', time: '2 days ago', type: 'timetable', icon: MdSchedule }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <EnhancedDashboard
      userRole="faculty"
      stats={stats}
      recentActivities={recentActivities}
      onQuickAction={handleQuickAction}
    />
  );
};

export default FacultyDashboardEnhanced;