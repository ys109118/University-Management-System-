import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  FiHome, 
  FiUsers, 
  FiUserCheck, 
  FiBookOpen, 
  FiBook, 
  FiBell, 
  FiClipboard, 
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiBarChart2,
  FiShield,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiMoon,
  FiSun,
  FiLogOut,
  FiUser
} from 'react-icons/fi';
import { HiAcademicCap, HiOutlineHome } from 'react-icons/hi';
import { MdSchool, MdDashboard } from 'react-icons/md';

const ModernSidebar = ({ selectedMenu, onMenuSelect, userRole = 'admin' }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({ academic: true, management: true });
  const [isMobile, setIsMobile] = useState(false);
  const [notifications] = useState({ notices: 3, exams: 1, materials: 2 });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuGroups = {
    admin: {
      overview: {
        title: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: MdDashboard, color: 'text-blue-500' }
        ]
      },
      academic: {
        title: 'Academic Management',
        items: [
          { id: 'students', label: 'Students', icon: FiUsers, color: 'text-green-500' },
          { id: 'faculty', label: 'Faculty', icon: HiAcademicCap, color: 'text-purple-500' },
          { id: 'branches', label: 'Branches', icon: MdSchool, color: 'text-orange-500' },
          { id: 'subjects', label: 'Subjects', icon: FiBook, color: 'text-indigo-500' }
        ]
      },
      management: {
        title: 'System Management',
        items: [
          { id: 'notices', label: 'Notices', icon: FiBell, color: 'text-yellow-500', badge: notifications.notices },
          { id: 'exams', label: 'Exams', icon: FiClipboard, color: 'text-red-500', badge: notifications.exams },
          { id: 'hostel', label: 'Hostel', icon: HiOutlineHome, color: 'text-teal-500' },
          { id: 'admins', label: 'Admins', icon: FiShield, color: 'text-gray-500' }
        ]
      }
    },
    faculty: {
      overview: {
        title: 'Overview',
        items: [
          { id: 'home', label: 'Home', icon: FiHome, color: 'text-blue-500' }
        ]
      },
      academic: {
        title: 'Academic',
        items: [
          { id: 'timetable', label: 'Timetable', icon: FiClipboard, color: 'text-green-500' },
          { id: 'material', label: 'Material', icon: FiBookOpen, color: 'text-purple-500', badge: notifications.materials },
          { id: 'attendance', label: 'Attendance', icon: FiUserCheck, color: 'text-orange-500' },
          { id: 'student info', label: 'Student Info', icon: FiUsers, color: 'text-indigo-500' }
        ]
      },
      management: {
        title: 'Management',
        items: [
          { id: 'notice', label: 'Notice', icon: FiBell, color: 'text-yellow-500', badge: notifications.notices },
          { id: 'marks', label: 'Marks', icon: FiBarChart2, color: 'text-red-500' },
          { id: 'exam', label: 'Exam', icon: FiClipboard, color: 'text-gray-500', badge: notifications.exams }
        ]
      }
    },
    student: {
      overview: {
        title: 'Overview',
        items: [
          { id: 'home', label: 'Home', icon: FiHome, color: 'text-blue-500' }
        ]
      },
      academic: {
        title: 'Academic',
        items: [
          { id: 'timetable', label: 'Timetable', icon: FiClipboard, color: 'text-green-500' },
          { id: 'material', label: 'Material', icon: FiBookOpen, color: 'text-purple-500', badge: notifications.materials },
          { id: 'attendance', label: 'Attendance', icon: FiUserCheck, color: 'text-orange-500' },
          { id: 'marks', label: 'Marks', icon: FiBarChart2, color: 'text-red-500' }
        ]
      },
      management: {
        title: 'Information',
        items: [
          { id: 'notice', label: 'Notice', icon: FiBell, color: 'text-yellow-500', badge: notifications.notices },
          { id: 'exam', label: 'Exam', icon: FiClipboard, color: 'text-indigo-500', badge: notifications.exams },
          { id: 'hostel', label: 'Hostel', icon: HiOutlineHome, color: 'text-teal-500' }
        ]
      }
    }
  };

  const currentMenuGroups = menuGroups[userRole] || menuGroups.admin;

  const handleMenuClick = (menuId) => {
    onMenuSelect(menuId);
    if (isMobile) setIsCollapsed(true);
  };

  const getUserInfo = () => {
    const userInfo = {
      admin: { name: 'Admin User', email: 'admin@gmail.com', avatar: 'A' },
      faculty: { name: 'Faculty User', email: 'faculty@gmail.com', avatar: 'F' },
      student: { name: 'Student User', email: 'student@gmail.com', avatar: 'S' }
    };
    return userInfo[userRole] || userInfo.admin;
  };

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const getFilteredItems = () => {
    if (!searchQuery) return currentMenuGroups;
    
    const filtered = {};
    Object.entries(currentMenuGroups).forEach(([groupKey, group]) => {
      const filteredItems = group.items.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredItems.length > 0) {
        filtered[groupKey] = { ...group, items: filteredItems };
      }
    });
    return filtered;
  };

  const renderBadge = (count) => {
    if (!count || isCollapsed) return null;
    return (
      <span className={`ml-auto px-1.5 py-0.5 text-xs font-semibold rounded-full ${
        isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
      }`}>
        {count}
      </span>
    );
  };

  return (
    <div className={`fixed left-0 top-0 z-50 ${isCollapsed ? 'w-16' : 'w-72'} h-screen transition-all duration-300 ease-in-out flex flex-col ${
      isDarkMode 
        ? 'bg-gray-950/95 border-gray-800/50' 
        : 'bg-white/95 border-gray-200/50'
    } backdrop-blur-xl border-r shadow-[0_20px_60px_rgba(0,0,0,0.08)]`}>
      
      {/* Header */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800/30' : 'border-gray-200/50'}`}>
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <MdSchool className="text-white text-xl" />
              </div>
              <div>
                <h1 className={`font-bold text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  EduManage
                </h1>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>
                  {userRole} Portal
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            {!isMobile && (
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isDarkMode 
                    ? 'hover:bg-gray-800/60 text-gray-400 hover:text-yellow-400' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-blue-600'
                }`}
              >
                {isDarkMode ? <FiSun className="text-sm" /> : <FiMoon className="text-sm" />}
              </button>
            )}
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isDarkMode 
                  ? 'hover:bg-gray-800/60 text-gray-400 hover:text-gray-200' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              {isCollapsed ? <FiChevronRight className="text-sm" /> : <FiChevronLeft className="text-sm" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="relative">
            <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800/40 border-gray-700/50 text-gray-200 placeholder-gray-500 focus:bg-gray-800/60 focus:border-blue-500/50' 
                  : 'bg-gray-50 border-gray-200/50 text-gray-700 placeholder-gray-400 focus:bg-white focus:border-blue-300'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
        {Object.entries(getFilteredItems()).map(([groupKey, group]) => (
          <div key={groupKey} className="mb-6">
            {!isCollapsed && group.title && (
              <button
                onClick={() => toggleGroup(groupKey)}
                className={`w-full flex items-center justify-between px-3 py-2 mb-2 rounded-xl transition-all duration-200 ${
                  isDarkMode 
                    ? 'hover:bg-gray-800/30 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {group.title}
                </span>
                {expandedGroups[groupKey] ? 
                  <FiChevronUp className="text-xs" /> : 
                  <FiChevronDown className="text-xs" />
                }
              </button>
            )}
            
            <div className={`space-y-1 transition-all duration-300 overflow-hidden ${
              !isCollapsed && !expandedGroups[groupKey] ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
            }`}>
              {group.items.map((item) => {
                const isActive = selectedMenu.toLowerCase() === item.id.toLowerCase();
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative transform ${
                      isActive
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/10 text-blue-400 shadow-lg shadow-blue-600/5 scale-[1.02]'
                          : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-lg shadow-blue-100/30 scale-[1.02]'
                        : isDarkMode
                          ? 'hover:bg-gray-800/30 text-gray-400 hover:text-gray-200 hover:scale-[1.01]'
                          : 'hover:bg-gray-50/70 text-gray-600 hover:text-gray-800 hover:scale-[1.01]'
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
                        isDarkMode ? 'bg-gradient-to-b from-blue-400 to-purple-400' : 'bg-gradient-to-b from-blue-600 to-indigo-600'
                      }`}></div>
                    )}
                    
                    <div className={`flex-shrink-0 ${isActive ? item.color : ''} ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    } transition-all duration-200`}>
                      <item.icon className={`${isCollapsed ? 'text-lg' : 'text-base'}`} />
                    </div>
                    
                    {!isCollapsed && (
                      <>
                        <span className="font-medium text-sm tracking-wide truncate flex-1 text-left">
                          {item.label}
                        </span>
                        {renderBadge(item.badge)}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800/30' : 'border-gray-200/50'} space-y-3`}>
        {/* User Profile */}
        {!isCollapsed && (
          <div className={`p-3 rounded-xl transition-all duration-200 ${
            isDarkMode ? 'bg-gray-800/20 hover:bg-gray-800/30' : 'bg-gray-50/60 hover:bg-gray-100/60'
          }`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">{getUserInfo().avatar}</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {getUserInfo().name}
                </p>
                <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {getUserInfo().email}
                </p>
              </div>
              <button className={`p-1.5 rounded-lg transition-all duration-200 ${
                isDarkMode ? 'hover:bg-gray-700/50 text-gray-400' : 'hover:bg-gray-200/50 text-gray-500'
              }`}>
                <FiUser className="text-sm" />
              </button>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleMenuClick('Settings')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-800/40 text-gray-400 hover:text-gray-200' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiSettings className={`${isCollapsed ? 'text-lg' : 'text-sm'}`} />
            {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
          </button>
          
          {!isCollapsed && (
            <button className={`px-3 py-2.5 rounded-xl transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-red-900/20 text-gray-400 hover:text-red-400' 
                : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
            }`}>
              <FiLogOut className="text-sm" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernSidebar;