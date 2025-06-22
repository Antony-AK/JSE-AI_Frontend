
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import Loader from "../../base/loader/Loader.jsx";
import filter_icon from '../../assets/filter-icon.svg'
import arrow_down from '../../assets/arrow-down-drop.png'
import download_icon from '../../assets/downloadicon.png'
import link_icon from '../../assets/link-icon.svg'




const MyApplication = () => {
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generateCV, setGenerateCV] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
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
  const [showFilters, setShowFilters] = useState(false);

  const toggleDropdownfilter = () => setShowFilters((prev) => !prev);

  const token = sessionStorage.getItem("authToken");



  const useDummyData = true; // 👉 set this to false when you want to call API

  const fetchSelectedJobs = async (customOffset = offset) => {
    setLoading(true);

    if (useDummyData) {
      // ✅ Dummy Job Data for Testing
      const dummyJob = {
        job_id: 1,
        title: "Full Stack Developer",
        company: "OpenAI",
        posted_date: "2025-05-01",
        expected_salary: { min: 1200000, max: 1800000 },
        location: "Remote",
        description: "Work on cutting-edge AI web applications.",
        skills: ["React", "Node.js", "MongoDB", "Express"],
        user_skills: ["React", "Node.js"],
        match_score: 88,
        selected: true,
        cv_generated: true,
        cover_letter_generated: true,
        view_link: "https://example.com/view",
      };

      const mappedJobs = [{
        id: dummyJob.job_id,
        title: dummyJob.title,
        jobTitle: dummyJob.title,
        company: dummyJob.company,
        companyName: dummyJob.company,
        postedDate: dummyJob.posted_date || "Not specified",
        minSalary: dummyJob.expected_salary.min || "?",
        maxSalary: dummyJob.expected_salary.max || "?",
        location: dummyJob.location || "Location not specified",
        description: `We are looking for a skilled ${dummyJob.title} to join ${dummyJob.company}.`,
        Description: dummyJob.description || "No role description provided.",
        skillData: [
          {
            label: "Required Skills",
            value: dummyJob.skills,
          },
          {
            label: "Your Skills",
            value: dummyJob.user_skills,
          },
          {
            label: "Expected Salary",
            value: `${dummyJob.expected_salary?.min || "?"} - ${dummyJob.expected_salary?.max || "?"}`,
          },
        ],
        matchValue: dummyJob.match_score,
        selected: dummyJob.selected,
        cvGenerated: dummyJob.cv_generated,
        coverLetterGenerated: dummyJob.cover_letter_generated,
        viewLink: dummyJob.view_link,
      }];

      setSelectedJobs(mappedJobs);
      setSelectedJob(mappedJobs[0]);
      setPagination({
        current: 1,
        total: 1,
        per_page: perPage,
        next: null,
        prev: null,
      });

      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.get("https://jse.arshan.digital/b1/api/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
        params: { offset: customOffset, limit: perPage },
      });

      const fetchedJobs = response.data.applications || [];
      const paginationInfo = response.data.pagination || {};
      const totalItems = paginationInfo.total || 0;
      const currentPage = Math.floor(customOffset / perPage) + 1;

      const mappedJobs = fetchedJobs.map((job) => ({
        id: job.job_id,
        title: job.title,
        jobTitle: job.title,
        company: job.company,
        companyName: job.company,
        postedDate: job.posted_date || "Not specified",
        minSalary: job.expected_salary.min || "?",
        maxSalary: job.expected_salary.max || "?",
        location: job.location || "Location not specified",
        description: `We are looking for a skilled ${job.title} to join ${job.company}.`,
        Description: job.description || "No role description provided.",
        skillData: [
          {
            label: "Required Skills",
            value: Array.isArray(job.skills)
              ? job.skills
              : typeof job.skills === "string"
                ? job.skills.split(",").map((s) => s.trim())
                : [],
          },
          {
            label: "Your Skills",
            value: Array.isArray(job.user_skills)
              ? job.user_skills
              : typeof job.user_skills === "string"
                ? job.user_skills.split(",").map((s) => s.trim())
                : [],
          },
          {
            label: "Expected Salary",
            value: `${job.expected_salary?.min || "?"} - ${job.expected_salary?.max || "?"}`,
          },
        ],
        matchValue: job.match_score || Math.floor(Math.random() * 30) + 70,
        selected: job.selected,
        cvGenerated: job.cv_generated,
        coverLetterGenerated: job.cover_letter_generated,
        viewLink: job.view_link,
      }));

      setSelectedJobs(mappedJobs);
      setSelectedJob(mappedJobs[0]);
      setPagination({
        current: currentPage,
        total: totalItems,
        per_page: perPage,
        next: customOffset + perPage < totalItems ? customOffset + perPage : null,
        prev: customOffset - perPage >= 0 ? customOffset - perPage : null,
      });

      setOffset(customOffset);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response?.data?.message || "⚠ Failed to load applications.";
      setError(errMsg);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedJobs();
  }, []);





  const handleGenerateCV = async (jobId) => {
    try {
      setIsGenerating(true); // Show animation
      setGenerateCV("cv");

      const response = await axios.post(
        "https://jse.arshan.digital/b1/generate-resume",
        { job_id: jobId }, // <-- This is the request body (data)
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // <-- Replace this with actual token variable
          },
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const cvLink = document.createElement("a");
      cvLink.href = url;
      cvLink.setAttribute("download", `CV_${jobId}.pdf`);
      document.body.appendChild(cvLink);
      cvLink.click();
      cvLink.remove();
      window.URL.revokeObjectURL(url); // optional cleanup
      alert("CV generated successfully!");
    } catch (error) {
      console.error("Error generating CV:", error);
      if (error.response) {
        console.log("Server responded with:", error.response.data);
      }
      alert("Failed to generate CV. Please try again.");
    } finally {
      setIsGenerating(false); // Hide animation
    }
  };

  // const handleDownloadAllDocs = (cvBlobUrl, clBlobUrl, jobId) => {
  //   if (!cvBlobUrl || !clBlobUrl) {
  //     alert("Please generate both the CV and Cover Letter first.");
  //     return;
  //   }

  //   // Download CV
  //   const cvLink = document.createElement("a");
  //   cvLink.href = cvBlobUrl;
  //   cvLink.setAttribute("download", `CV_${jobId}.docx`);
  //   document.body.appendChild(cvLink);
  //   cvLink.click();
  //   cvLink.remove();
  //   window.URL.revokeObjectURL(cvBlobUrl); // optional cleanup

  //   // Download Cover Letter
  //   const clLink = document.createElement("a");
  //   clLink.href = clBlobUrl;
  //   clLink.setAttribute("download", `Cover_Letter_${jobId}.docx`);
  //   document.body.appendChild(clLink);
  //   clLink.click();
  //   clLink.remove();
  //   window.URL.revokeObjectURL(clBlobUrl); // optional cleanup
  // };





  // const handleGetJobURL = async (job_id) => {
  //   try {
  //     const token = sessionStorage.getItem("authToken") || "your-fallback-token";

  //     const response = await axios.post(
  //       "https://jse.arshan.digital/b1/provide-link",
  //       { job_id: job_id },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );


  //     // SAFE checking 🔥
  //     if (response.data?.job_link) {
  //       const jobLink = response.data.job_link;
  //       window.open(jobLink, "_blank"); // Open in new tab
  //     } else {
  //       console.error("🚨 No valid job link found in the response:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("❌ AxiosError:", error);
  //   }
  // };






  const handleGenerateCoverLetter = async (jobId) => {
    try {
      setIsGenerating(true);
      setGenerateCV("cl");
      const response = await axios.post(
        "https://jse.arshan.digital/b1/generate-cover-letter",
        { job_id: jobId }, // <-- This is the request body (data)
        {
          responseType: "blob", // Important for downloading Word files
          headers: {
            Authorization: `Bearer ${token}`, // <-- Replace this with actual token variable
          },
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = window.URL.createObjectURL(blob);
      const clLink = document.createElement("a");
      clLink.href = url;
      clLink.setAttribute("download", `Cover_Letter_${jobId}.docx`);
      document.body.appendChild(clLink);
      clLink.click();
      clLink.remove();
      window.URL.revokeObjectURL(url); // optional cleanup
      alert("Cover Letter generated successfully!");
    } catch (error) {
      console.error("Error generating Cover Letter:", error);
      alert("Failed to generate Cover Letter. Please try again.");
    } finally {
      setIsGenerating(false); // Hide animation
    }
  };

  const handleJobTitleClick = (title) => {
    setSelectedJob(title);
    console.log("Selected title:", title) // Set the selected job title for filtering
  };


  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };



  // const handleJobTitleClick = (title) => {
  //   setSelectedJobTitle(title);
  //   console.log("Selected title:", title) // Set the selected job title for filtering
  // };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };





  if (loading) return <Loader />;

  return (
    <div className="flex flex-col h-screen bg-gray-50 px-6 ms-2">
      <div className="flex items-center w-[60%]  py-4 mt-3 relative">
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
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute left-[260px] px-6 py-1.5 flex justify-center items-center font-medium text-[13px] rounded bg-white shadow-sm border border-gray-300 text-black hover:scale-105"
              >
                Recommended Jobs <img src={arrow_down} className="ms-0.5" alt="" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="absolute left-[500px] px-6 py-1.5 flex justify-center items-center font-medium text-[13px] rounded bg-white shadow-sm border border-gray-300 text-black hover:scale-105"
              >
                Languages <img src={arrow_down} className="ms-0.5" alt="" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

      </div>



      <div className="flex flex-col w-full min-h-screen bg-gray-40">
        <br />
        {/* {selectedJobs.length === 0 ? (
          <div className="absolute top-1/2 left-[calc(264px+40%)] transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No Selected Applications
            </h2>
            <p className="text-gray-500">Please check back later.</p>
          </div>
        ) : ( */}
        <div className="flex flex-1 border-t border-gray-300  gap-5">
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
                    className={`flex items-start h-44 bg-white justify-between border-y rounded-s-xl border-gray-400/20 px-4  py-5 hover:scale-[1.01] transition-transform ease-in-out duration-200 cursor-pointer ${selectedJob === job ? " border-l-4 border-teal-700 bg-[#2c6472]/10 transition-transform ease-in-out duration-200" : ""
                      }`}
                  >
                    <div className="flex flex-col min-w-[400px] items-start space-x-10 justify-center ms-5 ">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-[#2C6472]">{job.jobTitle}</h3>
                        <p className="text-sm text-gray-600">{job.companyName}</p>
                        <p className="text-sm text-gray-500">{job.location}</p>
                     
                      </div>
                      
                  <div className="flex flex-col gap-2  mt-2">
                    {selectedJob?.skillData?.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex gap-5 -ms-10 text-sm">
                        <span
                          className={`font-semibold text-black ${item.label === "Your Skills" ? "me-8" : ""
                            }`}
                        >
                          {item.label}
                        </span>
                        <span className="text-gray-400 text-end">
                          {Array.isArray(item.value) ? item.value.join(', ') : item.value}
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
            <div className="w-[500px] p-6 space-y-4 overflow-y-auto  scrollbar-custom  rounded-xl bg-white">
              {selectedJob && (
                <>
                  <div className="flex justify-between  items-start"><br />
                    <div className="flex gap-4 me-3 ">
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

                      <span className="text-sm text-black mt-3 ">Profile Match</span>
                    </div><br />
                  </div><br />


                  <div className="flex flex-col gap-2 ms-7 mt-2">
                    {selectedJob?.skillData?.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex gap-5 text-sm">
                        <span
                          className={`font-semibold text-black ${item.label === "Your Skills" ? "me-8" : ""
                            }`}
                        >
                          {item.label}
                        </span>
                        <span className="text-gray-400 text-end">
                          {Array.isArray(item.value) ? item.value.join(', ') : item.value}
                        </span>
                      </div>
                    ))}
                  </div>





                  <div className="flex flex-col ">
                    <div className="flex mx-auto  gap-5"><br />
                      <button onClick={() => handleGenerateCV(selectedJob.id)} className="px-5 py-2 border text-sm font-medium border-[#2C6472] bg-[#2C6472] w-[200px] h-[47px] text-white items-center justify-center rounded transition-transform duration-200 ease-linear hover:bg-white hover:text-[#2C6472] hover:scale-105">
                        Generate CV
                      </button>
                      <button onClick={() => handleGenerateCoverLetter(selectedJob.id)} className="px-5 py-2 border text-sm font-medium border-[#2C6472] bg-[#2C6472] w-[200px] h-[47px] text-white rounded transition-transform duration-200 ease-linear hover:bg-white hover:text-[#2C6472] hover:scale-105">
                        Generate CL
                      </button>
                    </div><br />

                    <div className="flex w-[90%] mx-auto items-center  gap-5 ms-5 ">
                      
                      <button
                        className="flex gap-2 mx-auto justify-center items-center font-semibold text-[#2C6472] rounded-md text-sm bg-gray-200 underline border w-[200px] h-[47px] hover:border-[#2C6472] px-4  transition  hover:bg-white hover:text-[#2C6472] hover:scale-105"
                      // onClick={() => handleGetJobURL(job.job_id)}
                      >
                        Go to Job Link
                        <img src={link_icon} alt="" />
                      </button>
                    </div><br />
                  </div>

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

        {/* )} */}
      </div>

      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="flex w-[300px] h-[320px] rounded border-b-8 border-[#2C6472] bg-white flex-col items-center justify-center">


            <div className="relative flex justify-center items-center w-[130px] h-[200px] border mt-7 mb-5 bg-black/30 shadow-lg overflow-hidden">

              {/* Scan line animation */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2C6472] to-transparent animate-scan"></div>

              {/* Typewriter Text */}

            </div>
            <div className="">
              <h3 className="text-base font-semibold  text-gray-800 mb-4">  AI is generating {generateCV === 'cv' ? 'CV' : 'Cover Letter'}...
              </h3>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyApplication;