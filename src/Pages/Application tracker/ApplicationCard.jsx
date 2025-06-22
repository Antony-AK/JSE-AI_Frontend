// components/ApplicationCard.jsx
import React from "react";
import { Download, MoreVertical } from "lucide-react";
import { useState } from "react";

const ApplicationCard = ({ app }) => {
  const [activeStatus, setActiveStatus] = useState('');
  const isInterviewActive = activeStatus === 'Interview';

  return (
    <div className="flex justify-between items-start bg-white border rounded-lg shadow-sm px-6 py-4 w-full gap-4">
      {/* Left Side */}
      <div className="flex flex-col gap-1.5 flex-grow">
        {/* Header */}
        <div className="flex justify-between  items-start w-full">
          <div>
            <h2 className="text-[#2c6472] mb-1.5 font-semibold text-[18px] leading-tight">
              {app.title}
            </h2>
            <p className="text-gray-800 mb-1.5 text-sm">{app.company}</p>
            <p className="text-gray-600 text-sm">{app.location}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3 max-w-4xl leading-snug">
          {app.description}
        </p>

        {/* Skills */}
        <div className="mt-3 space-y-2">
          <p className="text-sm font-semibold text-black">
            Your skills{" "}
            <span className="font-normal text-gray-600 ml-2">{app.yourSkills}</span>
          </p>
          <p className="text-sm font-semibold text-black">
            Required skills{" "}
            <span className="font-normal text-gray-600 ml-2">
              {app.requiredSkills}
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex w-full gap-2.5 mt-4 ms-10">
          <button
            onClick={() => setActiveStatus('Applied')}
            className={`w-[140px] h-[40px] mt-2 px-4 py-1.5 rounded-md border text-sm font-medium transition ${activeStatus === 'Applied'
                ? 'bg-blue-500 text-white'
                : 'border-blue-500 text-blue-600 hover:bg-blue-50'
              }`}
          >
            Applied
          </button>

          <button
            onClick={() => setActiveStatus('Interview')}
            className={`w-[140px] h-[40px] mt-2 px-4 py-1.5 rounded-md border text-sm font-medium transition ${activeStatus === 'Interview'
                ? 'bg-yellow-500 text-white'
                : 'border-orange-400 text-orange-500 hover:bg-orange-50'
              }`}
          >
            Interview
          </button>

          <button
            onClick={() => setActiveStatus('Selected')}
            className={`w-[140px] h-[40px] mt-2 px-4 py-1.5 rounded-md border text-sm font-medium transition ${activeStatus === 'Selected'
                ? 'bg-green-500 text-white'
                : 'border-green-500 text-green-600 hover:bg-green-50'
              }`}
          >
            Selected
          </button>

          <button
            onClick={() => setActiveStatus('Rejected')}
            className={`w-[140px] h-[40px] mt-2 px-4 py-1.5 rounded-md border text-sm font-medium transition ${activeStatus === 'Rejected'
                ? 'bg-red-500 text-white'
                : 'border-red-500 text-red-600 hover:bg-red-50'
              }`}
          >
            Rejected
          </button>

          <button
            disabled={!isInterviewActive}
            className={`w-[140px] h-[40px] mt-2 px-4 py-1.5 rounded-2xl text-sm font-medium transition ${isInterviewActive
                ? 'bg-[#2c6472] text-white hover:bg-slate-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            Job Research
          </button>
          <button className="bg-[#306b74] hover:bg-[#285962] text-white w-[210px] px-4  py-2 rounded-md text-base font-medium flex  items-center justify-center transition duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
              />
            </svg>
            <span className="leading-tight ms-4 flex text-sm items-start flex-col ">
              Download<br /><span className="">CV & Cover Letter</span>
            </span>
          </button>

        </div>

      </div>

      {/* Right Side: Profile Match Circle */}
        {/* Profile Completion Circle */}
              <div className="flex flex-col items-center -ms-10">
                <div className="relative w-14 h-14">
                  <svg className="absolute top-0 left-0 w-full h-full">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="#2c6472"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="150"
                      strokeDashoffset={150 - (150 * (app.profileMatch ?? 0)) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 28 28)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                    {app.profileMatch}%
                  </div>
                </div>
                <span className="text-xs mt-2 w-28 font-medium text-gray-600">Profile Complete</span>
              </div>

      
      <MoreVertical className="text-gray-400 absolute top-5 text-lg w-10 cursor-pointer h-10 mt-1" />

    </div>
  );
};

export default ApplicationCard;
