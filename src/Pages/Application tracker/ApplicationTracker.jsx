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
  const [showFilters, setShowFilters] = useState(false);

const statusOptions = ["Applied", "Interview", "Selected", "Rejected"];

const toggleDropdownfilter = () => setShowFilters((prev) => !prev);

const handleCheckboxChange = (status) => {
  if (selectedStatuses.includes(status)) {
    setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
  } else {
    setSelectedStatuses([...selectedStatuses, status]);
  }
};


  const fetchApplications = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/api/application-tracker`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Fetched applications:", response.data);
      const realData = Array.isArray(response.data)
        ? response.data
        : response.data.applications || []; setApplications(realData);
    } catch (error) {
      console.error("Failed to fetch applications 🧨", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

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
              {statusOptions.map((status, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 p-1 rounded cursor-pointer"
                >
                  <input
                    type="radio"
                    className="form-checkbox accent-teal-600"
                    checked={selectedStatuses.includes(status)}
                    onChange={() => handleCheckboxChange(status)}
                  />
                  {status}
                </label>
              ))}
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
          <span className='text-red-500 mb-5 flex flex-1'>No applications found.</span><br/> Please generate your CV and Cover Letter, then search and apply for jobs using the job link to start tracking your application progress.
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
          />
        ))   
      )
      
      }
  
    </div>
  );
};

export default ApplicationTracker;
