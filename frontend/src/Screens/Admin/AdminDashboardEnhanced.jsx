import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiUsers, 
  FiUserPlus, 
  FiSettings, 
  FiBarChart2,
  FiTrendingUp,
  FiShield,
  FiDatabase
} from 'react-icons/fi';
import { 
  HiAcademicCap, 
  HiOfficeBuildingIcon,
  HiChartBar 
} from 'react-icons/hi';
import { MdSchool, MdSupervisorAccount } from 'react-icons/md';
import EnhancedDashboard from '../../components/EnhancedDashboard';
import axiosWrapper from '../../utils/AxiosWrapper';
import toast from 'react-hot-toast';

const AdminDashboardEnhanced = ({ onMenuSelect }) => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const userToken = localStorage.getItem('userToken');

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple endpoints for comprehensive stats
      const [facultyRes, studentRes, branchRes] = await Promise.all([
        axiosWrapper.get('/faculty', { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get('/student', { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get('/branch', { headers: { Authorization: `Bearer ${userToken}` } })
      ]);

      const facultyCount = facultyRes.data.success ? facultyRes.data.data.length : 0;
      const studentCount = studentRes.data.success ? studentRes.data.data.length : 0;
      const branchCount = branchRes.data.success ? branchRes.data.data.length : 0;

      setStats({
        totalFaculty: facultyCount,
        totalStudents: studentCount,
        activeBranches: branchCount,
        systemHealth: '98%'
      });
    } catch (error) {
      toast.error('Failed to fetch admin statistics');
      console.error('Admin stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'faculty':
        onMenuSelect && onMenuSelect('Faculty');
        break;
      case 'students':
        onMenuSelect && onMenuSelect('Student');
        break;
      case 'branches':
        onMenuSelect && onMenuSelect('Branch');
        break;
      case 'reports':
        // Handle reports action
        toast.info('Reports feature coming soon!');
        break;
      default:
        break;
    }
  };

  const recentActivities = [
    { title: 'New faculty member added', time: '2 hours ago', type: 'faculty', icon: HiAcademicCap },
    { title: 'Student enrollment completed', time: '4 hours ago', type: 'student', icon: FiUsers },
    { title: 'Branch configuration updated', time: '1 day ago', type: 'branch', icon: MdSchool },
    { title: 'System backup completed', time: '2 days ago', type: 'system', icon: FiDatabase }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <EnhancedDashboard
      userRole="admin"
      stats={stats}
      recentActivities={recentActivities}
      onQuickAction={handleQuickAction}
    />
  );
};

export default AdminDashboardEnhanced;