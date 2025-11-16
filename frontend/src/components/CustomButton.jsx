import React from "react";
import { useTheme } from "../context/ThemeContext";

const CustomButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
}) => {
  const { isDarkMode } = useTheme();
  
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl";
      case "secondary":
        return isDarkMode 
          ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 hover:border-gray-500" 
          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400";
      case "danger":
        return "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl";
      case "success":
        return "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl";
      case "warning":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl";
      case "ghost":
        return isDarkMode
          ? "text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500"
          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-300 hover:border-gray-400";
      case "outline":
        return isDarkMode
          ? "border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
          : "border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700";
      default:
        return "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl";
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "px-2 py-1 text-xs";
      case "sm":
        return "px-3 py-2 text-sm";
      case "md":
        return "px-4 py-2.5 text-sm";
      case "lg":
        return "px-6 py-3 text-base";
      case "xl":
        return "px-8 py-4 text-lg";
      default:
        return "px-4 py-2.5 text-sm";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${getSizeClasses()}
        rounded-xl
        font-semibold
        transition-all duration-300 ease-in-out
        transform hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        flex items-center justify-center gap-2
        focus:outline-none focus:ring-4 focus:ring-blue-500/20
        ${getVariantClasses()}
        ${className}
      `}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      )}
      {children}
    </button>
  );
};

export default CustomButton;
