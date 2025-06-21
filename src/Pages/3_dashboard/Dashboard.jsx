import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import profile from "../../assets/profile1.png"
import total_app_icon from "../../assets/total-app.svg"
// import jobs_available_icon from "../../assets/jobs-available.svg"
// import selectable_jobs_icon from '../../assets/selectable-jobs.svg'
// import total_experience_icon from '../../assets/total-experience.svg'
import complete from '../../assets/complete.svg'
import incomplete from '../../assets/incomplete.svg'
import announcements from '../../assets/announcements-icon.svg'
import AOS from "aos";
import lock from "../../assets/lock_icon.png"
import "aos/dist/aos.css";
import { BASE_URL } from "../../utils/api"
import Loader from '../../base/loader/Loader'
import { useMemo } from "react";
import { Player } from '@lottiefiles/react-lottie-player'

const Dashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0);
  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      navigate("/user/login");
      setError("No auth token found.");
      setLoading(false);
      return;
    }

    axios
      .get(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setProfileData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || "⚠ Failed to load profile data.";
        alert(errorMessage);
        setError(errorMessage);
        setLoading(false);
      });
  }, [token]);


  const checklist = {
    personalInfo: profileData?.checklist?.checklist_personal_info ?? false,
    workExperience: profileData?.checklist?.checklist_work_experience ?? false,
    academics: profileData?.checklist?.checklist_academics ?? false,
    pastProjects: profileData?.checklist?.checklist_past_projects ?? false,
    languages: profileData?.checklist?.checklist_languages ?? false,
    certifications: profileData?.checklist?.checklist_certifications ?? false,
    jobTitles: profileData?.checklist?.checklist_job_titles ?? false,
    keySkills: profileData?.checklist?.checklist_key_skills ?? false,
    profileComplete: profileData?.checklist?.checklist_complete ?? false,
  };

  const infoBlock = {
    userId: profileData?.info_block?.auth_user_id ?? "",
    tier: profileData?.info_block?.subscription_tier ?? "free",
    dailyJobLimit: profileData?.info_block?.daily_selectable_jobs_count ?? 0,
    dailyCVLimit: profileData?.info_block?.daily_generatable_cv ?? 0,
    dailyCLLimit: profileData?.info_block?.daily_generatable_coverletter ?? 0,
    totalApplications: profileData?.info_block?.total_applications ?? 0,
    totalJobs: profileData?.info_block?.total_jobs_available ?? 0,
  };

  const newJobs = profileData?.new_jobs?.mini_new_jobs ?? [];

  const fullName = `${profileData?.profile?.first_name || " "} ${profileData?.profile?.second_name || ""}`.trim();
  const profileCompletion = profileData?.profile?.profile_completion ?? 0;
  const preferredJobTitle = profileData?.profile?.primary_job_title ?? "";
  const secondaryJobTitle = profileData?.profile?.secondary_job_title ?? "";
  const tertiaryJobTitle = profileData?.profile?.tertiary_job_title ?? "";

  const jobTitles = [preferredJobTitle, secondaryJobTitle, tertiaryJobTitle].filter(Boolean);

  const testSummaries = profileData?.test_summary?.tests ?? [];

  const languages = testSummaries.map(test => ({
    language: test.languages,
    grade: test.grade ?? 0,
    proficiency: test.proficiency_level ?? "Unknown",
    attemptsLeft: test.remaining_attempts ?? 0
  }));



  const statusList = [
    { label: "Personal Info", isComplete: checklist.personalInfo },
    { label: "Work Experience", isComplete: checklist.workExperience },
    { label: "Academics", isComplete: checklist.academics },
    { label: "Past Projects", isComplete: checklist.pastProjects },
    { label: "Languages", isComplete: checklist.languages },
    { label: "Certifications", isComplete: checklist.certifications },
    { label: "Job Titles", isComplete: checklist.jobTitles },
    { label: "Key Skills", isComplete: checklist.keySkills },
  ];


  const jobs = useMemo(() => {
    return newJobs.length > 0
      ? newJobs.map(job => ({
        title: job.title ?? "Unknown Title",
        company: job.company ?? "Unknown Company",
        location: job.location ?? "Unknown Location",
        profileMatch: job.profile_match ?? 0
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
        setAnimatedCompletions(prev => {
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


  if (loading) return <div className='flex justify-center items-center w-full h-full '><Loader /></div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-5 bg-gray-100 p-5 ps-7">

      <div className="flex justify-between items-center w-full pl-5 pr-5">

        {/* ✅ Total Applications */}
        <div className="relative flex bg-gradient-to-br from-[#FFC2B0] to-[#FF9AA2] h-[120px] w-[250px] text-black p-4 rounded-xl">
          <div className="flex flex-col justify-start items-start gap-5">
            <p className="font-bold">Total Applications</p>
            <h3 className="font-bold text-lg">{infoBlock.totalApplications}</h3>
          </div>
          <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm w-fit h-fit">
            <img width="22px" height="22px" className="p-1" src={total_app_icon} alt="" />
          </div>
        </div>

        {/* ✅ Weekly Applied Jobs (You can update this from another API if available) */}
        <div className="relative flex bg-gradient-to-br from-[#FDA67B] to-[#FF9D6B] h-[120px] w-[250px] text-black p-4 rounded-xl">
          <div className="flex flex-col justify-start items-start gap-5">
            <p className="font-bold">Weekly Applied Jobs</p>
            <h3 className="font-bold text-lg">{infoBlock.dailyJobLimit}</h3> {/* Just an example fallback */}
          </div>
          <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm w-fit h-fit">
            <img width="22px" height="22px" className="p-1" src={total_app_icon} alt="" />
          </div>
        </div>

        {/* ✅ Top Jobs For You */}
        <div className="relative flex bg-gradient-to-br from-[#BDE4FB] to-[#A3C7FD] h-[120px] w-[250px] text-black p-4 rounded-xl">
          <div className="flex flex-col justify-start items-start gap-5">
            <p className="font-bold">Top Jobs For You</p>
            <h3 className="font-bold text-lg">{infoBlock.totalJobs}</h3>
          </div>
          <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm w-fit h-fit">
            <img width="22px" height="22px" className="p-1" src={total_app_icon} alt="" />
          </div>
        </div>

        {/* ✅ Remaining Applications (based on limits) */}
        <div className="relative flex bg-gradient-to-br from-[#6FE297] to-[#48D77A] h-[120px] w-[250px] text-black p-4 rounded-xl">
          <div className="flex flex-col justify-start items-start">
            <p className="font-bold">Remaining Applications</p>
            <p className='font-semibold'>
              {Math.max(infoBlock.dailyJobLimit - infoBlock.totalApplications, 0)} / {infoBlock.dailyJobLimit}
            </p>
            <h3 className="font-semibold">
              {infoBlock.tier.charAt(0).toUpperCase() + infoBlock.tier.slice(1)} Package
            </h3>
          </div>
          <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm w-fit h-fit">
            <img width="22px" height="22px" className="p-1" src={total_app_icon} alt="" />
          </div>
        </div>

      </div>


      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Grid - 1 */}
        <div className="flex flex-col lg:col-span-2 space-y-2">

          {/* Box - 1 */}
          <div className="flex flex-col gap-2 border rounded-xl p-5 bg-white space-y-3">

            {/* Profile Header Section */}
            <div className="flex items-center justify-between">
              {/* Image + Name/Title */}
              <div className="flex items-center space-x-4">
                <img
                  src={profile}
                  alt=''
                  className="w-14 h-14 rounded-full bg-white object-cover  "
                />
                <div className="flex flex-col">
                  <h3 className="text-[15px] font-bold">{fullName}</h3>
                  <p className="text-sm text-gray-500">{preferredJobTitle}</p>
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
                      strokeDashoffset={150 - (150 * (profileCompletion ?? 0)) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 28 28)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                    {profileCompletion}%
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600">Profile Complete</span>
              </div>

            </div>

            {/* Divider */}
            <div className="border-t border-t-[#0000000F]"></div>

            {/* Designation */}
            <div className="flex flex-col gap-2">
              <h2 className='font-bold text-[15px]'>Designation</h2>

              <div className="flex flex-wrap gap-2">
                {jobTitles.map((title, index) => (
                  <p
                    key={index}
                    className='text-sm font-medium px-3.5 py-1.5 rounded-xl bg-[#F8F8F8] w-fit'
                  >
                    {title}
                  </p>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <h2 className='font-bold text-[15px]'>Complete every section to make JSE AI work</h2>

              <div className="flex flex-col gap-2 px-3 py-3 h-[98px] rounded-lg bg-[#F8F8F8] overflow-y-auto scrollbar-custom">
                {statusList.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <img width="18px" src={item.isComplete ? complete : incomplete} alt="" />
                    <p className='font-medium text-sm'>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>


          <img src={lock} className='absolute top-[95%] left-[33%] w-14 h-14 z-10' alt="" />


          {/* Box - 2 */}
          <div className="border relative rounded-xl p-5 bg-white opacity-40 blur-0 space-y-3 ">


            <h2 className='font-bold text-[15px]'>Proficiency Test Details</h2>

            <div className="flex items-center gap-4">

              <p className='text-sm'>Remaining Attempts:</p>
              <span className='font-bold'>2 / 5</span>
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-[#2c6472]"></div>
                <div className="w-4 h-4 rounded-full bg-[#2c6472]"></div>
                <div className="w-4 h-4 rounded-full bg-[#0000001A]"></div>
                <div className="w-4 h-4 rounded-full bg-[#0000001A]"></div>
                <div className="w-4 h-4 rounded-full bg-[#0000001A]"></div>
              </div>

            </div>
            <div className="flex flex-col gap-2">
              {/* Language Dropdown - dynamic switcher */}
              <div className="flex text-sm items-center">
                <p className='font-semibold w-40'>Language:</p>
                <select
                  className="px-2 py-1 bg-[#0000000F] rounded-md text-sm font-semibold outline-none"
                  value={selectedLanguageIndex}
                  onChange={(e) => setSelectedLanguageIndex(Number(e.target.value))}
                >
                  {languages.map((lang, index) => (
                    <option key={index} value={index}>
                      {lang.language}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamically Show Grade */}
              <div className="flex text-sm">
                <p className='font-semibold w-40'>Grade:</p>
                <p className='font-semibold'>{languages[selectedLanguageIndex]?.grade}</p>
              </div>

              {/* Proficiency Level */}
              <div className="flex text-sm">
                <p className='font-semibold w-40'>Proficiency Level:</p>
                <p className='font-semibold'>{languages[selectedLanguageIndex]?.proficiency}</p>
              </div>

              {/* Attempts Left */}
              <div className="flex text-sm">
                <p className='font-semibold w-40'>Attempts Left:</p>
                <p className='font-semibold'>{languages[selectedLanguageIndex]?.attemptsLeft}</p>
              </div>
            </div>


          </div>

        </div>

        {/* Grid - 2 */}
        <div className="lg:col-span-3 space-y-2">

          {/* Box - 3 */}
          <div className="flex flex-col gap-2.5 border rounded-xl p-5 bg-white space-y-3">
            <div className="flex justify-between">
              <h2 className='font-bold text-[15px]'>New Jobs for you</h2>
              <a className='text-[#2c6472] font-medium' href="#">View All</a>
            </div>

            {jobs.map((job, index) => (
              <React.Fragment key={index}>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-1">
                    <h2 className='font-semibold text-[#2c6472]'>{job.title}</h2>
                    <p className='font-medium text-sm'>{job.company}</p>
                    <p className='text-sm'>{job.location}</p>
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
                          } strokeLinecap="round"
                          transform="rotate(-90 28 28)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                        {animatedCompletions[index]}%
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 mt-1">Profile Match</span>
                  </div>
                </div>

                {/* Divider */}
                {index !== jobs.length - 1 && (
                  <div className="mx-auto border-t border-t-[#0000000F] w-[97%]"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Box - 4 */}
          <div className="border h-[220px] rounded-xl p-5 bg-white space-y-3">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <h2 className='font-bold text-[15px]'>Announcements</h2>
                <img src={announcements} alt="" />
              </div>
              <div className="">
                <a className='text-[#2c6472] font-medium' href="/user/announcements">View All</a>
              </div>
            </div>

            <p className='text-[#000000A1] font-medium text-sm'>The new version of <span className='text-[#2c6472] font-semibold'>JSE AI </span>
              brings major improvements across the
              platform. With advanced AI matching, optimized performance, and a
              refreshed UI, the app is now smarter and faster than ever before.
              These upgrades aim to make your job search smoother and more
              effective. </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard