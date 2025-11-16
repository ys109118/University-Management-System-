import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import Student from "./Student";
import Faculty from "./Faculty";
import Subjects from "./Subject";
import Admin from "./Admin";
import Branch from "./Branch";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Profile from "./Profile";
import Exam from "../Exam";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUsers, FiUserCheck, FiBook, FiBell, FiSettings, FiBarChart2, FiShield, FiHome, FiGitBranch } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", component: null, icon: FiHome },
  { id: "student", label: "Students", component: Student, icon: FiUsers },
  { id: "faculty", label: "Faculty", component: Faculty, icon: FiUserCheck },
  { id: "branch", label: "Branches", component: Branch, icon: FiGitBranch },
  { id: "subjects", label: "Subjects", component: Subjects, icon: FiBook },
  { id: "notice", label: "Notices", component: Notice, icon: FiBell },
  { id: "exam", label: "Exams", component: Exam, icon: FiBarChart2 },
  { id: "admin", label: "Admins", component: Admin, icon: FiShield },
];

const AdminDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalBranches: 0,
    totalSubjects: 0
  });

  useEffect(() => {
    // Fetch actual stats from API
    const fetchStats = async () => {
      try {
        const [studentsRes, facultyRes, branchesRes, subjectsRes] = await Promise.all([
          axiosWrapper.get('/student'),
          axiosWrapper.get('/faculty'),
          axiosWrapper.get('/branch'),
          axiosWrapper.get('/subject')
        ]);
        
        setStats({
          totalStudents: studentsRes.data?.data?.length || 0,
          totalFaculty: facultyRes.data?.data?.length || 0,
          totalBranches: branchesRes.data?.data?.length || 0,
          totalSubjects: subjectsRes.data?.data?.length || 0
        });
      } catch (error) {
        console.log('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Control Center</h1>
            <p className="text-red-100 text-lg">Complete system management and oversight</p>
          </div>
          <div className="hidden md:block">
            <FiShield className="text-6xl text-white/30" />
          </div>
        </div>
      </div>

      {/* Stats Grid - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => onNavigate('student')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-xl cursor-pointer hover:shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold">{stats.totalStudents}</p>
              <p className="text-blue-200 text-xs mt-1">Click to manage</p>
            </div>
            <FiUsers className="text-3xl text-blue-200" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('faculty')}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-xl cursor-pointer hover:shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Faculty</p>
              <p className="text-3xl font-bold">{stats.totalFaculty}</p>
              <p className="text-emerald-200 text-xs mt-1">Click to manage</p>
            </div>
            <FiUserCheck className="text-3xl text-emerald-200" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('branch')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-xl cursor-pointer hover:shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Branches</p>
              <p className="text-3xl font-bold">{stats.totalBranches}</p>
              <p className="text-purple-200 text-xs mt-1">Click to manage</p>
            </div>
            <FiGitBranch className="text-3xl text-purple-200" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('subjects')}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-xl cursor-pointer hover:shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Subjects</p>
              <p className="text-3xl font-bold">{stats.totalSubjects}</p>
              <p className="text-orange-200 text-xs mt-1">Click to manage</p>
            </div>
            <FiBook className="text-3xl text-orange-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/40 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <FiUsers className="text-2xl mb-2 mx-auto" />
            <span className="text-sm font-medium">Add Student</span>
          </button>
          <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <FiUserCheck className="text-2xl mb-2 mx-auto" />
            <span className="text-sm font-medium">Add Faculty</span>
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <FiBook className="text-2xl mb-2 mx-auto" />
            <span className="text-sm font-medium">Add Subject</span>
          </button>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <FiBell className="text-2xl mb-2 mx-auto" />
            <span className="text-sm font-medium">Send Notice</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/40 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">System Status</span>
            </div>
            <span className="text-green-600 font-semibold">Online</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium">Database</span>
            </div>
            <span className="text-blue-600 font-semibold">Connected</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="font-medium">Security</span>
            </div>
            <span className="text-purple-600 font-semibold">Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");
  const { isDarkMode } = useTheme();

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axiosWrapper.get(`/admin/my-details`);
      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      }
    } catch (error) {
      toast.error("Error fetching user details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch, userToken]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pathMenuId = urlParams.get("page") || "dashboard";
    const validMenu = MENU_ITEMS.find((item) => item.id === pathMenuId);
    setSelectedMenu(validMenu ? validMenu.id : "dashboard");
  }, [location.pathname]);

  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu === menuId;
    return `
      text-center px-6 py-4 cursor-pointer
      font-semibold text-sm w-full
      rounded-2xl
      transition-all duration-300 ease-in-out
      transform hover:scale-105
      ${
        isSelected
          ? "bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white shadow-2xl scale-105 border-2 border-white/20"
          : isDarkMode 
            ? "bg-gray-700/80 backdrop-blur-sm text-gray-200 hover:bg-gray-600 shadow-lg border border-gray-600/50 hover:shadow-xl"
            : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-lg border border-gray-200/50 hover:shadow-xl"
      }
    `;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <span className="ml-3 text-lg text-gray-600">Loading...</span>
        </div>
      );
    }

    if (selectedMenu === "dashboard") {
      return <AdminDashboard />;
    }

    const MenuItem = MENU_ITEMS.find((item) => item.id === selectedMenu)?.component;
    return MenuItem && <MenuItem />;
  };

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    navigate(`/admin?page=${menuId}`);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-red-50 via-pink-50 to-purple-50'
    }`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Navigation */}
        <div className={`backdrop-blur-lg rounded-3xl shadow-2xl border p-6 mb-8 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/60 border-gray-700/20' 
            : 'bg-white/60 border-white/20'
        }`}>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={getMenuItemClass(item.id)}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon className="text-xl" />
                    <span className="text-xs">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className={`backdrop-blur-lg rounded-3xl shadow-2xl border p-8 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/40 border-gray-700/20' 
            : 'bg-white/40 border-white/20'
        }`}>
          {renderContent()}
        </div>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: isDarkMode ? '#fff' : '#fff',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
          },
        }}
      />
    </div>
  );
};

export default Home;