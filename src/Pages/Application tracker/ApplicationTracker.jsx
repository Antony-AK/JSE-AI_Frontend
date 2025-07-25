import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ApplicationCard from './ApplicationCard';
import { BASE_URL } from '../../utils/api';
import { FiSearch, FiX } from 'react-icons/fi';
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

  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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


  const fetchAllApplications = async (page = 1, query = '') => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.get(`${BASE_URL}/api/application-tracker`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          ...(query && { company: query }) // Send 'company' param only if query exists
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

  const fetchFilteredApplications = async (status, page = 1, query = '') => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.get(`${BASE_URL}/api/application-tracker`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          status,
          ...(query && { company: query }),
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

        {/* Search + Clear */}
        <div className="flex items-center gap-2 w-full max-w-sm">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search jobs or companies..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (selectedStatus) {
                    fetchFilteredApplications(selectedStatus, 1, searchQuery);
                  } else {
                    fetchAllApplications(1, searchQuery);
                  }
                  setPagination((prev) => ({ ...prev, current: 1 }));
                }
              }}
            />
            <FiSearch
              className="absolute top-3 right-3 text-gray-400 cursor-pointer"
              onClick={() => {
                if (selectedStatus) {
                  fetchFilteredApplications(selectedStatus, 1, searchQuery);
                } else {
                  fetchAllApplications(1, searchQuery);
                }
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
            />
          </div>

          <div className="w-14">
            {searchQuery && (
              <button
                className="text-sm ml-2 text-red-500 hover:underline whitespace-nowrap"
                onClick={() => {
                  setSearchQuery('');
                  setPagination(prev => ({ ...prev, current: 1 }));
                  if (selectedStatus) {
                    fetchFilteredApplications(selectedStatus, 1, '');
                  } else {
                    fetchAllApplications(1, '');
                  }
                }}
              >
                Clear
              </button>
            )}
          </div>

        </div>


        {/* Filter */}
        <div ref={filterRef} className="relative">
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
        <div className="flex flex-col gap-4 animate-pulse">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg shadow-sm px-6 py-4 w-full flex flex-col gap-3 animate-pulse"
            >
              {/* Title + Company + Location */}
              <div className="h-5 w-1/3 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded mb-4"></div>

              {/* Description */}
              <div className="h-3 w-full bg-gray-100 rounded mb-1"></div>
              <div className="h-3 w-4/5 bg-gray-100 rounded mb-1"></div>
              <div className="h-3 w-3/5 bg-gray-100 rounded"></div>

              {/* Buttons (fake skeleton buttons) */}
              <div className="flex gap-2 mt-4">
                <div className="h-8 w-28 bg-gray-200 rounded"></div>
                <div className="h-8 w-28 bg-gray-200 rounded"></div>
                <div className="h-8 w-28 bg-gray-200 rounded"></div>
                <div className="h-10 w-44 bg-gray-300 rounded"></div>
              </div>
            </div>

          ))}
        </div>) : applications.length === 0 ? (
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
          status,
          selected_date
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
            selectedDate={selected_date}
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
