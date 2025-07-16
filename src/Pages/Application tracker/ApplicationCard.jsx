import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, MoreVertical } from "lucide-react";
import { BASE_URL } from "../../utils/api";
import axios from "axios";
import DownloadHandler from "./DownloadHandler";

const ApplicationCard = ({
  jobId,
  title,
  company,
  location,
  description,
  yourSkills,
  requiredSkills,
  profileMatch,
  status,
  selectedDate,
  onDelete
}) => {
  const [activeStatus, setActiveStatus] = useState(status || '');
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllYourSkills, setShowAllYourSkills] = useState(false);
  const [showAllRequiredSkills, setShowAllRequiredSkills] = useState(false);
  const statusOrder = ['Applied', 'Interview', 'Selected', 'Rejected'];
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [cvDataToDownload, setCvDataToDownload] = useState(null);
  const [clDataToDownload, setClDataToDownload] = useState(null);
  const [startDownload, setStartDownload] = useState(false);



  const [showMenu, setShowMenu] = useState(false);

  // Helper to check if we can go to the next status
  const canUpdateTo = (targetStatus) => {
    const currentIndex = statusOrder.indexOf(activeStatus);
    const targetIndex = statusOrder.indexOf(targetStatus);
    return targetIndex > currentIndex;
  };


  const yourSkillList = typeof yourSkills === 'string' ? yourSkills.split(',').map(skill => skill.trim()) : [];
  const requiredSkillList = typeof requiredSkills === 'string' ? requiredSkills.split(',').map(skill => skill.trim()) : [];

  const isInterviewActive = activeStatus.toLowerCase() === 'interview';

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateApplicationStatus = async (newStatus) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const payload = {
        status: newStatus.toLowerCase(), // Ensure lowercase
      };

      console.log("Sending PUT to:", `${BASE_URL}/api/application-tracker/${jobId}/status`);
      console.log("Payload:", payload);

      const response = await fetch(`${BASE_URL}/api/application-tracker/${jobId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      setActiveStatus(newStatus); // This can be capitalized for display
    } catch (error) {
      console.error("❌ Error updating status:", error.message);
      alert("Failed to update status. Reason: " + error.message);
    }
  };

  const handleDownloadAll = async () => {
    console.log("🔍 jobid", jobId);

    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.get(
        `${BASE_URL}/api/application-tracker/download-all/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("📦 Full API Response:", response.data);

      const { cv_data, cl_data, cv_format, cl_format } = response.data || {};

      console.log("📄 cv_data:", cv_data);
      console.log("✉️ cl_data:", cl_data);
      console.log("📄 format:", cv_format, "✉️ format:", cl_format);

      if (!cv_data || !cl_data) {
        console.error("❌ Missing CV or CL data from API response");
        alert("Failed to fetch CV or Cover Letter. Empty response received.");
        return;
      }

      const mergedCvData = { ...cv_data, format: cv_format };
      const mergedClData = { ...cl_data, format: cl_format };

      setCvDataToDownload(mergedCvData);
      setClDataToDownload(mergedClData);
      setStartDownload(true); // Trigger download

    } catch (err) {
      console.error("❌ Error downloading documents:", err.response?.data || err.message);
      alert("Download failed. Try again later.");
    }
  };

  const handleDeleteApplication = async () => {
    setShowMenu(false);

    try {
      const token = sessionStorage.getItem("authToken");
      const payload = { status: "deleted" };

      const response = await fetch(`${BASE_URL}/api/application-tracker/${jobId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete");
      }

      console.log("🗑️ Deleted job", jobId);

      if (typeof onDelete === "function") {
        onDelete(); // Trigger parent to remove this card
      }

    } catch (error) {
      console.error("❌ Failed to delete job:", error.message);
      alert("Could not delete this application.");
    }
  };





  return (
    <div className="flex justify-between items-start bg-white border rounded-lg shadow-sm px-6 py-4 w-full gap-4">

      {/* Left Side */}
      <div className="flex flex-col gap-1.5 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-start w-full">
          <div>
            <h2 className="text-[#2c6472] mb-1.5 font-semibold text-[18px] leading-tight">
              {title}
            </h2>
            <p className="text-gray-800 mb-1.5 text-sm">{company}</p>
            <p className="text-gray-600  text-sm">{location}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-3 max-w-4xl">
          <p className={`text-sm text-gray-600 leading-snug ${showFullDesc ? '' : 'h-10 overflow-hidden line-clamp-2'}`}>
            {description}
          </p>
          {description?.length > 100 && (
            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="text-[#2c6472] mt-1 text-sm font-medium hover:underline"
            >
              {showFullDesc ? 'Show less ▲' : 'Show more ▼'}
            </button>
          )}
        </div>

        {/* Skills */}
        <div className="mt-3 space-y-2">
          {/* Your Skills */}
          <p className="text-sm font-semibold text-black">
            Your skills
            <span className="font-normal text-gray-600 ml-2">
              {(showAllYourSkills ? yourSkillList : yourSkillList.slice(0, 2)).join(', ')}
              {yourSkillList.length > 2 && (
                <button
                  onClick={() => setShowAllYourSkills(!showAllYourSkills)}
                  className="text-[#2c6472] font-medium ml-2 hover:underline text-sm"
                >
                  {showAllYourSkills ? 'Show less' : 'Show more..'}
                </button>
              )}
            </span>
          </p>

          {/* Required Skills */}
          <p className="text-sm font-semibold text-black">
            Required skills
            <span className="font-normal text-gray-600 ml-2">
              {(showAllRequiredSkills ? requiredSkillList : requiredSkillList.slice(0, 2)).join(', ')}
              {requiredSkillList.length > 2 && (
                <button
                  onClick={() => setShowAllRequiredSkills(!showAllRequiredSkills)}
                  className="text-[#2c6472] font-medium ml-2 hover:underline text-sm"
                >
                  {showAllRequiredSkills ? 'Show less' : 'Show more..'}
                </button>
              )}
            </span>
          </p>
          <p className="text-gray-600 mt-1 text-sm">
            <strong className="text-black font-semibold me-1">Selected Date:  </strong>
            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              timeZone: 'Asia/Kolkata'
            }) : 'Not available'}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex w-[1050px] gap-2.5 mt-4 ms-10 ">
          {statusOrder.map((statusOption, index) => {
            const currentIndex = statusOrder.findIndex(
              (s) => s.toLowerCase() === activeStatus.toLowerCase()
            );
            const targetIndex = index;

            const isCompletedOrCurrent = targetIndex <= currentIndex;
            const isNextStep = targetIndex === currentIndex + 1;

            const bgColorMap = {
              Applied: 'bg-blue-400',
              Interview: 'bg-yellow-400',
              Selected: 'bg-green-400',
              Rejected: 'bg-red-400',
            };

            const borderColorMap = {
              Applied: 'border-blue-500 text-blue-600 hover:bg-blue-50',
              Interview: 'border-yellow-500 text-yellow-600 hover:bg-yellow-50',
              Selected: 'border-green-500 text-green-600 hover:bg-green-50',
              Rejected: 'border-red-500 text-red-600 hover:bg-red-50',
            };

            return (
              <button
                key={statusOption}
                onClick={() => {
                  if (isNextStep) {
                    setPendingStatus(statusOption);
                    setShowConfirmation(true);
                  }
                }}
                disabled={!isNextStep}
                className={`w-[140px] h-[40px] mt-2 px-4 py-1.5 rounded-md text-sm font-medium transition
                  ${isCompletedOrCurrent
                    ? `${bgColorMap[statusOption]} text-white border border-gray-400 cursor-not-allowed`
                    : `border ${borderColorMap[statusOption]}`
                  }
                  ${!isNextStep && !isCompletedOrCurrent
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                  }
                `}
              >
                {statusOption}
              </button>
            );
          })}

          {/* Job Research button logic */}
          <button
            disabled={activeStatus.toLowerCase() !== 'interview'}
            className={`w-[140px] h-[40px] mt-2 px-4 py-1.5 rounded-2xl text-sm font-medium transition ${activeStatus.toLowerCase() === 'interview'
              ? 'bg-gray-200 text-gray-400 border-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-400 border-gray-400 cursor-not-allowed'
              }`}
          >
            Job Research
          </button>


          <button onClick={handleDownloadAll}
            className="bg-[#306b74] hover:bg-[#285962] text-white w-[210px] px-4 py-2 rounded-md text-base font-medium flex items-center justify-center transition duration-200">
            <Download className="w-5 h-5 mb-1" />
            <span className="leading-tight ms-4 flex text-sm items-start flex-col ">
              Download<br /><span className="">CV & Cover Letter</span>
            </span>
          </button>
        </div>
      </div>

      {/* Right Side: Profile Match Circle */}
      <div className="flex absolute right-20 flex-col items-center mt-10">
        <div className="relative w-20 h-20">
          <svg className="absolute top-0 left-0 w-20 h-20"> {/* 80px x 80px */}
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke="#E5E7EB"
              strokeWidth="5"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke="#2c6472"
              strokeWidth="5"
              fill="none"
              strokeDasharray="188.5" // 2 * π * r = 2 * 3.14 * 30
              strokeDashoffset={188.5 - (188.5 * (profileMatch ?? 0)) / 100}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
            {Math.round(profileMatch ?? 0)}%       
               </div>
        </div>
        <span className="text-xs mt-2 w-28 font-medium text-gray-600">Profile Complete</span>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Are you sure?</h2>
            <p className=" text-gray-600 mb-5">
              Once you change the status to <span className="font-semibold text-[#2c6472]">{pendingStatus}</span>, it cannot be changed again.
            </p>
            <div className="flex justify-center gap-4">

              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setPendingStatus(null);
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  updateApplicationStatus(pendingStatus);
                  setShowConfirmation(false);
                  setPendingStatus(null);
                }}
                className="bg-[#2c6472] text-white px-4 py-2 rounded-md hover:bg-[#234d56]"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}


      <div ref={menuRef} className="absolute right-14">
        <MoreVertical
          onClick={() => setShowMenu(!showMenu)}
          className="cursor-pointer w-6 h-6 text-gray-500 hover:text-[#2c6472] transition"
        />

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute top-6 right-0 bg-white border border-gray-200 rounded-md shadow-lg w-32 z-50"
            >
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-500 hover:text-white transition rounded-md"
                onClick={() => {
                  setShowMenu(false);
                  handleDeleteApplication();
                }}
              >
                Remove
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {startDownload && cvDataToDownload && (
        <DownloadHandler
          data={cvDataToDownload}
          onFinish={() => {
            console.log("✅ CV downloaded");
            setCvDataToDownload(null);
          }}
        />
      )}

      {startDownload && clDataToDownload && (
        <DownloadHandler
          data={clDataToDownload}
          type="cl"
          onFinish={() => {
            console.log("✅ CL downloaded");
            setClDataToDownload(null);
            setStartDownload(false); // All done
          }}
        />
      )}


    </div>
  );
};

export default ApplicationCard;
