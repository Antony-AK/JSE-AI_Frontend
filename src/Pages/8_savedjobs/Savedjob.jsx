import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import link_icon from '../../assets/link-icon.svg'
import { BASE_URL } from "../../utils/api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import animationgif from '../../assets/Animations.gif'
import LanguageSelectModel from "../../base/LanguageModelPopup/LanguageSelectModel.jsx";
import LimitReachedModal from "../6_my_jobs/MyJobsPopUp/LimitReachedModel.jsx";
import SkeletonJobApplicationTracker from "../../base/InternalDesignComponent/InternalDesignLoader.jsx";
import InternalRightDesignLoader from "../../base/InternalDesignComponent/InternalRightDesignLoader.jsx";
import { t } from "../../utils/i18n.js";

const SavedJob = () => {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const navigate = useNavigate();
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("both"); // default
  const [showLangModal, setShowLangModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "cv" or "cl"

  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const selectedJobRef = useRef(null);
  const menuRef = useRef(null);

  const [infoBlock, setInfoBlock] = useState(null);



  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("All");

  const options = ["All", "New"];

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);

    // 🟢 Trigger only for "All"
    if (option === "All") {
      setSelectedLanguage("both");
    }
    // 🛑 "New" does nothing special for language — no fetch
  };

  useEffect(() => {
    const fetchInfoBlock = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const res = await fetch(`${BASE_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.info_block) setInfoBlock(data.info_block);
      } catch (err) {
        console.error("Failed to fetch info block:", err);
      }
    };

    fetchInfoBlock();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuIndex(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

    let didShowLoader = false;

    // ⏳ Show loader ONLY IF request takes longer than 2s
    const showLoaderTimeout = setTimeout(() => {
      setLoading(true);
      didShowLoader = true;
    }, 2000);

    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.get(`${BASE_URL}/saved-jobs`, {
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
          coverLetterGenerated: job.cl_generated || false,
          viewLink: job.view_link || "#",
        };
      });


      setSelectedJobs(mappedJobs);

      // 🧠 Restore previously selected job from sessionStorage
      const savedSelectedJobId = sessionStorage.getItem("selectedJobId");
      if (savedSelectedJobId) {
        const jobToSelect = mappedJobs.find((job) => job.id === savedSelectedJobId);
        setSelectedJob(jobToSelect || mappedJobs[0]); // fallback to first
      } else {
        setSelectedJob(mappedJobs[0]);
      }

      setTimeout(() => {
        if (selectedJobRef.current) {
          selectedJobRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center", // 👈 scrolls to center of the list
          });
        }
      }, 300); // wait for DOM to fully render



      setPagination({
        current: currentPage,
        total: totalItems,
        per_page: paginationInfo.per_page || perPage,
        next: paginationInfo.next || null,
        prev: paginationInfo.prev || null,
      });

      setOffset(customOffset);
    } catch (error) {
      const errMsg = error.response?.data?.message || "⚠ Failed to fetch jobs.";
      setError(errMsg);
    } finally {
      clearTimeout(showLoaderTimeout);

      // 🧼 Only hide loader if it was shown
        setLoading(false);
      
    }
  };



  useEffect(() => {
    const savedOffset = sessionStorage.getItem("jobPaginationOffset");
    const validOffset = savedOffset ? parseInt(savedOffset) : 0;


    if (selectedLanguage === "both") {
      fetchSelectedJobs(validOffset); // ⬅️ fetch from saved offset
    } else {
      fetchJobsByLanguage(selectedLanguage, validOffset); // pass to lang fetch too
    }
  }, [selectedLanguage]);



  const handleGenerateClick = (type) => {
    const jobId = selectedJob?.id;
    if (!jobId) {
      toast.error("No job selected.");
      return;
    }

    // 🧠 Validate infoBlock presence first
    if (!infoBlock) {
      toast.error("User info not loaded. Please try again.");
      return;
    }

    // 💡 Check internal usage limit
    const isFreePlan = infoBlock.subscription_tier === "free";
    const internalUsed = infoBlock.internal_application_count || 0;

    const cvAlreadyGenerated = selectedJob?.cvGenerated;
    const clAlreadyGenerated = selectedJob?.coverLetterGenerated;
    if (
      isFreePlan &&
      internalUsed === 0 &&
      !cvAlreadyGenerated &&
      !clAlreadyGenerated
    ) {
      setShowLimitModal(true);
      return;
    }

    const jobLanguageMap = JSON.parse(sessionStorage.getItem("jobLanguages") || "{}");
    const savedLang = jobLanguageMap[jobId];

    setActionType(type); // save action type for later

    if (
      (type === "cv" && cvAlreadyGenerated) ||
      (type === "cl" && clAlreadyGenerated)
    ) {
      handleLanguageSelect(savedLang || "english", type);
      return;
    }

    if (savedLang) {
      handleLanguageSelect(savedLang, type);
    } else {
      setShowLangModal(true);
    }
  };






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



  const handleLanguageSelect = async (lang, forcedType = null) => {
    setShowLangModal(false);
    const jobId = selectedJob?.id;
    if (!jobId) return console.warn("⚠️ No selected job!");

    const type = forcedType || actionType; // 👈 fallback to actionType if not passed

    const payload = {
      job_id: jobId,
      job_language: lang,
      cl_format: "ModernCL",
      cv_format: "EuropassCV"
    };

    const endpoint =
      type === "cv"
        ? `${BASE_URL}/internal/generate-resume`
        : `${BASE_URL}/internal/generate-cover-letter`;

    const sessionKey = type === "cv" ? "generatedCV" : "generatedCL";
    const navigatePath = type === "cv" ? "/user/cv" : "/user/cl";

    try {
      setIsLoading(true);

      // 🧠 Save language per job
      const jobLanguageMap = JSON.parse(sessionStorage.getItem("jobLanguages") || "{}");
      jobLanguageMap[jobId] = lang;
      sessionStorage.setItem("jobLanguages", JSON.stringify(jobLanguageMap));
      sessionStorage.setItem("selectedLanguage", lang);

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Generated", response.data);

      sessionStorage.setItem(sessionKey, JSON.stringify({ job_id: jobId }));
      navigate(navigatePath, { state: { jobId } });
    } catch (error) {
      console.error(`❌ Failed to generate ${type}:`, error);
      sessionStorage.setItem(sessionKey, JSON.stringify({ error: true }));
    } finally {
      setIsLoading(false);
    }
  };




  const getOffsetFromUrl = (url) => {
    if (!url) return 0;
    const params = new URLSearchParams(url.split("?")[1]);
    return parseInt(params.get("offset")) || 0;
  };


  return (
    <div className="flex items-center flex-col h-screen bg-gray-50 px-6  w-[calc(99vw-264px)] ">


      <div className="flex flex-col w-full min-h-screen bg-gray-40">
        <br />
        {loading ? (
          <div className="flex justify-center gap-10 items-center">
            <SkeletonJobApplicationTracker />
            <InternalRightDesignLoader />
          </div>
        ) : selectedJobs.length === 0 ? (
          <div className="absolute top-1/2 left-[calc(264px+40%)] transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
             {t("trackers.noJobsFound")}
            </h2>
            <p className="text-gray-500">{t("trackers.checkBackLater")}</p>
          </div>
        ) : (
          <div className="flex flex-1  -mt-5  gap-5">
            <div className="flex flex-col w-[54%]">

              <div className="p-5 flex justify-between pt-4">
                <div>
                  <h2 className="text-sm font-semibold">{t("trackers.showingJobs", { count: pagination.total })}</h2>
                  <p className="text-sm text-gray-400 mt-1">{t("trackers.basedOnPreferences")}</p>
                </div>


              </div>

              <div className="w-full mb-5 -space-y-6 rounded-xl bg-white border border-gray-400/20 "><br />



                <div className="h-[720px] overflow-x-hidden  overflow-y-auto scrollbar-custom">
                  {selectedJobs.map((job, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedJob(job);
                        sessionStorage.setItem("selectedJobId", job.id); // 🧠 save selected job
                        sessionStorage.setItem("jobPaginationOffset", offset); // 🆕 Save offset

                      }}
                      ref={selectedJob?.id === job.id ? selectedJobRef : null} // 💡 Only add ref to selected job
                      className={`flex items-start h-48 bg-white  relative justify-between border-y rounded-s-xl border-gray-400/20 px-4  py-5  transition-transform ease-in-out duration-200 cursor-pointer ${selectedJob === job ? " border-l-4 border-teal-700 bg-[#2c6472]/10 transition-transform ease-in-out duration-200" : ""
                        }`}
                    >
                      <div className="flex flex-col min-w-[400px] items-start space-x-10 justify-center ms-3 mb-2">
                        <div className="space-y-2">
                          <h3 className="text-base w-96 font-semibold text-[#2C6472] h-12 overflow-y-hidden">{job.jobTitle}</h3>
                          <p className="text-sm   text-gray-600">{job.companyName}</p>
                          <p className="text-sm mb-5 text-gray-500">{job.location}</p>

                        </div>

                        <div className="flex absolute  flex-col gap-2 mt-40 -left-3 ">
                          {job?.skillData?.slice(0, 2).map((item, index) => (
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
                      <div className="flex  flex-col justify-start mr-2 items-center"><br />
                        <div className="relative gap-1 w-24 h-16">
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
                              strokeDashoffset={282 - (282 * job.matchValue) / 100}
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"  // Rotate to start from top
                            />
                          </svg>

                          {/* Center text */}
                          <div className="absolute inset-0 flex m-2 items-center justify-center text-[13px]  font-semibold text-gray-800">
                            {job.matchValue}%
                          </div>
                        </div>

                        <span className="text-sm text-black mt-3 ">{t("trackers.profileMatch")}</span>
                      </div>
                      {/* ✅ CV/CL Generated Badges */}
                      <div className="absolute bottom-3 right-1.5 flex gap-1">
                        {job?.cvGenerated && (
                          <span className="text-[9px] bg-gray-100 border text-[#2C6472] font-semibold px-2 py-[2px] rounded-full">
                           CV Generated
                          </span>
                        )}
                        {job?.coverLetterGenerated && (
                          <span className="text-[9px] bg-gray-100 border text-[#2C6472] font-semibold px-2 py-[2px] rounded-full">
                            Cl Generated
                          </span>
                        )}
                      </div>
                      <div className="absolute top-2 right-3">
                        <button
                          className="text-gray-500 font-medium text-xl hover:bg-gray-200 rounded-full w-7"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent parent click
                            setActiveMenuIndex(activeMenuIndex === index ? null : index);
                          }}
                        >
                          ⋮
                        </button>

                        {activeMenuIndex === index && (
                          <div ref={menuRef} className="absolute -right-2 mt-2 bg-white border border-gray-200 shadow-md rounded-md z-5">
                            <button
                              className="w-fit text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              onClick={async (e) => {
                                e.stopPropagation();

                                const token = sessionStorage.getItem("authToken");
                                if (!token) {
                                  toast.warning("You need to be logged in to delete saved jobs!");
                                  return;
                                }

                                try {
                                  const jobId = job.job_id || job.id;

                                  const response = await axios.delete(
                                    `${BASE_URL}/saved-jobs/${jobId}`,
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  );

                                  console.log("🗑️ Job deleted:", response.data);
                                  toast.success("Job removed from saved jobs!");

                                  // 🔥 Instantly remove the deleted job from state
                                  setSelectedJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));

                                  // 🧠 Reset selected job if it was deleted
                                  if (selectedJob?.id === jobId) {
                                    setSelectedJob(null);
                                  }
                                } catch (err) {
                                  console.error("❌ Failed to delete job:", err.response?.data || err.message);
                                  toast.error("Failed to delete saved job. Try again.");
                                } finally {
                                  setActiveMenuIndex(null); // close the dropdown after action
                                }
                              }}

                            >
                               {t("trackers.remove")}
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  ))}
                </div>


                <br />
                <div className="flex justify-center items-center gap-2 pt-14  flex-wrap">
                  {/* Prev Button */}
                  <button
                    onClick={() => {
                      const prevOffset = getOffsetFromUrl(pagination.prev);
                      fetchSelectedJobs(prevOffset);
                    }}
                    disabled={!pagination.prev}
                    className={`px-3 py-1 rounded-md font-medium text-sm ${pagination.prev
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
                    onClick={() => {
                      const nextOffset = getOffsetFromUrl(pagination.next);
                      fetchSelectedJobs(nextOffset);
                    }}
                    disabled={!pagination.next}
                    className={`px-3 py-1 rounded-md font-medium text-sm ${pagination.next
                      ? "bg-[#2C6472] text-white hover:bg-teal-900"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Next
                  </button>


                </div>

                <br />




              </div>
            </div>

            <div className="flex mb-5 py-3 w-[46%] mt-5 h-[870px] bg-white border border-gray-400/20 rounded-xl"><br />


              <div className="w-full flex flex-col items-center p-6 space-y-4 overflow-y-auto  scrollbar-custom  rounded-xl bg-white">
                {selectedJob && (
                  <>
                    <div className="flex justify-between  items-start"><br />
                      <div className="flex gap-4  ">
                        <div>
                          <p className="text-gray-600 font-semibold text-xl">{selectedJob.companyName}</p>
                          <h2 className="text-xl 2xl:text-2xl font-semibold text-[#2C6472]">{selectedJob.jobTitle}</h2>
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
                          <div className="absolute inset-0 flex items-center text-[13px] justify-center font-semibold text-gray-800">
                            {selectedJob.matchValue}%
                          </div>
                        </div>

                        <span className="text-sm w-[100px]  text-black mt-3 ">{t("trackers.profileMatch")}</span>
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

                    <div className="flex w-full gap-5 mt-4">
                      {["cv", "cl"].map((type) => {
                        const isGenerated =
                          type === "cv"
                            ? selectedJob?.cvGenerated
                            : selectedJob?.coverLetterGenerated;

                        const label = isGenerated ? `${type.toUpperCase()} Generated` : type.toUpperCase();

                        return (
                          <button
                            key={type}
                            onClick={() => handleGenerateClick(type)}
                            className={`px-7 py-2 text-sm font-medium rounded-3xl transition-transform duration-200 ease-linear w-[240px] h-[47px] flex items-center justify-center ${isGenerated
                              ? "bg-[#2C6472]/50 text-white border  "
                              : "bg-[#2C6472] text-white border border-[#2C6472] hover:bg-white hover:text-[#2C6472] hover:scale-105"
                              }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <br />

                    <div className="flex w-[90%] mx-auto items-center  gap-5 ms-5 ">

                      <button
                        className="flex gap-2 mx-auto justify-center  items-center font-semibold text-[#2C6472] rounded-3xl text-sm bg-[#F4F4F4F4] underline border w-full h-[47px] hover:border-[#2C6472] px-4  transition  hover:bg-white hover:text-[#2C6472] hover:scale-105"
                        onClick={() => handleGetJobURL(selectedJob.id)}
                      >
                        {t("trackers.goToJobLink")}
                        <img src={link_icon} alt="" />
                      </button>

                      <LanguageSelectModel
                        isOpen={showLangModal}
                        onClose={() => setShowLangModal(false)}
                        onSelect={handleLanguageSelect}
                      />

                    </div><br />


                    <div className="">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{t("trackers.about")}</h4><br />
                        <p className="text-sm text-justify text-gray-700">{selectedJob.description}</p>
                      </div><br />

                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{t("trackers.description")}</h4><br />
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

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <img
              src={animationgif}
              alt="Loading..."
              className="w-52 h-52 mb-4"
            />
            <p className="text-white text-xl font-semibold">{t("trackers.generating")}</p>
          </div>
        </div>
      )}

      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        type="internal"
      />



    </div >
  );
};

export default SavedJob;