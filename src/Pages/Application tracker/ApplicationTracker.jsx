import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApplicationCard from './ApplicationCard';
import { BASE_URL } from '../../utils/api';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from "react-icons/fa";
import filter_icon from "../../assets/filter-icon.svg"; // replace with your path

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');


  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    total_pages: 1,
    per_page: 10,
    total: 0
  });

  const handleStatusChange = (status) => {
    setPagination(prev => ({ ...prev, current: 1 })); // reset to page 1 when filter changes
    setSelectedStatus(prev => (prev === status ? '' : status)); // toggle logic
  };


  const statusOptions = [
    { label: "Applied", value: "applied" },
    { label: "Interview", value: "interview" },
    { label: "Selected", value: "selected" },
    { label: "Rejected", value: "rejected" }
  ];
  const toggleDropdownfilter = () => setShowFilters((prev) => !prev);


  const fetchAllApplications = async (page = 1) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.get(`${BASE_URL}/api/application-tracker`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
        },
      });


      const realData = response.data.applications || [];
      setApplications(realData);

      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("❌ Error fetching all apps:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchFilteredApplications = async (status, page = 1) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.get(`${BASE_URL}/api/application-tracker`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status,
          page,
        },
      });


      const realData = response.data.applications || [];
      setApplications(realData);

      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error(`❌ Error fetching filtered apps:`, error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };




  const handleCheckboxChange = (status) => {
    setSelectedStatuses(prev => (prev === status ? '' : status));
  };



  useEffect(() => {
    if (selectedStatus) {
      fetchFilteredApplications(selectedStatus, pagination.current);
    } else {
      fetchAllApplications(pagination.current);
    }
  }, [selectedStatus, pagination.current]);




  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
      {/* Top Search + Filter Bar */}
      <div className="flex flex-wrap items-center  gap-4 w-full p-4 rounded-md shadow-sm">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search jobs or companies..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
        </div>

        {/* Filter */}
        <div className="relative">
          {/* Filter Button */}
          <button
            onClick={toggleDropdownfilter}
            className="flex items-center gap-x-2 px-4 py-1.5 bg-white font-medium text-[13px] rounded text-black hover:scale-105 shadow-md"
          >
            <img src={filter_icon} alt="filter icon" className="w-4 h-4" />
            Filter
            <motion.span
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-1"
            >
              <FaChevronDown className="text-[12px] text-gray-600" />
            </motion.span>
          </button>

          {/* Dropdown with checkboxes */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="origin-top absolute left-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden"
              >
                <div className="flex flex-col gap-1 px-4 py-2">
                  {statusOptions.map(({ label, value }, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 p-1 rounded cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="statusFilter"
                        className="accent-teal-600"
                        checked={selectedStatus === value}
                        onChange={() => handleStatusChange(value)}
                      />
                      {label}
                    </label>
                  ))}
                  {selectedStatus && (
                    <button
                      onClick={() => setSelectedStatus('')}
                      className="text-[12px] text-red-500 mt-1 hover:underline"
                    >
                      Clear Filter
                    </button>
                  )}



                </div>
              </motion.div>
            )}
          </AnimatePresence>


        </div>
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="w-[60%] mx-auto flex-col mt-32 flex items-center  text-center text-gray-600 text-base">
          <span className='text-red-500 mb-5 flex flex-1'>No applications found.</span><br /> Please generate your CV and Cover Letter, then search and apply for jobs using the job link to start tracking your application progress.
        </p>
      ) : (

        applications.map(({
          job_id,
          job_title,
          title,
          company,
          location,
          job_desc,
          description,
          key_skills,
          skills,
          match_score,
          status
        }, idx) => (
          <ApplicationCard
            key={job_id || idx}
            jobId={job_id} // 👈 ADD THIS
            title={job_title || title}
            company={company}
            location={location}
            description={job_desc || description || "No description provided"}
            yourSkills={key_skills?.join(', ') || 'N/A'}
            requiredSkills={skills || 'N/A'}
            profileMatch={match_score || 0}
            status={status || 'pending'}
            onDelete={() =>
              setApplications(prev => prev.filter(app => app.job_id !== job_id))
            }
          />
        ))
      )

      }

      {pagination.total_pages > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            className="px-3 py-1 rounded bg-[#2c6472] text-white hover:bg-[#2c6472]/80 text-sm"
            onClick={() => setPagination(prev => ({ ...prev, current: Math.max(prev.current - 1, 1) }))}
            disabled={pagination.current === 1}
          >
            Prev
          </button>

          <span className="text-sm font-medium">
            Page {pagination.current} of {pagination.total_pages}
          </span>

          <button
            className="px-3 py-1 rounded bg-[#2c6472] text-white hover:bg-[#2c6472]/80 text-sm"
            onClick={() => setPagination(prev => ({ ...prev, current: Math.min(prev.current + 1, pagination.total_pages) }))}
            disabled={pagination.current === pagination.total_pages}
          >
            Next
          </button>
        </div>
      )}


    </div>
  );
};

export default ApplicationTracker;
