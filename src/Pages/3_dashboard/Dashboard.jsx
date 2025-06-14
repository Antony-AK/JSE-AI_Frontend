import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../base/loader/Loader.jsx";
import generate_cover_icon from "../../assets/generate-cover.svg"
import jobs_available_icon from "../../assets/jobs-available.svg"
import selectable_jobs_icon from '../../assets/selectable-jobs.svg'
import total_experience_icon from '../../assets/total-experience.svg'
import profile from "../../assets/profile1.png"
import AOS from "aos";
import "aos/dist/aos.css";


function Dashboard() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");


  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out', // add this for smoothness
    });

    AOS.refresh(); // This is key when rendering conditionally
  }, []);

  useEffect(() => {
  if (!token) {
    navigate("/user/login");
    setError("No auth token found.");
    setLoading(false);
    return;
  }

  axios
    .get("https://jse.arshan.digital/b1/profile", {
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


  const recommendedData = [];

    const handleClick = () => {
    // Do your update profile logic here

    // Then navigate to /user/profile
    navigate('/user/profile');
  };



  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  const fullName = `${profileData?.first_name || " "} ${profileData?.second_name || ""}`.trim();
  const preferredJobTitle = profileData?.preferred_job_title || " ";
  const profileCompletion = profileData?.profile_completion || 85;
  const skills = profileData?.skills || [""];
  const languages = profileData?.languages || [""];
  const certificates = profileData?.certificates?.length > 0
    ? profileData.certificates
    : [" "];
  const totalExperienceInMonths = profileData?.total_experience_in_months || 0;
  const experienceFormatted = `${Math.floor(totalExperienceInMonths / 12)} yrs ${totalExperienceInMonths % 12} months`;

  return (
    <div className="flex bg-gray-100 ps-2  ">


      <div className="flex flex-col w-full  min-h-screen bg-gray-40"> {/* Added 'ml-4' for spacing */}


        <div className="p-5">

          {/* Welcome */}
          <div>
            <h2 className="text-[16px] font-semibold text-gray-800">"Welcome back, {fullName}! <br />
              &nbsp;  Let's find your next opportunity."</h2>
            {/* <p className="text-gray-500">Let's find your next opportunity.</p> */}
          </div><br />

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            <div className="lg:col-span-2">

              <div className="border rounded-xl p-5 bg-white space-y-3">
                {/* Profile Header Section */}
                <div className="flex items-center justify-between">
                  {/* Image + Name/Title */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={profile}
                      alt={fullName}
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
                          strokeDashoffset={150 - (150 * profileCompletion) / 100}
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

                {/* Update Button */}
                <div className="flex justify-center ">
                  <div className="relative group w-fit">
                    <button
                    onClick={handleClick}

                      className="bg-black text-[12px] text-white mt-3 mb-5 h-[35px] w-[160px] px-5 py-2 rounded-full font-medium transition ease-linear duration-200"
                    >
                      Update Profile
                    </button>

                
                  </div>

                </div>

                {/* Skills Section */}
                <div className="bg-gray-100 min-h-[100px] max-h-[300px]  rounded-lg ">
                  <h4 className="font-semibold text-gray-700 transform translate-x-4 translate-y-3">Skills</h4><br />
                  <div className="flex flex-nowrap overflow-auto hide-scrollbar gap-2 items-center pl-5">
                    {skills.map((skill, i) => (
                      <span
                        key={i}
                        className="whitespace-nowrap bg-pink-200 w-fit h-fit text-black justify-center text-[14px] font-semibold px-4 py-2 text-center rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages Section */}
                <div className="bg-gray-100 min-h-[100px] max-h-[300px] rounded-lg">
                  <h4 className="font-semibold text-gray-700 transform translate-x-4 translate-y-3">Languages</h4><br />
                  <div className="flex flex-nowrap overflow-auto hide-scrollbar no-scrollbar gap-2 pl-5">
                    {languages.map((lang, i) => (
                      <span
                        key={i}
                        className="whitespace-nowrap bg-pink-200 w-fit h-fit text-black text-center justify-center text-[14px] font-semibold px-4 py-2 rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications Section */}
                <div className="bg-gray-100 p-4 min-h-[100px] max-h-[300px] rounded-lg">
                  <h4 className="font-semibold text-gray-700 -mb-3">Certifications</h4><br />
                  <ul className="list-disc list-inside space-y-3 text-sm text-gray-600">
                    {certificates.map((cert, i) => (
                      <li key={i}>{cert}</li>
                    ))}
                  </ul>
                </div>

                {/* Experience Section */}
                <div className="flex flex-col gap-3 bg-gray-100 p-4 h-[90px] rounded-lg">
                  <h4 className="font-semibold text-gray-700">Experience</h4>
                  <p className="text-sm text-gray-700 flex items-center">
                    <i className="fa fa-briefcase"></i> {experienceFormatted}
                  </p>
                </div>
              </div>
            </div>


            {/* Right column: stats & jobs */}
            <div className="lg:col-span-3 space-y-7">
              {/* Stats */}
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">

                  <div className="relative bg-gradient-to-br from-[#FFC2B0] to-[#FF9AA2] h-[120px] w-[250px] text-black p-4 rounded-xl">
                    <div className="absolute top-10 flex flex-col justify-start items-start gap-3">
                      <h3 className="text-3xl font-bold">{profileData?.daily_generatable_coverletter ?? 0}</h3>
                      <p className="text-[13px] font-bold">Daily Generatable Cover Letters</p>
                    </div>
                    <div className="absolute rounded-full top-3 right-3 p-2 bg-gray-500/30 backdrop-blur-sm">
                      <img width="22px" height="22px" className="p-1" src={generate_cover_icon} alt="" />
                    </div>
                  </div>

                  <div  className="relative bg-gradient-to-br from-[#A1C4FD] to-[#C2E9FB] h-[120px] w-[250px] text-black p-4 rounded-xl">
                    <div className="absolute top-10 flex flex-col justify-start items-start gap-3">
                      <h3 className="text-3xl font-bold ">{profileData?.total_jobs_available ?? 0}</h3>
                      <p className="text-[13px] font-bold">Total Jobs Available</p>
                    </div>
                    <div className="absolute rounded-full top-3 right-3 p-2 bg-gray-500/30 backdrop-blur-sm">
                      <img width="22px" height="22px" className="p-1" src={jobs_available_icon} alt="" />
                    </div>
                  </div>

                  <div  className="relative bg-gradient-to-br from-[#88D3C6] to-[#A6F1C7] h-[120px] w-[250px] text-black p-4 rounded-xl">
                    <div className="absolute top-10 flex flex-col justify-start items-start gap-3">
                      <h3 className="text-3xl font-bold">{profileData?.daily_selectable_jobs_count ?? 0}</h3>
                      <p className="text-[13px] font-bold">Daily Selectable Jobs</p>
                    </div>
                    <div className="absolute rounded-full top-3 right-3 p-2 bg-gray-500/30 backdrop-blur-sm">
                      <img width="22px" height="22px" className="p-1" src={selectable_jobs_icon} alt="" />
                    </div>
                  </div>

                  <div  className="relative bg-gradient-to-br from-[#FAD0C5] to-[#FED0FC] h-[120px] w-[250px] text-black p-4 rounded-xl  ">
                    <div className="absolute top-12 flex flex-col justify-start items-start gap-3">
                      <h3 className="text-xl font-bold">{experienceFormatted}</h3>
                      <p className="text-[13px] font-bold">Total Experience</p>
                    </div>
                    <div className="absolute rounded-full top-3 right-3 p-2 bg-gray-500/30 backdrop-blur-sm">
                      <img width="22px" height="22px" className="p-1" src={total_experience_icon} alt="" />
                    </div>
                  </div>

                </div>
              </div>

              {/* Recommended Jobs */}
              <div className="bg-white rounded-xl p-5 pb-0 shadow">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold text-gray-700">Recommended Jobs for you</h3>
                  <a href="#" className="text-sm font-semibold text-indigo-800 hover:underline">Show all</a>
                </div>
                <div className="flex flex-col justify-center items-center mt-6">
                  {/* Check if there is any recommended data */}
                  {recommendedData && recommendedData.length > 0 ? (
                    <div className="w-full h-[275px] flex flex-col overflow-auto hide-scrollbar px-3 gap-2">
                      {recommendedData.map((job, index) => (
                        <div
                          key={index}
                          className="flex w-full h-[150px] justify-between border-b border-gray-200"
                        >
                          <div className="flex items-start py-5 space-x-10 justify-center">
                            <img
                              src={job.companyLogo} // dynamic logo
                              alt="Job"
                              className="w-20 h-20 my-auto ms-5 object-contain"
                            />
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-[#2C6472]">
                                {job.title}
                              </h3>
                              <p className="text-sm text-gray-600">{job.companyName}</p>
                              <p className="text-sm text-gray-500">{job.location}</p>
                              <p className="text-sm text-gray-500">{job.salary}</p>
                            </div>
                          </div>
                          <div className="text-gray-500 p-5 me-5 font-medium text-xl">⋮</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Show this div if no recommended jobs
                    <div className="bg-gray-100 p-5 w-full rounded-xl text-center text-gray-500 font-medium mb-5">
                      No Jobs
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;