
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import Loader from "../../base/loader/Loader.jsx";
import filter_icon from '../../assets/filter-icon.svg'
import arrow_down from '../../assets/arrow-down-drop.png'
import download_icon from '../../assets/downloadicon.png'
import link_icon from '../../assets/link-icon.svg'
import { Link } from "react-router-dom";
import { BASE_URL } from "../../utils/api.js";
import { useNavigate } from "react-router-dom";



const MyApplication = () => {
  const navigate = useNavigate();
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("both"); // default


  const [offset, setOffset] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    per_page: 20,
    total: 0,
    next: null,
    prev: null,
  });
  const perPage = pagination.per_page; // or hardcode 10 if it's fixed
  const hasFetched = useRef(false);


  const toggleExpand = (label) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const token = sessionStorage.getItem("authToken");

  const fetchSelectedJobs = async (customOffset = offset) => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.get(`${BASE_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { offset: customOffset, limit: perPage },
      });

      const fetchedJobs = response.data.jobs || [];
      const paginationInfo = response.data.pagination || {};
      const totalItems = paginationInfo.total || 0;
      const currentPage = Math.floor(customOffset / perPage) + 1;

      const mappedJobs = fetchedJobs.map((job) => {

        return {
          id: job.job_id || job.id, // 👉 Use backend ID only
          jobTitle: job.job_title || job.title || "Untitled Job",
          title: job.title || job.job_title,
          companyName: job.company || "Unknown Company",
          company: job.company || "Unknown Company",
          location: job.location || "Location not specified",
          postedDate: job.posted_date || "Not specified",
          description: job.description?.slice(0, 100) + "...",
          Description: job.description || "No description available",
          matchValue: job.match_score || 50,
          skillData: [
            {
              label: "Required Skills",
              value: job.skills ? job.skills.split(",").map((s) => s.trim()) : [],
            },
            {
              label: "Your Skills",
              value: Array.isArray(job.user_skills) ? job.user_skills : [],
            },
            {
              label: "Job Type",
              value: job.job_type || "Not specified",
            },
          ],
          selected: job.selected || false,
          cvGenerated: job.cv_generated || false,
          coverLetterGenerated: job.cover_letter_generated || false,
          viewLink: job.view_link || "#",
        };
      });


      setSelectedJobs(mappedJobs);
      setSelectedJob(mappedJobs[0]); // Default selected

      setPagination({
        current: currentPage,
        total: totalItems,
        per_page: paginationInfo.per_page || perPage,
        next: paginationInfo.next || null,
        prev: paginationInfo.prev || null,
      });

      setOffset(customOffset);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response?.data?.message || "⚠ Failed to fetch jobs.";
      setError(errMsg);
      setLoading(false);
    }
  };



  useEffect(() => {
    if (selectedLanguage === "both") {
      fetchSelectedJobs(); // default fetch
    } else {
      fetchJobsByLanguage(selectedLanguage); // based on lang filter
    }
  }, [selectedLanguage]); // 👈 triggers whenever language changes


  const toggleDropdownfilter = () => setShowFilters((prev) => !prev);
  const toggleLanguageDropdown = () => setShowLanguageDropdown((prev) => !prev);

  const fetchJobsByLanguage = async (lang) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("authToken");

      let url = `${BASE_URL}/api/jobs?job_language=both`;
      if (lang === "en") url = `${BASE_URL}/api/jobs?job_language=english`;
      if (lang === "de") url = `${BASE_URL}/api/jobs?job_language=german`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const jobs = response.data.jobs || [];

      const mappedJobs = jobs.map((job) => {

        return {
          id: job.job_id || job.id, // 👉 Use backend ID only
          jobTitle: job.job_title || job.title || "Untitled Job",
          title: job.title || job.job_title,
          companyName: job.company || "Unknown Company",
          company: job.company || "Unknown Company",
          location: job.location || "Location not specified",
          postedDate: job.posted_date || "Not specified",
          description: job.description?.slice(0, 100) + "...",
          Description: job.description || "No description available",
          matchValue: job.match_score || 50,
          skillData: [
            {
              label: "Required Skills",
              value: job.skills ? job.skills.split(",").map((s) => s.trim()) : [],
            },
            {
              label: "Your Skills",
              value: Array.isArray(job.user_skills) ? job.user_skills : [],
            },
            {
              label: "Job Type",
              value: job.job_type || "Not specified",
            },
          ],
        };
      });

      setSelectedJobs(mappedJobs);
      setSelectedJob(mappedJobs[0]);
      setPagination({
        current: 1,
        total: jobs.length,
        per_page: jobs.length,
        next: null,
        prev: null,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs by language:", error);
      setLoading(false);
    }
  };

  console.log("Selected Jobs:", selectedJobs);


 const handleGetJobURL = async (job_id) => {
  console.log("👉 job_id being passed:", job_id); // Check if valid

  if (!job_id) {
    console.error("❌ job_id is undefined or invalid.");
    return;
  }

  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      console.error("⚠ No auth token found.");
      return;
    }

    const response = await axios.post(
      `${BASE_URL}/provide-link`,
      JSON.stringify({ job_id }), // Explicit payload
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const jobLink = response.data?.job_link;
    if (jobLink) {
      window.open(jobLink, "_blank");
    } else {
      console.warn("⚠ No job link found:", response.data);
    }
  } catch (error) {
    console.error("❌ AxiosError:", error.response?.data || error.message);
  }
};



  const handleGenerateCV = async () => {
    const jobId = selectedJob?.id;
    if (!jobId) return console.warn("No selected job!");

    navigate("/user/cv", { state: { jobId } }); // Navigate first

    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.post(
        `${BASE_URL}/internal/generate-resume`,
        { job_id: jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ CV generated:", response.data);

      // Save data to sessionStorage
      sessionStorage.setItem("generatedCV", JSON.stringify(response.data));

    } catch (error) {
      console.error("❌ CV generation failed:", error);
      sessionStorage.setItem("generatedCV", JSON.stringify({ error: true }));
    }
  };


  const handleGenerateCoverLetter = async () => {
    const jobId = selectedJob?.id;
    if (!jobId) return console.warn("⚠️ No selected job!");

    navigate("/user/cl", { state: { jobId } });


    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.post(
        `${BASE_URL}/internal/generate-cover-letter`,
        { job_id: jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📨 Posting to:", `${BASE_URL}/internal/generate-cover-letter`);
      console.log("📦 Payload:", { job_id: jobId });
      console.log("✅ Response:", response.data);

      if (response.status === 200 && response.data) {
        // Store the generated cover letter data
        sessionStorage.setItem("generatedCL", JSON.stringify(response.data));

        // Navigate to CL page where loading/animation happens
      } else {
        console.warn("⚠️ Unexpected response:", response.status);
      }
    } catch (error) {
      console.error("❌ CL generation failed:");
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("URL:", error.config?.url);
    }
  };

  const handleJobTitleClick = (title) => {
    setSelectedJob(title);
    console.log("Selected title:", title) // Set the selected job title for filtering
  };


  if (loading) return <Loader />;

  return (
    <div className="flex flex-col h-screen bg-gray-50 px-6 ms-2">
      <div className="flex items-center w-[60%]  py-4  relative">
        {/* Recommended Jobs Button (Always Visible) */}
        <button
          className="px-6 py-1.5 font-medium text-[13px] rounded bg-white shadow-sm border border-gray-300 text-black hover:scale-105"
        >
          Designation
        </button>
        {/* Filter Button */}
        <button
          onClick={toggleDropdownfilter}
          className="flex ms-5 items-center gap-x-2 px-4 py-1.5 bg-white font-medium text-[13px] rounded text-black hover:scale-105 shadow-md"
        >
          <img src={filter_icon} alt="" />
          Filter
        </button>

        {/* Animated Filter Buttons */}
        <AnimatePresence>
          {showFilters && (
            <>
              {/* <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute left-[260px] px-6 py-1.5 flex justify-center items-center font-medium text-[13px] rounded bg-white shadow-sm border border-gray-300 text-black hover:scale-105"
              >
                Recommended Jobs <img src={arrow_down} className="ms-0.5" alt="" />
              </motion.button> */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute left-[260px] px-6 py-1.5 flex flex-col items-start font-medium text-[13px] rounded bg-white shadow-sm border border-gray-300 text-black"
              >
                <button
                  onClick={toggleLanguageDropdown}
                  className="w-full flex justify-between items-center"
                >
                  Languages <img src={arrow_down} className="ms-1" alt="" />
                </button>

                {showLanguageDropdown && (
                  <div className="flex flex-col absolute bg-white p-3 z-10 mt-8 -left-0 gap-2 w-full">
                    <button
                      onClick={() => {
                        setSelectedLanguage("en");
                        setShowLanguageDropdown(false);
                      }}
                      className="px-3 py-1 hover:bg-gray-100 text-left w-full"
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLanguage("de");
                        setShowLanguageDropdown(false);
                      }}
                      className="px-3 py-1 hover:bg-gray-100 text-left w-full"
                    >
                      German
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLanguage("both");
                        setShowLanguageDropdown(false);
                      }}
                      className="px-3 py-1 hover:bg-gray-100 text-left w-full"
                    >
                      Both
                    </button>

                  </div>
                )}
              </motion.div>

            </>
          )}
        </AnimatePresence>

      </div>



      <div className="flex flex-col w-full min-h-screen bg-gray-40">
        <br />
        {selectedJobs.length === 0 ? (
          <div className="absolute top-1/2 left-[calc(264px+40%)] transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No jobs found
            </h2>
            <p className="text-gray-500">Please check back later.</p>
          </div>
        ) : (
          <div className="flex flex-1 border-t border-gray-300 -mt-5  gap-5">
            <div className="flex flex-col w-[55%]">

              <div className="p-5 flex justify-between pt-4">
                <div>
                  <h2 className="text-sm font-semibold">Showing {pagination.total} Jobs</h2>
                  <p className="text-sm text-gray-400 mt-1">Based on your preferences</p>
                </div>

                <div className="flex flex-col justify-around gap-2 ">
                  <button className="bg-white flex justify-center items-center px-3 ps-4 py-1 curson-pointer border border-gray-300 rounded-md  text-sm shadow-sm">All <img src={arrow_down} className="ms-0.5" alt="" /> </button>
                </div>
              </div>

              <div className="w-[625px]  mb-5 -space-y-6 rounded-xl bg-white border border-gray-400/20 "><br />
                <div className="h-[720px] overflow-x-hidden  overflow-y-auto scrollbar-custom">
                  {selectedJobs.map((job, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedJob(job)}
                      className={`flex items-start h-44 bg-white  relative justify-between border-y rounded-s-xl border-gray-400/20 px-4  py-5  transition-transform ease-in-out duration-200 cursor-pointer ${selectedJob === job ? " border-l-4 border-teal-700 bg-[#2c6472]/10 transition-transform ease-in-out duration-200" : ""
                        }`}
                    >
                      <div className="flex flex-col min-w-[400px] items-start space-x-10 justify-center ms-3 ">
                        <div className="space-y-2">
                          <h3 className="text-base font-semibold text-[#2C6472]">{job.jobTitle}</h3>
                          <p className="text-sm text-gray-600">{job.companyName}</p>
                          <p className="text-sm text-gray-500">{job.location}</p>

                        </div>

                        <div className="flex absolute  flex-col gap-2 mt-36 -left-3 ">
                          {selectedJob?.skillData?.slice(0, 2).map((item, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-[120px_1fr] gap-2 text-sm"
                            >
                              <span className="font-medium text-black">
                                {item.label}
                              </span>
                              <span className="text-gray-500 w-64 overflow-hidden h-5 leading-snug break-words">
                                {Array.isArray(item.value) && (item.label === "Required Skills" || item.label === "Your Skills")
                                  ? item.value.slice(0, 3).join(', ')
                                  : item.value}
                              </span>
                            </div>
                          ))}
                        </div>




                      </div>
                      <div className="flex  flex-col justify-start  -mt-3 items-center"><br />
                        <div className="relative w-16 h-16">
                          <svg
                            viewBox="0 0 100 100"
                            className="absolute top-0 left-0 w-full h-full"
                          >
                            {/* Background circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              stroke="#E5E7EB"  // Light Gray Background
                              strokeWidth="7"
                              fill="none"
                            />
                            {/* Foreground circle (Progress) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              stroke="#2C6472"  // Your nice teal color
                              strokeWidth="7"
                              fill="none"
                              strokeDasharray="282"  // Circumference of the circle (2πr)
                              strokeDashoffset={282 - (282 * selectedJob.matchValue) / 100}
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"  // Rotate to start from top
                            />
                          </svg>

                          {/* Center text */}
                          <div className="absolute inset-0 flex items-center justify-center  font-semibold text-gray-800">
                            {selectedJob.matchValue}%
                          </div>
                        </div>

                        <span className="text-sm text-black mt-3 ">Profile Match</span>
                      </div>
                      <div className="text-gray-500 me-5 font-medium text-xl">⋮</div>
                    </div>
                  ))}
                </div>

                <br />
                <div className="flex justify-center items-center gap-2 pt-14  flex-wrap">
                  {/* Prev Button */}
                  <button
                    onClick={() => fetchSelectedJobs(pagination.prev)}
                    disabled={pagination.prev === null}
                    className={`px-3 py-1 rounded-md font-medium text-sm ${pagination.prev !== null
                      ? "bg-[#2C6472] text-white hover:bg-teal-900"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Prev
                  </button>

                  {/* Page Info */}
                  <div className="text-sm text-gray-600 ">
                    Page <span className="font-semibold">{pagination.current}</span> of{" "}
                    <span className="font-semibold">
                      {Math.ceil(pagination.total / pagination.per_page)}
                    </span>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => fetchSelectedJobs(pagination.next)}
                    disabled={pagination.next === null}
                    className={`px-3 py-1 rounded-md font-medium text-sm ${pagination.next !== null
                      ? "bg-[#2C6472] text-white hover:bg-teal-900"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Next
                  </button>
                </div>



              </div>
            </div>

            <div className="flex mb-5 py-3 mt-5 h-[870px] bg-white border border-gray-400/20 rounded-xl"><br />
              <div className="w-[500px] flex flex-col items-center p-6 space-y-4 overflow-y-auto  scrollbar-custom  rounded-xl bg-white">
                {selectedJob && (
                  <>
                    <div className="flex justify-between  items-start"><br />
                      <div className="flex gap-4  ">
                        <div>
                          <p className="text-gray-600 font-semibold text-xl">{selectedJob.companyName}</p>
                          <h2 className="text-2xl font-semibold text-[#2C6472]">{selectedJob.jobTitle}</h2>
                          <p className="text-sm text-gray-500">{selectedJob.location}</p>
                        </div>
                      </div>
                      <div className="flex  flex-col justify-start -mt-6 items-center"><br />
                        <div className="relative w-16 h-16">
                          <svg
                            viewBox="0 0 100 100"
                            className="absolute top-0 left-0 w-full h-full"
                          >
                            {/* Background circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              stroke="#E5E7EB"  // Light Gray Background
                              strokeWidth="7"
                              fill="none"
                            />
                            {/* Foreground circle (Progress) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              stroke="#2C6472"  // Your nice teal color
                              strokeWidth="7"
                              fill="none"
                              strokeDasharray="282"  // Circumference of the circle (2πr)
                              strokeDashoffset={282 - (282 * selectedJob.matchValue) / 100}
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"  // Rotate to start from top
                            />
                          </svg>

                          {/* Center text */}
                          <div className="absolute inset-0 flex items-center justify-center font-semibold text-gray-800">
                            {selectedJob.matchValue}%
                          </div>
                        </div>

                        <span className="text-sm w-[100px]  text-black mt-3 ">Profile Match</span>
                      </div><br />
                    </div><br />


                    <div className="flex flex-col gap-2 mt-2  pr-2">
                      {selectedJob?.skillData?.slice(0, 2).map((item, index) => {
                        const skills = Array.isArray(item.value) ? item.value : [];
                        const isExpanded = expandedSections[item.label];
                        const displaySkills = isExpanded ? skills : skills.slice(0, 2);

                        return (
                          <div
                            key={index}
                            className="grid grid-cols-[120px_1fr] mb-3 gap-2 text-sm"
                          >
                            <span className="font-semibold text-black">{item.label}</span>

                            <div className="text-gray-500 w-full leading-snug break-words">
                              <span>
                                {displaySkills.join(", ")}
                              </span>

                              {skills.length > 2 && (
                                <button
                                  onClick={() => toggleExpand(item.label)}
                                  className="ml-2 text-[#2C6472] underline font-medium text-xs hover:text-teal-800"
                                >
                                  {isExpanded ? "Less..." : "More..."}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex mx-auto  gap-5 mt-4">
                      <button
                        onClick={() => handleGenerateCV(selectedJob.id)}
                        className="px-5 py-2 border text-sm font-medium border-[#2C6472] bg-[#2C6472] w-[200px] h-[47px] text-white items-center justify-center rounded transition-transform duration-200 ease-linear hover:bg-white hover:text-[#2C6472] hover:scale-105"
                      >
                        CV
                      </button>
                      <button
                        onClick={() => handleGenerateCoverLetter(selectedJob.id)}
                        className="px-5 py-2 border text-sm font-medium border-[#2C6472] bg-[#2C6472] w-[200px] h-[47px] text-white rounded transition-transform duration-200 ease-linear hover:bg-white hover:text-[#2C6472] hover:scale-105"
                      >
                        CL
                      </button>
                    </div>
                    <br />

                    <div className="flex w-[90%] mx-auto items-center  gap-5 ms-5 ">

                      <button
                        className="flex gap-2 mx-auto justify-center items-center font-semibold text-[#2C6472] rounded-md text-sm bg-gray-200 underline border w-[200px] h-[47px] hover:border-[#2C6472] px-4  transition  hover:bg-white hover:text-[#2C6472] hover:scale-105"
                        onClick={() => handleGetJobURL(selectedJob.id)}
                      >
                        Go to Job Link
                        <img src={link_icon} alt="" />
                      </button>


                    </div><br />


                    <div className="">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">About</h4><br />
                        <p className="text-sm text-justify text-gray-700">{selectedJob.description}</p>
                      </div><br />

                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Description</h4><br />
                        <p className="text-sm text-gray-700">{selectedJob.Description}</p>
                      </div>

                      <div><br />
                        <div className="flex flex-col gap-2 mt-2">
                          {selectedJob?.skillData && (
                            <div className="space-y-6">
                              {/* Loop through skillData */}
                              {selectedJob.skillData.map((item, index) => (
                                <div key={index}>
                                  <h4 className="text-lg font-semibold text-gray-800">{item.label}</h4>
                                  <div className="flex flex-col gap-2 mt-2">
                                    {/* Check if it's an array (for skills) or just a string (for salary) */}
                                    {Array.isArray(item.value) ? (
                                      <ul className="list-disc pl-5">
                                        {item.value.map((val, i) => (
                                          <li key={i} className="text-gray-700">{val}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-gray-700">{item.value}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      </div><br />

                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        )}
      </div>


    </div >
  );
};

export default MyApplication;