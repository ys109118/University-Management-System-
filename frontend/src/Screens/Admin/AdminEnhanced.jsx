import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ModernSidebar from '../../components/ModernSidebar';
import AdminDashboardEnhanced from './AdminDashboardEnhanced';
import Student from './Student';
import Faculty from './Faculty';
import Branch from './Branch';
import Subject from './Subject';
import Notice from '../Notice';
import Exam from '../Exam';
import Profile from './Profile';
import HostelManagement from './HostelManagement';
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/actions';
import axiosWrapper from '../../utils/AxiosWrapper';

const AdminEnhanced = () => {
  const { isDarkMode } = useTheme();
  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const [profileData, setProfileData] = useState(null);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem('userToken');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosWrapper.get('/admin/my-details', {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.success) {
          setProfileData(response.data.data);
          dispatch(setUserData(response.data.data));
        }
      } catch (error) {
        toast.error('Failed to load profile');
      }
    };

    fetchUserDetails();
  }, [dispatch, userToken]);

  const renderContent = () => {
    switch (selectedMenu.toLowerCase()) {
      case 'dashboard':
        return <AdminDashboardEnhanced onMenuSelect={setSelectedMenu} />;
      case 'students':
        return <Student />;
      case 'faculty':
        return <Faculty />;
      case 'branches':
        return <Branch />;
      case 'subjects':
        return <Subject />;
      case 'notices':
        return <Notice />;
      case 'exams':
        return <Exam />;
      case 'admins':
        return profileData ? <Profile profileData={profileData} /> : <div>Loading...</div>;
      case 'hostel':
        return <HostelManagement />;
      default:
        return <AdminDashboardEnhanced onMenuSelect={setSelectedMenu} />;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Fixed Sidebar */}
      <ModernSidebar 
        selectedMenu={selectedMenu}
        onMenuSelect={setSelectedMenu}
        userRole="admin"
      />
      
      {/* Main Content with left margin */}
      <div className="ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Top Bar */}
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
                {selectedMenu === 'Dashboard' ? 'Welcome to your admin dashboard' : `Manage ${selectedMenu.toLowerCase()}`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-xl transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5v5z" />
                  </svg>
                </button>
                
                <button className={`p-2 rounded-xl transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  </svg>
                </button>
              </div>
              
              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {profileData?.firstName?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
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

export default AdminEnhanced;