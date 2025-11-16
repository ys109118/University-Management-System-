import React, { useEffect, useState } from "react";
import { FiUpload, FiCalendar, FiClock, FiEye } from "react-icons/fi";
import { MdOutlineDelete, MdEdit, MdViewComfy, MdLink, MdSchedule } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { HiAcademicCap } from "react-icons/hi";
import Heading from "../../components/Heading";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import { useTheme } from "../../context/ThemeContext";

const AddTimetableModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  branches,
}) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    branch: initialData?.branch || "",
    semester: initialData?.semester || "",
    file: null,
    previewUrl: initialData?.file || "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border transition-all duration-300`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
              <MdSchedule className="text-2xl" />
            </div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {initialData ? "Edit Timetable" : "Add New Timetable"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-200 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block mb-3 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <HiAcademicCap className="inline mr-2" />
                Branch
              </label>
              <select
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-emerald-500/20' : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20'}`}
              >
                <option value="">Select Branch</option>
                {branches?.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block mb-3 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiCalendar className="inline mr-2" />
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-emerald-500/20' : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20'}`}
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={`block mb-3 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiUpload className="inline mr-2" />
              Timetable File
            </label>
            <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${isDarkMode ? 'border-gray-600 hover:border-emerald-500 bg-gray-700/50' : 'border-gray-300 hover:border-emerald-500 bg-gray-50'}`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <FiUpload className={`mx-auto text-3xl mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Click to upload or drag and drop
                </p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          </div>

          {formData.previewUrl && (
            <div className="mt-6">
              <label className={`block mb-3 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Preview
              </label>
              <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                <img
                  src={formData.previewUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-64 object-contain"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <CustomButton variant="secondary" onClick={onClose} className="px-6 py-3">
              Cancel
            </CustomButton>
            <CustomButton variant="primary" onClick={handleSubmit} className="px-6 py-3">
              {initialData ? "Update Timetable" : "Add Timetable"}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const Timetable = () => {
  const { isDarkMode } = useTheme();
  const [branch, setBranch] = useState();
  const [timetables, setTimetables] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTimetableId, setSelectedTimetableId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [loading, setLoading] = useState(false);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    getBranchHandler();
    getTimetablesHandler();
  }, []);

  const getBranchHandler = async () => {
    try {
      const response = await axiosWrapper.get(`/branch`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setBranch(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching branches");
    }
  };

  const getTimetablesHandler = async () => {
    try {
      const response = await axiosWrapper.get(`/timetable`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setTimetables(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching timetables");
    }
  };

  const handleSubmitTimetable = async (formData) => {
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${userToken}`,
    };

    const submitData = new FormData();
    submitData.append("branch", formData.branch);
    submitData.append("semester", formData.semester);
    if (formData.file) {
      submitData.append("file", formData.file);
    }

    try {
      toast.loading(
        editingTimetable ? "Updating Timetable" : "Adding Timetable"
      );

      let response;
      if (editingTimetable) {
        response = await axiosWrapper.put(
          `/timetable/${editingTimetable._id}`,
          submitData,
          { headers }
        );
      } else {
        response = await axiosWrapper.post("/timetable", submitData, {
          headers,
        });
      }

      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        getTimetablesHandler();
        setShowAddModal(false);
        setEditingTimetable(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error with timetable");
    }
  };

  const deleteTimetableHandler = async (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedTimetableId(id);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Timetable");
      const response = await axiosWrapper.delete(
        `/timetable/${selectedTimetableId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success("Timetable deleted successfully");
        setIsDeleteConfirmOpen(false);
        getTimetablesHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error deleting timetable");
    }
  };

  const editTimetableHandler = (timetable) => {
    setEditingTimetable(timetable);
    setShowAddModal(true);
  };

  return (
    <div className="w-full mx-auto flex justify-center items-start flex-col mb-10 relative">
      {/* Header Section */}
      <div className="flex justify-between items-center w-full mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
            <MdSchedule className="text-3xl" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Timetable Management
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Manage class schedules and timetables
            </p>
          </div>
        </div>
        <CustomButton 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <IoMdAdd className="text-xl mr-2" />
          Add Timetable
        </CustomButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'} shadow-lg hover:shadow-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Timetables</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{timetables.length}</p>
            </div>
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <FiCalendar className="text-xl" />
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'} shadow-lg hover:shadow-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Branches</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{branch?.length || 0}</p>
            </div>
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
              <HiAcademicCap className="text-xl" />
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'} shadow-lg hover:shadow-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Updated</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Today</p>
            </div>
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
              <FiClock className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Timetables Table */}
      <div className={`w-full rounded-2xl border overflow-hidden shadow-xl ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'}`}>
        {timetables.length === 0 ? (
          <div className="text-center py-16">
            <MdSchedule className={`mx-auto text-6xl mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No Timetables Found</h3>
            <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mb-6`}>Get started by adding your first timetable</p>
            <CustomButton 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl"
            >
              <IoMdAdd className="text-lg mr-2" />
              Add First Timetable
            </CustomButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDarkMode ? 'bg-gray-700/80' : 'bg-gray-50/80'} backdrop-blur-sm`}>
                  <th className={`py-4 px-6 text-left font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <FiEye className="inline mr-2" />View
                  </th>
                  <th className={`py-4 px-6 text-left font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <HiAcademicCap className="inline mr-2" />Branch
                  </th>
                  <th className={`py-4 px-6 text-left font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <FiCalendar className="inline mr-2" />Semester
                  </th>
                  <th className={`py-4 px-6 text-left font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <FiClock className="inline mr-2" />Created At
                  </th>
                  <th className={`py-4 px-6 text-center font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {timetables.map((item, index) => (
                  <tr key={index} className={`border-b transition-all duration-200 ${isDarkMode ? 'border-gray-700/50 hover:bg-gray-700/30' : 'border-gray-200/50 hover:bg-gray-50/50'}`}>
                    <td className="py-4 px-6">
                      <a
                        href={process.env.REACT_APP_MEDIA_LINK + "/" + item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                      >
                        <FiEye className="text-lg" />
                      </a>
                    </td>
                    <td className={`py-4 px-6 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {item.branch.name}
                    </td>
                    <td className={`py-4 px-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Semester {item.semester}
                    </td>
                    <td className={`py-4 px-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-3">
                        <CustomButton
                          variant="secondary"
                          onClick={() => editTimetableHandler(item)}
                          className="p-2 rounded-lg hover:scale-110 transition-all duration-200"
                        >
                          <MdEdit className="text-lg" />
                        </CustomButton>
                        <CustomButton
                          variant="danger"
                          onClick={() => deleteTimetableHandler(item._id)}
                          className="p-2 rounded-lg hover:scale-110 transition-all duration-200"
                        >
                          <MdOutlineDelete className="text-lg" />
                        </CustomButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddTimetableModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTimetable(null);
        }}
        onSubmit={handleSubmitTimetable}
        initialData={editingTimetable}
        branches={branch}
      />

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this timetable?"
      />
    </div>
  );
};

export default Timetable;
