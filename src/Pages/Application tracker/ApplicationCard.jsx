import React, { useState } from "react";
import { Download, MoreVertical } from "lucide-react";
import { BASE_URL } from "../../utils/api";

const ApplicationCard = ({
  jobId,
  title,
  company,
  location,
  description,
  yourSkills,
  requiredSkills,
  profileMatch,
  status
}) => {
  const [activeStatus, setActiveStatus] = useState(status || '');
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllYourSkills, setShowAllYourSkills] = useState(false);
  const [showAllRequiredSkills, setShowAllRequiredSkills] = useState(false);
  const statusOrder = ['Applied', 'Interview', 'Selected', 'Rejected'];

  // Helper to check if we can go to the next status
  const canUpdateTo = (targetStatus) => {
    const currentIndex = statusOrder.indexOf(activeStatus);
    const targetIndex = statusOrder.indexOf(targetStatus);
    return targetIndex > currentIndex;
  };


  const yourSkillList = typeof yourSkills === 'string' ? yourSkills.split(',').map(skill => skill.trim()) : [];
  const requiredSkillList = typeof requiredSkills === 'string' ? requiredSkills.split(',').map(skill => skill.trim()) : [];

const isInterviewActive = activeStatus.toLowerCase() === 'interview';



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
            <p className="text-gray-600 text-sm">{location}</p>
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
        </div>

        {/* Buttons */}
        <div className="flex w-full gap-2.5 mt-4 ms-10 flex-wrap">
          {statusOrder.map((statusOption, index) => {
            const currentIndex = statusOrder.findIndex(
              (s) => s.toLowerCase() === activeStatus.toLowerCase()
            );
            const targetIndex = index;

            const isCompletedOrCurrent = targetIndex <= currentIndex;
            const isNextStep = targetIndex === currentIndex + 1;

            const bgColorMap = {
              Applied: 'bg-blue-300',
              Interview: 'bg-yellow-300',
              Selected: 'bg-green-300',
              Rejected: 'bg-red-300',
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
                  if (isNextStep) updateApplicationStatus(statusOption);
                }}
                disabled={!isNextStep}
                className={`w-[140px] h-[40px] mt-2 px-4 py-1.5 rounded-md text-sm font-medium transition
          ${isCompletedOrCurrent
                    ? `${bgColorMap[statusOption]} text-white cursor-not-allowed`
                    : borderColorMap[statusOption]}
          ${!isNextStep && !isCompletedOrCurrent ? 'opacity-50 cursor-not-allowed' : ''}
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
                ? 'bg-[#2c6472] text-white hover:bg-slate-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            Job Research
          </button>


          <button className="bg-[#306b74] hover:bg-[#285962] text-white w-[210px] px-4 py-2 rounded-md text-base font-medium flex items-center justify-center transition duration-200">
            <Download className="w-5 h-5 mb-1" />
            <span className="leading-tight ms-4 flex text-sm items-start flex-col ">
              Download<br /><span className="">CV & Cover Letter</span>
            </span>
          </button>
        </div>
      </div>

      {/* Right Side: Profile Match Circle */}
      <div className="flex flex-col items-center -ms-10">
        <div className="relative w-14 h-14">
          <svg className="absolute top-0 left-0 w-full h-full">
            <circle cx="28" cy="28" r="24" stroke="#E5E7EB" strokeWidth="4" fill="none" />
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="#2c6472"
              strokeWidth="4"
              fill="none"
              strokeDasharray="150"
              strokeDashoffset={150 - (150 * (profileMatch ?? 0)) / 100}
              strokeLinecap="round"
              transform="rotate(-90 28 28)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
            {profileMatch}%
          </div>
        </div>
        <span className="text-xs mt-2 w-28 font-medium text-gray-600">Profile Complete</span>
      </div>

      <MoreVertical className="text-gray-400 absolute top-5 text-lg w-10 cursor-pointer h-10 mt-1" />
    </div>
  );
};

export default ApplicationCard;
