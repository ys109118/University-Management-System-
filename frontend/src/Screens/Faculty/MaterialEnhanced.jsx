/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { FiUpload, FiEdit2, FiTrash2, FiBook, FiFilter, FiDownload, FiSearch } from "react-icons/fi";
import { HiAcademicCap, HiDocumentText, HiClipboardList } from "react-icons/hi";
import { MdLink, MdSchool, MdAssignment } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { BiCategory } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import { useTheme } from "../../context/ThemeContext";

const Material = () => {
  const { isDarkMode } = useTheme();
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    semester: "",
    branch: "",
    type: "notes",
  });
  const [file, setFile] = useState(null);
  const [filters, setFilters] = useState({
    subject: "",
    semester: "",
    branch: "",
    type: "",
  });

  useEffect(() => {
    fetchSubjects();
    fetchBranches();
    fetchMaterials();
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [filters]);

  const fetchSubjects = async () => {
    try {
      toast.loading("Loading subjects...");
      const response = await axiosWrapper.get("/subject", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if (response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setSubjects([]);
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to load subjects"
        );
      }
    } finally {
      toast.dismiss();
    }
  };

  const fetchBranches = async () => {
    try {
      toast.loading("Loading branches...");
      const response = await axiosWrapper.get("/branch", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if (response.data.success) {
        setBranches(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setBranches([]);
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to load branches"
        );
      }
    } finally {
      toast.dismiss();
    }
  };

  const fetchMaterials = async () => {
    try {
      toast.loading("Loading materials...");
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axiosWrapper.get(`/material?${queryParams}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if (response.data.success) {
        setMaterials(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setMaterials([]);
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to load materials"
        );
      }
    } finally {
      toast.dismiss();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      semester: "",
      branch: "",
      type: "notes",
    });
    setFile(null);
    setEditingMaterial(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDataLoading(true);
    toast.loading(
      editingMaterial ? "Updating material..." : "Adding material..."
    );

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (file) {
        formDataToSend.append("file", file);
      }

      if (editingMaterial) {
        await axiosWrapper.put(
          `/material/${editingMaterial._id}`,
          formDataToSend
        );
        toast.success("Material updated successfully");
      } else {
        await axiosWrapper.post("/material", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        toast.success("Material added successfully");
      }

      setShowModal(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setDataLoading(false);
      toast.dismiss();
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      subject: material.subject._id,
      semester: material.semester,
      branch: material.branch._id,
      type: material.type,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axiosWrapper.delete(`/material/${selectedMaterialId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      toast.success("Material deleted successfully");
      setIsDeleteConfirmOpen(false);
      fetchMaterials();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete material"
      );
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'notes': return <FiBook className="text-lg" />;
      case 'assignment': return <MdAssignment className="text-lg" />;
      case 'syllabus': return <HiDocumentText className="text-lg" />;
      default: return <HiClipboardList className="text-lg" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'notes': return isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600';
      case 'assignment': return isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600';
      case 'syllabus': return isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600';
      default: return isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600';
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full mx-auto flex justify-center items-start flex-col mb-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <FiBook className="text-3xl" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Study Materials
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Manage and organize educational resources
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? (isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700')}`}
            >
              <HiClipboardList className="text-xl" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? (isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700')}`}
            >
              <FiFilter className="text-xl" />
            </button>
          </div>
          
          <CustomButton 
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <IoMdAdd className="text-xl mr-2" />
            Add Material
          </CustomButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mb-8">
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'} shadow-lg hover:shadow-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Materials</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{materials.length}</p>
            </div>
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <FiBook className="text-xl" />
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'} shadow-lg hover:shadow-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notes</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{materials.filter(m => m.type === 'notes').length}</p>
            </div>
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
              <HiDocumentText className="text-xl" />
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'} shadow-lg hover:shadow-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assignments</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{materials.filter(m => m.type === 'assignment').length}</p>
            </div>
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
              <MdAssignment className="text-xl" />
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'} shadow-lg hover:shadow-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subjects</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{subjects.length}</p>
            </div>
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
              <HiAcademicCap className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`w-full p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'} shadow-lg`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'}`}
              />
            </div>
          </div>
          
          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'}`}
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <select
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'}`}
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>

            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'}`}
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>

            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'}`}
            >
              <option value="">All Types</option>
              <option value="notes">Notes</option>
              <option value="assignment">Assignment</option>
              <option value="syllabus">Syllabus</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials Display */}
      {filteredMaterials.length === 0 ? (
        <div className={`w-full rounded-2xl border p-16 text-center ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'} shadow-lg`}>
          <FiBook className={`mx-auto text-6xl mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No Materials Found</h3>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mb-6`}>Start building your resource library</p>
          <CustomButton 
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl"
          >
            <IoMdAdd className="text-lg mr-2" />
            Add First Material
          </CustomButton>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {filteredMaterials.map((material) => (
            <div key={material._id} className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/80' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm hover:bg-white'} shadow-lg hover:shadow-2xl group`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${getTypeColor(material.type)}`}>
                  {getTypeIcon(material.type)}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={() => handleEdit(material)}
                    className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMaterialId(material._id);
                      setIsDeleteConfirmOpen(true);
                    }}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
              
              <h3 className={`font-semibold text-lg mb-2 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {material.title}
              </h3>
              
              <div className="space-y-2 mb-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <MdSchool className="inline mr-1" />
                  {material.subject.name}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <HiAcademicCap className="inline mr-1" />
                  {material.branch.name} • Sem {material.semester}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(material.type)}`}>
                  {material.type}
                </span>
                <button
                  onClick={() => window.open(`${process.env.REACT_APP_MEDIA_LINK}/${material.file}`)}
                  className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                >
                  <FiDownload className="text-lg" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`w-full rounded-2xl border overflow-hidden shadow-xl ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDarkMode ? 'bg-gray-700/80' : 'bg-gray-50/80'} backdrop-blur-sm`}>
                  <th className={`py-4 px-6 text-left font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <FiDownload className="inline mr-2" />File
                  </th>
                  <th className={`py-4 px-6 text-left font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <FiBook className="inline mr-2" />Title
                  </th>
                  <th className={`py-4 px-6 text-left font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <MdSchool className="inline mr-2" />Subject
                  </th>
                  <th className={`py-4 px-6 text-left font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <HiAcademicCap className="inline mr-2" />Details
                  </th>
                  <th className={`py-4 px-6 text-left font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <BiCategory className="inline mr-2" />Type
                  </th>
                  <th className={`py-4 px-6 text-center font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((material) => (
                  <tr key={material._id} className={`border-b transition-all duration-200 ${isDarkMode ? 'border-gray-700/50 hover:bg-gray-700/30' : 'border-gray-200/50 hover:bg-gray-50/50'}`}>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => window.open(`${process.env.REACT_APP_MEDIA_LINK}/${material.file}`)}
                        className={`inline-flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                      >
                        <FiDownload className="text-lg" />
                      </button>
                    </td>
                    <td className={`py-4 px-6 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {material.title}
                    </td>
                    <td className={`py-4 px-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {material.subject.name}
                    </td>
                    <td className={`py-4 px-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {material.branch.name} • Sem {material.semester}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(material.type)}`}>
                        {getTypeIcon(material.type)}
                        <span className="ml-1">{material.type}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(material)}
                          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          <FiEdit2 className="text-lg" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMaterialId(material._id);
                            setIsDeleteConfirmOpen(true);
                          }}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 hover:scale-110"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Material Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border transition-all duration-300`}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <FiBook className="text-2xl" />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {editingMaterial ? "Edit Material" : "Add New Material"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className={`p-2 rounded-xl transition-all duration-200 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                <IoMdClose className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block mb-3 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FiBook className="inline mr-2" />
                  Material Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter material title..."
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'}`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block mb-3 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <MdSchool className="inline mr-2" />
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'}`}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block mb-3 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <HiAcademicCap className="inline mr-2" />
                    Branch
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'}`}
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block mb-3 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <HiClipboardList className="inline mr-2" />
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'}`}
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block mb-3 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <BiCategory className="inline mr-2" />
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'}`}
                    required
                  >
                    <option value="notes">📚 Notes</option>
                    <option value="assignment">📝 Assignment</option>
                    <option value="syllabus">📋 Syllabus</option>
                    <option value="other">📄 Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block mb-3 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FiUpload className="inline mr-2" />
                  Material File
                </label>
                <div className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${isDarkMode ? 'border-gray-600 hover:border-blue-500 bg-gray-700/50' : 'border-gray-300 hover:border-blue-500 bg-gray-50'}`}>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required={!editingMaterial}
                  />
                  <div className="text-center">
                    <FiUpload className={`mx-auto text-4xl mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {file ? file.name : 'Drop your file here or click to browse'}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      PDF, DOC, DOCX, PPT, PPTX up to 50MB
                    </p>
                  </div>
                  {file && (
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                    >
                      <IoMdClose className="text-lg" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <CustomButton
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  variant="secondary"
                  className="px-6 py-3"
                >
                  Cancel
                </CustomButton>
                <CustomButton 
                  type="submit" 
                  disabled={dataLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl"
                >
                  {dataLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FiUpload className="mr-2" />
                      {editingMaterial ? "Update Material" : "Add Material"}
                    </div>
                  )}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this material? This action cannot be undone."
      />
    </div>
  );
};

export default Material;