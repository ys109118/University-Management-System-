import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Timetable from "./Timetable";
import Material from "./Material";
import Profile from "./Profile";
import Exam from "../Exam";
import ViewMarks from "./ViewMarks";
import Attendance from "./Attendance";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: null },
  { id: "timetable", label: "Timetable", component: Timetable },
  { id: "material", label: "Material", component: Material },
  { id: "attendance", label: "Attendance", component: Attendance },
  { id: "notice", label: "Notice", component: Notice },
  { id: "exam", label: "Exam", component: Exam },
  { id: "marks", label: "Marks", component: ViewMarks },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      toast.loading("Loading user details...");
      const response = await axiosWrapper.get(`/student/my-details`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error fetching user details"
      );
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch, userToken]);

  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu.toLowerCase() === menuId.toLowerCase();
    return `
      text-center px-8 py-4 cursor-pointer
      font-semibold text-sm w-full
      rounded-2xl
      transition-all duration-300 ease-in-out
      transform hover:scale-105
      ${
        isSelected
          ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-2xl scale-105 border-2 border-white/20"
          : isDarkMode 
            ? "bg-gray-700/80 backdrop-blur-sm text-gray-200 hover:bg-gray-600 shadow-lg border border-gray-600/50 hover:shadow-xl"
            : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-lg border border-gray-200/50 hover:shadow-xl"
      }
    `;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">Loading...</div>
      );
    }

    if (selectedMenu === "home") {
      // Import and use StudentDashboardEnhanced
      const StudentDashboardEnhanced = require('./StudentDashboardEnhanced').default;
      return <StudentDashboardEnhanced onMenuSelect={(menu) => {
        const menuItem = MENU_ITEMS.find(item => item.label.toLowerCase() === menu.toLowerCase());
        if (menuItem) {
          setSelectedMenu(menuItem.id);
          navigate(`/student?page=${menuItem.id}`);
        }
      }} />;
    }

    const MenuItem = MENU_ITEMS.find(
      (item) => item.label.toLowerCase() === selectedMenu.toLowerCase()
    )?.component;

    return MenuItem && <MenuItem />;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pathMenuId = urlParams.get("page") || "home";
    const validMenu = MENU_ITEMS.find((item) => item.id === pathMenuId);
    setSelectedMenu(validMenu ? validMenu.id : "home");
  }, [location.pathname]);

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    navigate(`/student?page=${menuId}`);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        <div className={`backdrop-blur-lg rounded-3xl shadow-2xl border p-6 mb-8 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/60 border-gray-700/20' 
            : 'bg-white/60 border-white/20'
        }`}>
          <ul className="flex justify-center items-center gap-4 flex-wrap">
            {MENU_ITEMS.map((item) => (
              <li
                key={item.id}
                className={getMenuItemClass(item.id)}
                onClick={() => handleMenuClick(item.id)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className={`backdrop-blur-lg rounded-3xl shadow-2xl border p-8 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/40 border-gray-700/20' 
            : 'bg-white/40 border-white/20'
        }`}>
          {renderContent()}
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Home;
