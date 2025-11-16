import React from "react";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import CustomButton from "./CustomButton";
import { useTheme } from "../context/ThemeContext";
const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();
  
  // Fallback if theme context is not available
  let isDarkMode = false;
  let toggleDarkMode = () => {};
  
  try {
    const theme = useTheme();
    isDarkMode = theme.isDarkMode;
    toggleDarkMode = theme.toggleDarkMode;
  } catch (error) {
    console.log('Theme context not available, using fallback');
  }

  const logouthandler = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <div className={`${isDarkMode ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-black' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'} shadow-2xl px-6 py-4 mb-6 transition-all duration-300`}>
      <div className="max-w-7xl flex justify-between items-center mx-auto">
        <div
          className="font-bold text-2xl flex items-center cursor-pointer text-white hover:text-yellow-300 transition-colors duration-300"
          onClick={() => navigate("/")}
        >
          <div className="mr-3 p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <RxDashboard className="text-xl" />
          </div>
          <div>
            <div className="text-lg">College Management</div>
            <div className="text-sm text-white/80 font-normal">
              {localStorage.getItem("userType")} Dashboard
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm p-3 rounded-xl transition-all duration-300 hover:scale-105"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          </button>
          
          <CustomButton 
            onClick={logouthandler}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-6 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
          >
            <FiLogOut className="text-lg" />
            Logout
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
