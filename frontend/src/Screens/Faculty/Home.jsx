import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Timetable from "./Timetable";
import Material from "./Material";
import StudentFinder from "./StudentFinder";
import Profile from "./Profile";
import Marks from "./AddMarks";
import Attendance from "./Attendance";
import Exam from "../Exam";
import { useTheme } from "../../context/ThemeContext";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: null },
  { id: "timetable", label: "Timetable", component: Timetable },
  { id: "material", label: "Material", component: Material },
  { id: "attendance", label: "Attendance", component: Attendance },
  { id: "notice", label: "Notice", component: Notice },
  { id: "student info", label: "Student Info", component: StudentFinder },
  { id: "marks", label: "Marks", component: Marks },
  { id: "exam", label: "Exam", component: Exam },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const [profileData, setProfileData] = useState(null);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosWrapper.get("/faculty/my-details", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.success) {
          setProfileData(response.data.data);
          dispatch(setUserData(response.data.data));
        }
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };

    fetchUserDetails();
  }, [dispatch, userToken]);

  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu.toLowerCase() === menuId.toLowerCase();
    return `text-center px-8 py-4 cursor-pointer font-semibold text-sm w-full rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 ${
      isSelected
        ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-2xl scale-105 border-2 border-white/20"
        : isDarkMode 
          ? "bg-gray-700/80 backdrop-blur-sm text-gray-200 hover:bg-gray-600 shadow-lg border border-gray-600/50 hover:shadow-xl"
          : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-lg border border-gray-200/50 hover:shadow-xl"
    }`;
  };

  const renderContent = () => {
    if (selectedMenu === "Home") {
      // Import and use FacultyDashboardEnhanced
      const FacultyDashboardEnhanced = require('./FacultyDashboardEnhanced').default;
      return <FacultyDashboardEnhanced onMenuSelect={setSelectedMenu} />;
    }

    const menuItem = MENU_ITEMS.find(
      (item) => item.label.toLowerCase() === selectedMenu.toLowerCase()
    );

    if (menuItem && menuItem.component) {
      const Component = menuItem.component;
      return <Component />;
    }

    return null;
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
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
                onClick={() => setSelectedMenu(item.label)}
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
