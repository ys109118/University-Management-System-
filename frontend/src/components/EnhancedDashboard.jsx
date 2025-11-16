import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  FiUsers, 
  FiCalendar, 
  FiBook, 
  FiCheckCircle, 
  FiBell, 
  FiUser, 
  FiBarChart2,
  FiTrendingUp,
  FiClock,
  FiAward
} from 'react-icons/fi';
import { 
  HiAcademicCap, 
  HiClipboardCheck, 
  HiDocumentText 
} from 'react-icons/hi';
import { MdSchedule, MdAssignment, MdGrade } from 'react-icons/md';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
      isDarkMode 
        ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/80' 
        : 'bg-white/80 border-gray-200/50 backdrop-blur-sm hover:bg-white'
    } shadow-lg hover:shadow-2xl group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <FiTrendingUp className={`text-sm mr-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-all duration-300`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 text-left w-full ${
        isDarkMode 
          ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/80' 
          : 'bg-white/80 border-gray-200/50 backdrop-blur-sm hover:bg-white'
      } shadow-lg hover:shadow-2xl group`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-all duration-300`}>
          <Icon className="text-xl" />
        </div>
        <div>
          <h3 className={`font-semibold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {title}
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

const RecentActivityItem = ({ title, time, type, icon: Icon }) => {
  const { isDarkMode } = useTheme();
  
  const getTypeColor = (type) => {
    switch (type) {
      case 'attendance': return isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600';
      case 'material': return isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600';
      case 'notice': return isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600';
      case 'exam': return isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600';
      default: return isDarkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-200">
      <div className={`p-2 rounded-lg ${getTypeColor(type)}`}>
        <Icon className="text-sm" />
      </div>
      <div className="flex-1">
        <p className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {title}
        </p>
        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          {time}
        </p>
      </div>
    </div>
  );
};

const EnhancedDashboard = ({ 
  userRole = 'faculty', 
  stats = {}, 
  quickActions = [], 
  recentActivities = [],
  onQuickAction 
}) => {
  const { isDarkMode } = useTheme();
  
  const defaultStats = {
    faculty: [
      { title: 'Total Students', value: stats.totalStudents || '0', icon: FiUsers, color: isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600', trend: 'up', trendValue: '+5%' },
      { title: 'Classes Today', value: stats.classesToday || '0', icon: MdSchedule, color: isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600' },
      { title: 'Materials Uploaded', value: stats.materialsUploaded || '0', icon: FiBook, color: isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600', trend: 'up', trendValue: '+12%' },
      { title: 'Attendance Rate', value: stats.attendanceRate || '0%', icon: FiCheckCircle, color: isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600' }
    ],
    student: [
      { title: 'Attendance Rate', value: stats.attendanceRate || '0%', icon: FiCheckCircle, color: isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600', trend: 'up', trendValue: '+2%' },
      { title: 'Assignments Due', value: stats.assignmentsDue || '0', icon: MdAssignment, color: isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600' },
      { title: 'Current CGPA', value: stats.cgpa || '0.0', icon: MdGrade, color: isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600', trend: 'up', trendValue: '+0.2' },
      { title: 'New Notices', value: stats.newNotices || '0', icon: FiBell, color: isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600' }
    ],
    admin: [
      { title: 'Total Faculty', value: stats.totalFaculty || '0', icon: HiAcademicCap, color: isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600' },
      { title: 'Total Students', value: stats.totalStudents || '0', icon: FiUsers, color: isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600', trend: 'up', trendValue: '+8%' },
      { title: 'Active Branches', value: stats.activeBranches || '0', icon: FiBarChart2, color: isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600' },
      { title: 'System Health', value: stats.systemHealth || '100%', icon: FiAward, color: isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600' }
    ]
  };
  
  const defaultQuickActions = {
    faculty: [
      { title: 'Mark Attendance', description: 'Record student attendance for today', icon: HiClipboardCheck, color: isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600', action: 'attendance' },
      { title: 'Upload Material', description: 'Share study materials with students', icon: FiBook, color: isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600', action: 'material' },
      { title: 'Create Notice', description: 'Send announcements to students', icon: FiBell, color: isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600', action: 'notice' },
      { title: 'View Timetable', description: 'Check your class schedule', icon: MdSchedule, color: isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600', action: 'timetable' }
    ],
    student: [
      { title: 'View Attendance', description: 'Check your attendance record', icon: FiCheckCircle, color: isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600', action: 'attendance' },
      { title: 'Study Materials', description: 'Access course materials and notes', icon: FiBook, color: isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600', action: 'material' },
      { title: 'View Notices', description: 'Read latest announcements', icon: FiBell, color: isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600', action: 'notice' },
      { title: 'Check Marks', description: 'View your exam results', icon: MdGrade, color: isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600', action: 'marks' }
    ],
    admin: [
      { title: 'Manage Faculty', description: 'Add or edit faculty members', icon: HiAcademicCap, color: isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600', action: 'faculty' },
      { title: 'Manage Students', description: 'Add or edit student records', icon: FiUsers, color: isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600', action: 'students' },
      { title: 'System Reports', description: 'View system analytics', icon: FiBarChart2, color: isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600', action: 'reports' },
      { title: 'Manage Branches', description: 'Configure academic branches', icon: HiDocumentText, color: isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600', action: 'branches' }
    ]
  };
  
  const currentStats = defaultStats[userRole] || defaultStats.faculty;
  const currentQuickActions = quickActions.length > 0 ? quickActions : defaultQuickActions[userRole] || defaultQuickActions.faculty;
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`p-8 rounded-2xl border ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800/60 to-gray-700/60 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-gradient-to-r from-white/80 to-gray-50/80 border-gray-200/50 backdrop-blur-sm'
      } shadow-xl`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Welcome Back! 👋
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Here's what's happening with your {userRole} dashboard today.
            </p>
          </div>
          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <FiClock className="text-3xl" />
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuickActions.map((action, index) => (
              <QuickActionCard 
                key={index} 
                {...action} 
                onClick={() => onQuickAction && onQuickAction(action.action)}
              />
            ))}
          </div>
        </div>
        
        {/* Recent Activity */}
        <div>
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Recent Activity
          </h2>
          <div className={`p-6 rounded-2xl border ${
            isDarkMode 
              ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' 
              : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'
          } shadow-lg`}>
            <div className="space-y-2">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <RecentActivityItem key={index} {...activity} />
                ))
              ) : (
                <>
                  <RecentActivityItem 
                    title="Attendance marked for CS-A" 
                    time="2 hours ago" 
                    type="attendance" 
                    icon={FiCheckCircle} 
                  />
                  <RecentActivityItem 
                    title="New material uploaded" 
                    time="4 hours ago" 
                    type="material" 
                    icon={FiBook} 
                  />
                  <RecentActivityItem 
                    title="Notice published" 
                    time="1 day ago" 
                    type="notice" 
                    icon={FiBell} 
                  />
                  <RecentActivityItem 
                    title="Exam scheduled" 
                    time="2 days ago" 
                    type="exam" 
                    icon={HiClipboardCheck} 
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;