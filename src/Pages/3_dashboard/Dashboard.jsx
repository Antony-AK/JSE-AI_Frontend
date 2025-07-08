import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import profile from "../../assets/profile1.png"
import total_app_icon from "../../assets/total-app.svg"
import jobs_available_icon from "../../assets/calender.png"
import selectable_jobs_icon from '../../assets/jobbag.png'
import total_experience_icon from '../../assets/cubic.png'
import complete from '../../assets/complete.svg'
import incomplete from '../../assets/incomplete.svg'
import announcements from '../../assets/announcements-icon.svg'
import lock from "../../assets/lock_icon.png"
import "aos/dist/aos.css";
import { BASE_URL } from "../../utils/api"
import Loader from '../../base/loader/Loader'
import { useMemo } from "react";
import { useProfileImage } from '../../base/ProfileEditor/ProfileImageContext';


const Dashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [chartTitle, setChartTitle] = useState('');
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0);
  const { profileImage } = useProfileImage(); // 👈 use context
  const token = sessionStorage.getItem("authToken");


  useEffect(() => {
    if (!token) {
      navigate("/user/login");
      setError("No auth token found.");
      setLoading(false);
      return;
    }

    axios
      .get(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setProfileData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || "⚠ Failed to load profile data.";
        setError(errorMessage);
        setLoading(false);
      });
  }, [token]);


  const checklist = {
    mfa: profileData?.checklist?.checklist_mfa ?? false,
    cvFormat: profileData?.checklist?.checklist_cv_format_fixed ?? false,
    clFormat: profileData?.checklist?.checklist_cl_format_fixed ?? false,
    profileImg: profileData?.checklist?.checklist_profile_img ?? false,
    dataUsage: profileData?.checklist?.checklist_data_usage ?? false,
    dataTraining: profileData?.checklist?.checklist_data_training ?? false,
    numberLock: profileData?.checklist?.checklist_number_lock ?? false,
    dataFinalization: profileData?.checklist?.checklist_data_finalization ?? false,
    terms: profileData?.checklist?.checklist_terms ?? false,
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
    { label: "Multifactor Authentication", isComplete: checklist.mfa },
    // { label: "CV Format Fixed", isComplete: checklist.cvFormat },
    // { label: "CL Format Fixed", isComplete: checklist.clFormat },
    { label: "Profile Image", isComplete: checklist.profileImg },
    { label: "Data Usage", isComplete: checklist.dataUsage },
    { label: "Data Training", isComplete: checklist.dataTraining },
    { label: "Number Lock", isComplete: checklist.numberLock },
    { label: "Data Finalization", isComplete: checklist.dataFinalization },
    { label: "Terms", isComplete: checklist.terms },
    { label: "Checklist", isComplete: checklist.profileComplete },
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
  if (error) return <div className="text-red-500 flex justify-center items-center mt-64">{error}</div>;

  const handleStatusClick = () => {
    navigate('/user/settings');
  };

  return (
    <div className=" flex flex-col gap-5 bg-gray-100 p-5 ps-7">

      <div className="flex justify-between items-center w-full pl-5 pr-5">

        {/* ✅ Total Applications */}
        <div
          className="relative flex bg-gradient-to-br from-[#FFC2B0] to-[#FF9AA2] h-[120px] w-[250px] text-black p-4 rounded-xl">
          <div className="flex flex-col justify-start items-start gap-5">
            <p className="font-bold">Total Applied</p>
            <h3 className="font-bold text-lg">{infoBlock.totalApplications}</h3>
          </div>
          <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm w-fit h-fit">
            <img width="22px" height="22px" className="p-1" src={total_app_icon} alt="" />
          </div>
        </div>

        {/* ✅ Weekly Applied Jobs (You can update this from another API if available) */}
        <div className="relative flex bg-gradient-to-br from-[#FDA67B] to-[#FF9D6B] h-[120px] w-[250px] text-black p-4 rounded-xl">
          <div className="flex flex-col justify-start items-start gap-5">
            <p className="font-bold">Weekly Applied</p>
            <h3 className="font-bold text-lg">{infoBlock.dailyJobLimit}</h3> {/* Just an example fallback */}
          </div>
          <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm w-fit h-fit">
            <img width="24px" height="24px" className="p-1" src={jobs_available_icon} alt="" />
          </div>
        </div>

        {/* ✅ Top Jobs For You */}
        <div className="relative flex bg-gradient-to-br from-[#BDE4FB] to-[#A3C7FD] h-[120px] w-[250px] text-black p-4 rounded-xl">
          <div className="flex flex-col justify-start items-start gap-5">
            <p className="font-bold">Recommeded Jobs</p>
            <h3 className="font-bold text-lg">{infoBlock.totalJobs}</h3>
          </div>
          <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm w-fit h-fit">
            <img width="24px" height="24px" className="p-1" src={selectable_jobs_icon} alt="" />
          </div>
        </div>

        {/* ✅ Remaining Applications (based on limits) */}
        <div className="relative flex bg-gradient-to-br from-[#6FE297] to-[#48D77A] h-[120px] w-[250px] text-black p-4 rounded-xl">
          <div className="flex flex-col justify-start items-start">
            <p className="font-bold">Package</p>
            <p className='font-semibold'>
              {Math.max(infoBlock.dailyJobLimit - infoBlock.totalApplications, 0)} / {infoBlock.dailyJobLimit}
            </p>
            <h3 className="font-semibold">
              {infoBlock.tier.charAt(0).toUpperCase() + infoBlock.tier.slice(1)}
            </h3>
          </div>
          <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm w-fit h-fit">
            <img width="26px" height="26px" className="p-1" src={total_experience_icon} alt="" />
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
                  src={ profileImage || profile}
                  alt=''
                  className="w-14 h-14 rounded-full bg-white object-cover  border border-black"
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
            <div className="flex flex-col h-[100px] overflow-y-auto scrollbar-custom gap-2">
              <h2 className='font-bold  text-[15px]'>Job Search Titles:</h2>

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
              <h2 className='font-bold text-[15px]'>To do List:</h2>

              <div className="flex flex-col gap-2 px-3 py-3 h-[98px] rounded-lg bg-[#F8F8F8] overflow-y-auto scrollbar-custom">
                {statusList.map((item, index) => (
                  <div key={index} onClick={handleStatusClick} className="flex gap-3 cursor-pointer w-fit">
                    <img width="18px" src={item.isComplete ? complete : incomplete} alt="" />
                    <p className='font-medium text-sm'>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>


          {/* <img src={lock} className='absolute top-[78%] left-[33%] w-14 h-14 z-10' alt="" /> */}
          <p className="absolute top-[83%] left-[30%] w-fit font-semibold text-center text-[#2c6472] flex items-center z-10 bg-gray-300/80 px-4 py-2 rounded-lg overflow-hidden shine-effect hover:scale-105 transition-all duration-200">
            Coming Soon
          </p>


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
              <h2 className='font-bold text-[15px]'>New Jobs </h2>
             <Link to='/user/my-jobs/internal'> <p className='text-[#2c6472] font-medium' >View All</p></Link>
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
                <Link to="/user/announcements"><p className='text-[#2c6472] font-medium' >View All</p></Link>
              </div>
            </div>

            <p className="text-[#000000A1] font-medium text-sm">
              <span className="text-[#2c6472] font-semibold mr-2">
                {new Date().toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              - The new version of <span className="text-[#2c6472] font-semibold">JSE AI</span> brings major
              improvements across the platform. With advanced AI matching, optimized
              performance, and a refreshed UI, the app is now smarter and faster than ever
              before. These upgrades aim to make your job search smoother and more
              effective.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard