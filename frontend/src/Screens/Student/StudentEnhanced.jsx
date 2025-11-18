import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ModernSidebar from '../../components/ModernSidebar';
import StudentDashboardEnhanced from './StudentDashboardEnhanced';
import Timetable from './Timetable';
import Material from './Material';
import Attendance from './Attendance';
import Notice from '../Notice';
import Exam from '../Exam';
import ViewMarks from './ViewMarks';
import Profile from './Profile';
import HostelServices from './HostelServices';
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/actions';
import axiosWrapper from '../../utils/AxiosWrapper';

const StudentEnhanced = () => {
  const { isDarkMode } = useTheme();
  const [selectedMenu, setSelectedMenu] = useState('Home');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem('userToken');

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosWrapper.get('/student/my-details', {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.success) {
          setProfileData(response.data.data);
          dispatch(setUserData(response.data.data));
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [dispatch, userToken]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    switch (selectedMenu.toLowerCase()) {
      case 'home':
        return <StudentDashboardEnhanced onMenuSelect={setSelectedMenu} />;
      case 'timetable':
        return <Timetable />;
      case 'material':
        return <Material />;
      case 'attendance':
        return <Attendance />;
      case 'notice':
        return <Notice />;
      case 'exam':
        return <Exam />;
      case 'marks':
        return <ViewMarks />;
      case 'hostel':
        return <HostelServices />;
      default:
        return <StudentDashboardEnhanced onMenuSelect={setSelectedMenu} />;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <ModernSidebar 
        selectedMenu={selectedMenu}
        onMenuSelect={setSelectedMenu}
        userRole="student"
      />
      
      <div className="ml-64 flex flex-col min-h-screen transition-all duration-300">
        <header className={`sticky top-0 z-40 ${
          isDarkMode 
            ? 'bg-gray-900/80 border-gray-800/50' 
            : 'bg-white/80 border-gray-100/50'
        } backdrop-blur-xl border-b px-8 py-5 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {selectedMenu}
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Student Portal - {selectedMenu === 'Home' ? 'Dashboard Overview' : selectedMenu}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {profileData?.firstName?.charAt(0) || 'S'}
                </span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-8">
          <div className={`${
            isDarkMode 
              ? 'bg-gray-800/10 border-gray-700/10' 
              : 'bg-white/40 border-white/20'
          } backdrop-blur-sm rounded-3xl border p-8 shadow-xl min-h-full`}>
            {renderContent()}
          </div>
        </main>
      </div>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default StudentEnhanced;