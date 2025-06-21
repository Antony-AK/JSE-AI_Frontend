// components/ApplicationCard.jsx
import React from "react";
import { Download, MoreVertical } from "lucide-react";

const ApplicationCard = ({ app }) => {
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
          <button className="w-[140px] h-[40px] mt-2 px-4 py-1.5 rounded-md border border-blue-500 text-blue-600 text-sm font-medium hover:bg-blue-50 transition">
            Applied
          </button>
          <button className="w-[140px] h-[40px] mt-2  px-4 py-1.5 rounded-md border border-orange-400 text-orange-500 text-sm font-medium hover:bg-orange-50 transition">
            Interview
          </button>
          <button className="w-[140px] h-[40px] mt-2 px-4 py-1.5 rounded-md border border-green-500 text-green-600 text-sm font-medium hover:bg-green-50 transition">
            Selected
          </button>
          <button className="w-[140px] h-[40px] mt-2 px-4 py-1.5 rounded-md border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50 transition">
            Rejected
          </button>
          <button className="w-[140px] h-[40px] mt-2 px-4 py-1.5 rounded-2xl bg-[#2c6472] text-white text-sm font-medium hover:bg-slate-700 transition">
            Job Research
          </button><button className=" flex items-center gap-2 px-4 py-2 bg-[#2c6472] hover:bg-[#1d404e] text-white rounded-md text-sm font-medium transition">
            <Download className="w-4 h-4" />
            Download<br/> <span className="hidden sm:inline ">CV & Cover Letter</span>
          </button>
        </div>

      </div>

      {/* Right Side: Profile Match Circle */}
      <div className="flex flex-col items-center justify-center mt-1 min-w-[70px]">
        <svg width="80" height="80" className="transform ">
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke="#2c6472"
            strokeWidth="8"
            fill="none"
            strokeDasharray={220}
            strokeDashoffset={220 - (220 * app.profileMatch) / 100}
            strokeLinecap="round"
          />
          <text
            x="40"
            y="45"
            textAnchor="middle"
            fill="#2c6472"
            fontSize="16"
            fontWeight="bold"
          >
            {app.profileMatch}%
          </text>
        </svg>
        <p className="text-sm text-gray-700 w-[100px]  mt-2 ">Profile Match</p>
      </div>

                <MoreVertical className="text-gray-400 mt-1" />

    </div>
  );
};

export default ApplicationCard;
