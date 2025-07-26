import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import profile1 from "../../assets/profile1.png";
import total_app_icon from "../../assets/total-app.svg";
import jobs_available_icon from "../../assets/calender.png";
import selectable_jobs_icon from "../../assets/jobbag.png";
import total_experience_icon from "../../assets/cubic.png";
import complete from "../../assets/complete.svg";
import incomplete from "../../assets/incomplete.svg";
import announcements from "../../assets/announcements-icon.svg";
import lock from "../../assets/lock_icon.png";
import "aos/dist/aos.css";
import { BASE_URL } from "../../utils/api";
import Loader from "../../base/loader/Loader";
import { useMemo } from "react";
import { useProfileImage } from "../../base/ProfileEditor/ProfileImageContext";
import PackagePopup from "../../base/PackagePopup/PackagePopup";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [chartTitle, setChartTitle] = useState("");
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0);
  const { profileImage } = useProfileImage(); // 👈 use context
  const token = sessionStorage.getItem("authToken");
  const [showPackagePopup, setShowPackagePopup] = useState(false);
  const location = useLocation();
  const [infoBlock, setInfoBlock] = useState({
    userId: "",
    totalApplications: 0,
    weeklyApplications: 0,
    topJobs: 0,
    internalApps: 0,
    externalApps: 0,
    tier: "Free",
    subscriptionStart: "",
    subscriptionEnd: "",
    subscriptionPeriod: "",
    proficiencyTests: [],
  });
  const [profile, setProfile] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [newJobs, setNewJobs] = useState([]);
  const [testSummaries, setTestSummaries] = useState([]);

  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingChecklist, setLoadingChecklist] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingTests, setLoadingTests] = useState(true);



  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${BASE_URL}/new-dashboard/mini-info`, { headers })
      .then(res => {
        console.log(Object.keys(res.data.info_block));

        const data = res.data.info_block;

        const formatted = {
          userId: data.user_id || "",
          totalApplications: data.total_applications || 0,
          weeklyApplications: data.weekly_applications_count || 0,
          topJobs: data.top_jobs || 0,
          internalApps: data.internal_application_count || 0,
          externalApps: data.external_application_count || 0,
          tier: data.subscription_tier || "Free",
          subscriptionStart: data.subscription_start || "",
          subscriptionEnd: data.subscription_end || "",
          subscriptionPeriod: data.subscription_period || "",
          proficiencyTests: data.proficiency_tests || []
        };

        setInfoBlock(formatted);
        setLoadingInfo(false);
      }).catch(err => {
        console.error("Info Error", err);
        setLoadingInfo(false);
      });

    axios.get(`${BASE_URL}/new-dashboard/mini-profile`, { headers })
      .then(res => {
        setProfile(res.data.profile);
        setLoadingProfile(false);
      }).catch(err => {
        console.error("Profile Error", err);
        setLoadingProfile(false);
      });

    axios.get(`${BASE_URL}/new-dashboard/mini-checklist`, { headers })
      .then(res => {
        setChecklist(res.data.checklist);
        setLoadingChecklist(false);
      }).catch(err => {
        console.error("Checklist Error", err);
        setLoadingChecklist(false);
      });

    axios.get(`${BASE_URL}/new-dashboard/mini-jobs`, { headers })
      .then(res => {
        setNewJobs(res.data.new_jobs.mini_new_jobs);
        setLoadingJobs(false);
      }).catch(err => {
        console.error("Jobs Error", err);
        setLoadingJobs(false);
      });

    axios.get(`${BASE_URL}/new-dashboard/mini-tests`, { headers })
      .then(res => {
        setTestSummaries(res.data.test_summary.tests);
        setLoadingTests(false);
      }).catch(err => {
        console.error("Tests Error", err);
        setLoadingTests(false);
      });
  }, []);


  const fullName = `${profile?.first_name || ""} ${profile?.second_name || ""}`.trim();
  const preferredJobTitle = profile?.primary_job_title ?? "";
  const secondaryJobTitle = profile?.secondary_job_title ?? "";
  const tertiaryJobTitle = profile?.tertiary_job_title ?? "";
  const profileCompletion = profile?.profile_completion ?? 0;

  const jobTitles = [preferredJobTitle, secondaryJobTitle, tertiaryJobTitle].filter(Boolean);

  const languages = testSummaries.map((test) => ({
    language: test.languages,
    grade: test.grade,
    proficiency: test.proficiency_level,
    attemptsLeft: test.remaining_attempts,
  }));

  const statusList = [
    { label: "Multifactor Authentication", isComplete: checklist?.checklist_mfa },
    // { label: "CV Format Fixed", isComplete: checklist.cvFormat },
    // { label: "CL Format Fixed", isComplete: checklist.clFormat },
    { label: "Profile Image", isComplete: checklist?.checklist_profile_img },
    // { label: "Data Usage", isComplete: checklist.dataUsage },
    // { label: "Data Training", isComplete: checklist.dataTraining },
    // { label: "Number Lock", isComplete: checklist.numberLock },
    // { label: "Data Finalization", isComplete: checklist.dataFinalization },
    // { label: "Terms", isComplete: checklist.terms },
    // { label: "Checklist", isComplete: checklist.profileComplete },
  ];

  const jobs = useMemo(() => {
    return newJobs.length > 0
      ? newJobs.map((job) => ({
        title: job.title ?? "Unknown Title",
        company: job.company ?? "Unknown Company",
        location: job.location ?? "Unknown Location",
        profileMatch: job.profile_match ?? 0,
      }))
      : [];
  }, [newJobs]);

  const [animatedCompletions, setAnimatedCompletions] = useState([]);

  useEffect(() => {
    if (jobs.length === 0) return;

    let intervals = [];

    const newAnimated = Array(jobs.length).fill(0);
    setAnimatedCompletions(newAnimated);

    jobs.forEach((job, index) => {
      let current = 0;
      const step = job.profileMatch / (500 / 5); // duration = 500ms, interval = 5ms

      const interval = setInterval(() => {
        current += step;
        if (current >= job.profileMatch) {
          current = job.profileMatch;
          clearInterval(interval);
        }

        // Update only if there's a change
        setAnimatedCompletions((prev) => {
          const updated = [...prev];
          if (updated[index] !== Math.round(current)) {
            updated[index] = Math.round(current);
          }
          return updated;
        });
      }, 5);

      intervals.push(interval);
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [jobs]);


  if (error)
    return (
      <div className="text-red-500 flex justify-center items-center mt-64">
        {error}
      </div>
    );


  return (
    <div className="flex flex-col gap-5 bg-gray-100 p-5 ps-7">
      <div className="w-full">
        {loadingInfo ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Applied */}
            <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#FFC2B0] to-[#FF9AA2] h-[120px] w-full text-black p-4 rounded-xl animate-pulse">
              <div className="w-2/3 h-5 bg-white/50 rounded-md"></div>
              <div className="w-1/6 h-6 bg-white/60 rounded-md"></div>
            </div>

            {/* Weekly Applied */}
            <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#FDA67B] to-[#FF9D6B] h-[120px] w-full text-black p-4 rounded-xl animate-pulse">
              <div className="w-2/3 h-5 bg-white/50 rounded-md"></div>
              <div className="w-1/6 h-6 bg-white/60 rounded-md"></div>
            </div>

            {/* Recommended Jobs */}
            <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#BDE4FB] to-[#A3C7FD] h-[120px] w-full text-black p-4 rounded-xl animate-pulse">
              <div className="w-2/3 h-5 bg-white/50 rounded-md"></div>
              <div className="w-1/6 h-6 bg-white/60 rounded-md"></div>
            </div>

            {/* Package Info */}
            <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#6FE297] to-[#48D77A] h-[120px] w-full text-black p-4 rounded-xl animate-pulse">
              <div className="w-2/3 h-5 bg-white/50 rounded-md"></div>
              <div className="w-1/2 h-4 bg-white/40 rounded-md"></div>
              <div className="w-1/3 h-6 bg-white/60 rounded-md"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {/* ✅ Total Applications */}
            <div className="relative flex bg-gradient-to-br from-[#FFC2B0] to-[#FF9AA2] h-[120px] w-full text-black p-4 rounded-xl">
              <div className="flex flex-col justify-start items-start gap-5">
                <p className="text-sm md:text-base font-bold">Total Applied</p>
                <h3 className="font-bold text-lg">
                  {infoBlock.totalApplications ?? 0}
                </h3>
              </div>
              <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm">
                <img
                  width="22px"
                  height="22px"
                  className="p-1"
                  src={total_app_icon}
                  alt=""
                />
              </div>
            </div>

            {/* ✅ Weekly Applied */}
            <div className="relative flex bg-gradient-to-br from-[#FDA67B] to-[#FF9D6B] h-[120px] w-full text-black p-4 rounded-xl">
              <div className="flex flex-col justify-start items-start gap-5">
                <p className="text-sm md:text-base font-bold">Weekly Applied</p>
                <h3 className="font-bold text-lg">
                  {infoBlock.weeklyApplications ?? 0}
                </h3>
              </div>
              <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm">
                <img
                  width="24px"
                  height="24px"
                  className="p-1"
                  src={jobs_available_icon}
                  alt=""
                />
              </div>
            </div>

            {/* ✅ Recommended Jobs */}
            <div className="relative flex bg-gradient-to-br from-[#BDE4FB] to-[#A3C7FD] h-[120px] w-full text-black p-4 rounded-xl">
              <div className="flex flex-col justify-start items-start gap-5">
                <p className="text-sm md:text-base font-bold">Recommended Jobs</p>
                <h3 className="font-bold text-lg">{infoBlock.topJobs ?? 0}</h3>
              </div>
              <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm">
                <img
                  width="24px"
                  height="24px"
                  className="p-1"
                  src={selectable_jobs_icon}
                  alt=""
                />
              </div>
            </div>

            {/* ✅ Package Info */}
            <div
              onClick={() => setShowPackagePopup(true)}
              className="relative flex bg-gradient-to-br from-[#6FE297] to-[#48D77A] h-[120px] w-full text-black p-4 rounded-xl cursor-pointer"
            >
              <div className="flex flex-col justify-start items-start gap-1">
                <p className="text-sm md:text-base font-bold">Package</p>
                <div className="flex gap-1">
                  <p className="text-sm font-semibold">
                    {infoBlock.internalApps}
                  </p>{" "}
                  /
                  <p className="text-sm font-semibold">
                    {infoBlock.externalApps}
                  </p>
                </div>
                <h3 className="font-semibold">
                  {infoBlock?.tier
                    ? infoBlock.tier.charAt(0).toUpperCase() + infoBlock.tier.slice(1)
                    : "Free"}

                </h3>
              </div>
              <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm">
                <img
                  width="26px"
                  height="26px"
                  className="p-1"
                  src={total_experience_icon}
                  alt=""
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Grid - 1 */}
        <div className="flex flex-col lg:col-span-2 space-y-2">
          {/* Box - 1 */}
          {loadingProfile ? (
            <div className="flex flex-col gap-2 border rounded-xl p-5 bg-white animate-pulse space-y-3">
              {/* Profile Header Skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-gray-300 border border-black" />
                  <div className="flex flex-col gap-2">
                    <div className="w-28 h-4 bg-gray-300 rounded-md" />
                    <div className="w-20 h-3 bg-gray-200 rounded-md" />
                  </div>
                </div>

                {/* Circle Skeleton */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-full border-4 border-gray-200 bg-white" />
                  <div className="w-16 h-3 bg-gray-200 rounded-md" />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-t-[#0000000F]"></div>

              {/* Designation Skeleton */}
              <div className="flex flex-col h-[100px] gap-2 overflow-hidden">
                <div className="w-32 h-4 bg-gray-300 rounded-md" />
                <div className="flex flex-wrap gap-2">
                  {Array(3).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className="w-44 h-6 bg-gray-200 rounded-xl"
                    />
                  ))}
                </div>
              </div>

              {/* Status Skeleton */}
              <div className="flex flex-col gap-2">
                <div className="w-24 h-4 bg-gray-300 rounded-md" />
                <div className="flex flex-col gap-2 px-3 py-3 h-[98px] rounded-lg bg-[#F8F8F8] overflow-hidden">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-4 h-4 bg-gray-300 rounded-full" />
                      <div className="w-40 h-3 bg-gray-300 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 border rounded-xl p-5 bg-white space-y-3">
              {/* Profile Header Section */}
              <div className="flex items-center justify-between">
                {/* Image + Name/Title */}
                <div className="flex items-center space-x-4">
                  <img
                    src={profileImage || profile1}
                    alt=""
                    className="w-14 h-14 rounded-full bg-white object-cover  border border-black"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-[15px] font-bold">{fullName}</h3>
                    <p className="text-[12px] sm:text-sm text-gray-500">{preferredJobTitle}</p>
                  </div>
                </div>

                {/* Profile Completion Circle */}
                <div className="flex flex-col items-center">
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
                        strokeDashoffset={
                          150 - (150 * (profileCompletion ?? 0)) / 100
                        }
                        strokeLinecap="round"
                        transform="rotate(-90 28 28)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                      {profileCompletion}%
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                    Profile Complete
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-t-[#0000000F]"></div>

              {/* Designation */}
              <div className="flex flex-col h-[100px] overflow-y-auto scrollbar-custom gap-2">
                <h2 className="font-bold  text-[15px]">Job Search Titles:</h2>

                <div className="flex flex-wrap gap-2">
                  {jobTitles.map((title, index) => (
                    <p
                      key={index}
                      className="text-sm font-medium px-3.5 py-1.5 rounded-xl bg-[#F8F8F8] w-fit"
                    >
                      {title}
                    </p>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <h2 className="font-bold text-[15px]">To do List:</h2>

                <div className="flex flex-col gap-2 px-3 py-3 h-[98px] rounded-lg bg-[#F8F8F8] overflow-y-auto scrollbar-custom">
                  {statusList.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (item.label === "Profile Image") {
                          navigate("/user/profile");
                        } else if (item.label === "Multifactor Authentication") {
                          navigate("/user/settings");
                        }
                      }}
                      className="flex gap-3 cursor-pointer w-fit"
                    >
                      <img
                        width="18px"
                        src={item.isComplete ? complete : incomplete}
                        alt=""
                      />
                      <p className="font-medium text-sm">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {loadingTests ? (
            <div className="relative animate-pulse">
              {/* Coming Soon Overlay */}
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit font-semibold text-center text-[#2c6472] flex items-center z-[2] bg-gray-300/90 px-6 py-3 rounded-lg overflow-hidden shadow-md shine-effect hover:scale-105 transition-all duration-200">
                Coming Soon
              </p>

              {/* Box Skeleton */}
              <div className="border relative rounded-xl p-5 bg-white opacity-40 pointer-events-none space-y-3">
                <div className="w-44 h-4 bg-gray-300 rounded-md" />

                {/* Attempts Row */}
                <div className="flex items-center gap-4">
                  <div className="w-24 h-3 bg-gray-200 rounded-md" />
                  <div className="w-12 h-4 bg-gray-300 rounded-md" />

                  <div className="flex gap-2">
                    {Array(5).fill(0).map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full ${i < 2 ? "bg-[#2c6472]" : "bg-gray-200"
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Details Block */}
                <div className="flex flex-col gap-3 mt-3">
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-gray-300 rounded-md" />
                    <div className="w-24 h-4 bg-gray-200 rounded-md" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-gray-300 rounded-md" />
                    <div className="w-20 h-4 bg-gray-200 rounded-md" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-gray-300 rounded-md" />
                    <div className="w-24 h-4 bg-gray-200 rounded-md" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-gray-300 rounded-md" />
                    <div className="w-20 h-4 bg-gray-200 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Coming Soon Overlay */}
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit font-semibold text-center text-[#2c6472] flex items-center z-[2] bg-gray-300/90 px-6 py-3 rounded-lg overflow-hidden shadow-md shine-effect hover:scale-105 transition-all duration-200">
                Coming Soon
              </p>

              {/* Box - 2 */}
              <div className="border relative rounded-xl p-5 bg-white opacity-40 pointer-events-none space-y-3">
                <h2 className="font-bold text-[15px]">
                  Proficiency Test Details
                </h2>
                <div className="flex items-center gap-4">
                  <p className="text-sm">Remaining Attempts:</p>
                  <span className="font-bold">2 / 5</span>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#2c6472]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#2c6472]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#0000001A]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#0000001A]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#0000001A]"></div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex text-sm items-center">
                    <p className="font-semibold w-40">Language:</p>
                    <select
                      className="px-2 py-1 bg-[#0000000F] rounded-md text-sm font-semibold outline-none"
                      value={selectedLanguageIndex}
                      onChange={(e) =>
                        setSelectedLanguageIndex(Number(e.target.value))
                      }
                      disabled
                    >
                      {languages.map((lang, index) => (
                        <option key={index} value={index}>
                          {lang.language}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex text-sm">
                    <p className="font-semibold w-40">Grade:</p>
                    <p className="font-semibold">
                      {languages[selectedLanguageIndex]?.grade}
                    </p>
                  </div>

                  <div className="flex text-sm">
                    <p className="font-semibold w-40">Proficiency Level:</p>
                    <p className="font-semibold">
                      {languages[selectedLanguageIndex]?.proficiency}
                    </p>
                  </div>

                  <div className="flex text-sm">
                    <p className="font-semibold w-40">Attempts Left:</p>
                    <p className="font-semibold">
                      {languages[selectedLanguageIndex]?.attemptsLeft}
                    </p>
                  </div>
                </div>
              </div>
            </div>)}
        </div>


        {/* Grid - 2 */}
        <div className="lg:col-span-3 space-y-2">
          {/* Box - 3 */}

          {loadingJobs ? (
            <div className="flex flex-col gap-2.5 border rounded-xl p-5 bg-white animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="w-28 h-4 bg-gray-300 rounded-md" />
                <div className="w-16 h-4 bg-gray-200 rounded-md" />
              </div>

              {Array(3).fill(0).map((_, index) => (
                <React.Fragment key={index}>
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="w-36 h-4 bg-gray-300 rounded-md" />
                      <div className="w-28 h-3 bg-gray-200 rounded-md" />
                      <div className="w-20 h-3 bg-gray-200 rounded-md" />
                    </div>

                    {/* Circle Skeleton for Match % */}
                    <div className="flex flex-col items-center mr-5 gap-1">
                      <div className="w-14 h-14 rounded-full border-4 border-gray-200 bg-white" />
                      <div className="w-20 h-3 bg-gray-200 rounded-md" />
                    </div>
                  </div>

                  {index !== 2 && (
                    <div className="mx-auto border-t border-t-[#0000000F] w-[97%]"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 border rounded-xl p-5 bg-white space-y-3">
              <div className="flex justify-between">
                <h2 className="font-bold text-[15px]">New Jobs </h2>
                <Link to="/user/my-jobs/internal">
                  {" "}
                  <p className="text-[#2c6472] font-medium">View All</p>
                </Link>
              </div>

              {jobs.length > 0 ? (
                jobs.map((job, index) => (
                  <React.Fragment key={index}>
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-1">
                        <h2 className="font-semibold text-[#2c6472]">
                          {job.title}
                        </h2>
                        <p className="font-medium text-[13px] md:text-sm">{job.company}</p>
                        <p className="text-[13px] md:text-sm">{job.location}</p>
                      </div>

                      {/* Profile Completion Circle */}
                      <div className="flex flex-col items-center mr-5">
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
                              strokeDashoffset={
                                !isNaN(animatedCompletions[index])
                                  ? 150 - (150 * animatedCompletions[index]) / 100
                                  : 150
                              }
                              strokeLinecap="round"
                              transform="rotate(-90 28 28)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                            {animatedCompletions[index]}%
                          </div>
                        </div>
                        <span className="text-xs md:text-xs font-medium text-gray-600 mt-1 whitespace-nowrap">
                          Profile Match
                        </span>
                      </div>
                    </div>

                    {index !== jobs.length - 1 && (
                      <div className="mx-auto border-t border-t-[#0000000F] w-[97%]"></div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <div className="text-gray-500 text-sm text-center py-4">
                  No new jobs found matching your profile.
                </div>
              )}
            </div>
          )}





          {/* Box - 4 */}
          {loadingInfo ? (
            <div className="border md:h-[220px] rounded-xl p-5 bg-white space-y-3 animate-pulse">
              <div className="flex justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-4 bg-gray-300 rounded-md" />
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                </div>
                <div className="w-16 h-4 bg-gray-300 rounded-md" />
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-20 h-3 bg-gray-300 rounded-md" />
                  <div className="w-10 h-3 bg-gray-200 rounded-md" />
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-md" />
                <div className="w-[90%] h-3 bg-gray-200 rounded-md" />
                <div className="w-[85%] h-3 bg-gray-200 rounded-md" />
                <div className="w-[60%] h-3 bg-gray-200 rounded-md" />
              </div>
            </div>
          ) : (
            <div className="border md:h-[220px] rounded-xl p-5 bg-white space-y-3">
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <h2 className="font-bold text-[15px]">Announcements</h2>
                  <img src={announcements} alt="" />
                </div>
                <div className="">
                  <Link to="/user/announcements">
                    <p className="text-[#2c6472] font-medium">View All</p>
                  </Link>
                </div>
              </div>

              <p className="text-[#000000A1] font-medium text-sm">
                <span className="text-[#2c6472] text-sm md:text-base font-semibold mr-2">
                  17 Jul 2025
                </span>
                - The new version of{" "}
                <span className="text-[#2c6472] font-semibold">JSE AI</span>{" "}
                brings major improvements across the platform. With advanced AI
                matching, optimized performance, and a refreshed UI, the app is
                now smarter and faster than ever before. These upgrades aim to
                make your job search smoother and more effective.
              </p>
            </div>
          )}
        </div>
      </div>

      {showPackagePopup && (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
          <div className="relative z-50">
            <PackagePopup
              isOpen={showPackagePopup}
              onClose={() => setShowPackagePopup(false)}
              infoBlock={infoBlock} // 🔥 full data going in
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
