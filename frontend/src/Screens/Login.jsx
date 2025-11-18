import React, { useState, useEffect } from "react";
import { FiLogIn, FiUser, FiMail, FiLock, FiBook, FiSettings, FiEye, FiEyeOff, FiShield, FiUsers, FiMoon, FiSun } from "react-icons/fi";
import { HiAcademicCap, HiOfficeBuilding } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setUserToken } from "../redux/actions";
import { useDispatch } from "react-redux";
import CustomButton from "../components/CustomButton";
import axiosWrapper from "../utils/AxiosWrapper";

const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty", 
  ADMIN: "Admin",
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [selected, setSelected] = useState(USER_TYPES.STUDENT);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleUserTypeSelect = (type) => {
    setSelected(type);
    setSearchParams({ type: type.toLowerCase() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosWrapper.post(
        `/${selected.toLowerCase()}/login`,
        formData
      );

      const { token, user } = response.data.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", selected);
      localStorage.setItem("userData", JSON.stringify(user));
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
      dispatch(setUserToken(token));
      toast.success(`Welcome back, ${selected}!`);
      navigate(`/${selected.toLowerCase()}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
    }
  }, [navigate]);

  useEffect(() => {
    if (type) {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      setSelected(capitalizedType);
    }
  }, [type]);

  const getUserIcon = () => {
    switch (selected) {
      case "Student": return <HiAcademicCap className="text-2xl" />;
      case "Faculty": return <FiUsers className="text-2xl" />;
      case "Admin": return <FiShield className="text-2xl" />;
      default: return <FiUser className="text-2xl" />;
    }
  };

  const getThemeColors = () => {
    switch (selected) {
      case "Student": return {
        gradient: "from-blue-500 to-cyan-500",
        bg: "from-blue-600 to-cyan-600",
        ring: "ring-blue-500",
        leftBg: "from-blue-600 to-cyan-700"
      };
      case "Faculty": return {
        gradient: "from-emerald-500 to-teal-500", 
        bg: "from-emerald-600 to-teal-600",
        ring: "ring-emerald-500",
        leftBg: "from-emerald-600 to-teal-700"
      };
      case "Admin": return {
        gradient: "from-red-500 to-pink-500",
        bg: "from-red-600 to-pink-600", 
        ring: "ring-red-500",
        leftBg: "from-red-600 to-pink-700"
      };
      default: return {
        gradient: "from-blue-500 to-indigo-500",
        bg: "from-blue-600 to-indigo-600",
        ring: "ring-blue-500",
        leftBg: "from-blue-600 to-indigo-700"
      };
    }
  };

  const getUserTypeDescription = () => {
    switch (selected) {
      case "Student": return "Access your courses, grades, and academic resources";
      case "Faculty": return "Manage classes, students, and academic content";
      case "Admin": return "Full system administration and management control";
      default: return "Sign in to continue";
    }
  };

  const colors = getThemeColors();

  return (
    <div className={`min-h-screen flex transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-black via-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'
    }`}>
      {/* Dark Mode Toggle - Fixed Position */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl"
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
      </button>
      {/* Left Side - Dynamic Branding */}
      <div className={`hidden lg:flex lg:w-1/2 p-12 flex-col justify-center items-center text-white relative overflow-hidden transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
          : `bg-gradient-to-br ${colors.leftBg}`
      }`}>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-bounce"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="mb-12">
            <div className={`w-28 h-28 bg-gradient-to-r ${colors.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-110 transition-all duration-300`}>
              <HiOfficeBuilding className="text-5xl text-white" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              EduManage Pro
            </h1>
            <p className="text-2xl text-white/80 mb-12 font-light">
              Next-Generation College Management
            </p>
          </div>
          
          {/* Dynamic Features Based on User Type */}
          <div className="space-y-6 text-left max-w-lg">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4 text-white">
                {selected} Portal Features
              </h3>
              <div className="space-y-3">
                {selected === "Student" && (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
                      <span className="text-white/90">Interactive Course Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
                      <span className="text-white/90">Real-time Grade Tracking</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
                      <span className="text-white/90">Smart Attendance System</span>
                    </div>
                  </>
                )}
                {selected === "Faculty" && (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                      <span className="text-white/90">Advanced Class Management</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                      <span className="text-white/90">Student Performance Analytics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                      <span className="text-white/90">Digital Content Library</span>
                    </div>
                  </>
                )}
                {selected === "Admin" && (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
                      <span className="text-white/90">System-wide Control Panel</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
                      <span className="text-white/90">Advanced Analytics & Reports</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
                      <span className="text-white/90">Security & Access Management</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className={`w-20 h-20 bg-gradient-to-r ${colors.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
              <HiOfficeBuilding className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">EduManage Pro</h1>
            <p className="text-gray-300">College Management System</p>
          </div>

          <div className={`backdrop-blur-xl rounded-3xl shadow-2xl border p-8 transform hover:scale-[1.02] transition-all duration-300 ${
            isDarkMode 
              ? 'bg-black/20 border-gray-700/30' 
              : 'bg-white/10 border-white/20'
          }`}>
            <div className="text-center mb-8">
              <div className={`w-20 h-20 bg-gradient-to-r ${colors.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl transform hover:rotate-12 transition-all duration-300`}>
                {getUserIcon()}
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
              <p className="text-gray-300 text-sm">{getUserTypeDescription()}</p>
            </div>

            {/* Enhanced User Type Selector */}
            <div className="grid grid-cols-3 gap-3 mb-8 p-2 bg-white/5 rounded-2xl">
              {Object.values(USER_TYPES).map((type) => {
                const isSelected = selected === type;
                const typeColors = type === "Student" ? "blue" : type === "Faculty" ? "emerald" : "red";
                return (
                  <button
                    key={type}
                    onClick={() => handleUserTypeSelect(type)}
                    className={`py-4 px-4 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isSelected
                        ? `bg-gradient-to-r from-${typeColors}-500 to-${typeColors}-600 text-white shadow-lg scale-105`
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      {type === "Student" && <HiAcademicCap className="text-lg" />}
                      {type === "Faculty" && <FiUsers className="text-lg" />}
                      {type === "Admin" && <FiShield className="text-lg" />}
                      <span className="text-xs">{type}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Enhanced Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors" />
                  <input
                    type="email"
                    required
                    className={`w-full pl-12 pr-4 py-4 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:${colors.ring} focus:border-transparent transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50' 
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setIsTyping(true);
                      setTimeout(() => setIsTyping(false), 1000);
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className={`w-full pl-12 pr-12 py-4 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:${colors.ring} focus:border-transparent transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50' 
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={`w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded-lg focus:ring-2 focus:${colors.ring} transition-all`} 
                  />
                  <span className="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors">Remember me</span>
                </label>
                <Link to="/forget-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${colors.bg} hover:shadow-2xl text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-xl`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FiLogIn className="text-xl" />
                    <span className="text-lg">Sign In to {selected} Portal</span>
                  </>
                )}
              </button>
            </form>

            {/* Enhanced Footer */}
            <div className="mt-8 text-center space-y-4">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                <span>Secure Login</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>24/7 Support</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>SSL Protected</span>
              </div>
              <p className="text-gray-400 text-sm">
                Need assistance?{" "}
                <a href="mailto:support@edumanage.com" className={`text-${selected === "Admin" ? "pink" : selected === "Faculty" ? "emerald" : "blue"}-400 hover:text-${selected === "Admin" ? "pink" : selected === "Faculty" ? "emerald" : "blue"}-300 font-medium transition-colors`}>
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default Login;