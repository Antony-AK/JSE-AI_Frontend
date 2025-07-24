import React, { useEffect, useState } from 'react'
import axios from 'axios';
import profile from '../../assets/profile1.png'
import defaultImage from '../../assets/profile1.png'
import edit from '../../assets/edit-icon.svg'
import Loader from '../../base/loader/Loader';
import WorkExpUpdateForm from '../../UpdateProfile/WorkExpUpdateForm';
import EducationUpdateForm from '../../UpdateProfile/EducationUpdateForm';
import CertificatesUpdateForm from '../../UpdateProfile/CertificatesUpdateForm';
import LanguageUpdateForm from '../../UpdateProfile/LanguageUpdateForm';
import PersonalnfoUpdateForm from '../../UpdateProfile/PersonalnfoUpdateForm';
import ProfessionalSumUpdateForm from '../../UpdateProfile/ProfessionalSumUpdateForm';
import { BASE_URL } from '../../utils/api';
import JobTitleUpdateForm from '../../UpdateProfile/JobTitleUpdateForm';
import ProjectUpdateForm from '../../UpdateProfile/ProjectsUpdateForm';
import ProfileImageModal from '../../base/ProfileEditor/ProfileImageModel';
import { useProfileImage } from '../../base/ProfileEditor/ProfileImageContext';
import { useNavigate } from 'react-router-dom';



const Profile = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");
  const [animatedScore, setAnimatedScore] = useState(0);
  const [workpopup, setWorkPopup] = useState(false);
  const [educationpopup, setEducationPopup] = useState(false);
  const [certificatesPopup, setCertificatesPopup] = useState(false);
  const [languagesPopup, setLanguagesPopup] = useState(false);
  const [personalinfoPopup, setPersonalInfoPopup] = useState(false);
  const [showProjectUpdateForm, setShowProjectUpdateForm] = useState(false);
  const [showJobTitleUpdateForm, setShowJobTitleUpdateForm] = useState(false);
  const [professionalSummaryPopup, setProfessionalSummaryPopup] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [workExp, setWorkExp] = useState([]);
  const [education, setEducation] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [jobTitles, setJobTitles] = useState({});
  const [summary, setSummary] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState("basic");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ProfileImage, setProfileImage] = useState(null);
  const { profileImage, fetchProfileImage } = useProfileImage();
  const [internalAppCount, setInternalAppCount] = useState(0);
  const [externalAppCount, setExternalAppCount] = useState(0);
  const [proficiencyScore, setProficiencyScore] = useState(0);
  const [isLoadingWork, setIsLoadingWork] = useState(true);
  const [isLoadingEducation, setIsLoadingEducation] = useState(true);
  const [isLoadingCertificates, setIsLoadingCertificates] = useState(true);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [isLoadingPersonalInfo, setIsLoadingPersonalInfo] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingJobProfile, setIsLoadingJobProfile] = useState(true);


    useEffect(() => {
  if (!token) {
    navigate('/user/login');
  }
}, []);

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen text-center text-red-600 font-semibold">
        You’re not logged in, buddy 😢 <br />
        <span className="text-sm text-gray-500">Please log in again to access your dashboard.</span>
      </div>
    );
  }


  useEffect(() => {

    const headers = { Authorization: `Bearer ${token}` };


    // Fetch each section separately
    const fetchJobProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/jobprofile`, { headers });
        setProfileData(res.data);
        const seeker = res.data?.seeker || {};
        setProfileCompletion(seeker?.profile_completion ?? 0);
        setSubscriptionTier(seeker?.subscription_tier ?? 'basic');
        setInternalAppCount(seeker?.internal_application_count ?? 0);
        setExternalAppCount(seeker?.external_application_count ?? 0);
        setProficiencyScore(seeker?.proficicency_test ?? 0);
      } catch (err) {
        console.error("JobProfile Error:", err);
      } finally {
        setIsLoadingJobProfile(false);
      }
    };

    const fetchPersonalInfo = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/personal-info`, { headers });
        setPersonalInfo(res.data?.personal_info);
      } catch (err) {
        console.error("Personal Info Error:", err);
      } finally {
        setIsLoadingPersonalInfo(false);
      }
    };

    const fetchWorkExp = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/work-experience`, { headers });
        setWorkExp(res.data?.work_experiences);
      } catch (err) {
        console.error("Work Experience Error:", err);
      } finally {
        setIsLoadingWork(false);
      }
    };

    const fetchEducation = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/academics`, { headers });
        setEducation(res.data?.academics);
      } catch (err) {
        console.error("Education Error:", err);
      } finally {
        setIsLoadingEducation(false);
      }
    };

    const fetchCertificates = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/certificates`, { headers });
        setCertificates(res.data.certificates);
      } catch (err) {
        console.error("Certificates Error:", err);
      } finally {
        setIsLoadingCertificates(false);
      }
    };

    const fetchLanguages = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/languages`, { headers });
        setLanguages(res.data.languages);
      } catch (err) {
        console.error("Languages Error:", err);
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/pastprojects`, { headers });
        setProjects(res.data?.past_projects);
      } catch (err) {
        console.error("Projects Error:", err);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    // call all at once 🔁
    fetchJobProfile();
    fetchPersonalInfo();
    fetchWorkExp();
    fetchEducation();
    fetchCertificates();
    fetchLanguages();
    fetchProjects();
  }, [refreshTrigger]);


  useEffect(() => {
    if (profileData) {
      console.log("profileData updated:", profileData);

    }
  }, [profileData]);

  useEffect(() => {
    if (!profileData?.profile_completion) return;

    let start = 0;
    const end = profileData?.profile_completion;
    const duration = 500;
    const frameRate = 10;
    const increment = (end / duration) * frameRate;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setAnimatedScore(Math.floor(start));
    }, frameRate);

    return () => clearInterval(timer);
  }, [profileData]);

  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Profile Data:", profileData);



  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">{error}</div>
    );
  }


  // Full Name
  const fullName = `${personalInfo?.first_name || ""} ${personalInfo?.second_name || ""}`.trim();

  // Address
  const address = personalInfo?.city || "";


  // LinkedIn
  const linkedin = personalInfo?.linkedin_profile || "";

  const seeker = profileData?.seeker || {};


  // Titles
  const primaryTitle = seeker?.primary_title || "";

  const tier = seeker?.subscription_tier ?? 'Basic';
  const internal = seeker?.internal_application_count ?? 0;
  const external = seeker?.external_application_count ?? 0;
  const proficiency = seeker?.proficicency_test ?? 0;

  const maxInternal = tier === 'free' ? 5 : 15;
  const maxExternal = tier === 'free' ? 2 : 15;
  const maxProficiency = 0;





  const handleClose = () => {
    setWorkPopup(false);
    setEducationPopup(false);
    setCertificatesPopup(false);
    setLanguagesPopup(false);
    setPersonalInfoPopup(false);
    setProfessionalSummaryPopup(false);
    setShowJobTitleUpdateForm(false);
    setShowProjectUpdateForm(false);
    setRefreshTrigger(prev => !prev); // 🔄 this will re-fetch the profile data

  };

  const handleWorkPopup = () => setWorkPopup(true);
  const handleEducationPopup = () => setEducationPopup(true);
  const handleCertificatesPopup = () => setCertificatesPopup(true);
  const handleLanguagesPopup = () => setLanguagesPopup(true);
  const handlePersonalInfoPopup = () => setPersonalInfoPopup(true);
  const handleJobTitleUpdateForm = () => setShowJobTitleUpdateForm(true);
  const handleProjectUpdateForm = () => setShowProjectUpdateForm(true);

  return (
    <div className='flex flex-col gap-3 bg-gray-100 px-6 py-4'>
      {/* 💠 Dashboard Summary Section */}
      <div className="bg-[#215D69] rounded-md text-white p-6 mb-2 flex flex-col gap-5">

        {/* 🔹 Package Info */}
        <div className="flex  gap-2">
          <p className="text-sm font-semibold">Package : </p>
          <h2 className="text-lg font-bold -mt-1 capitalize">
            {isLoadingJobProfile ? (
              <span className="animate-pulse text-sm">Loading...</span>
            ) : (
              seeker?.subscription_tier ?? 'Basic'
            )}
          </h2>
        </div>

        <div className='flex w-full h-[150px] rounded-md p-4 justify-between items-center'>
          {/* 🔹 Internal Applications */}
          <div className="flex flex-col w-96  justify-center items-center gap-2">
            <p className="text-sm font-medium">Internal Applications</p>
            <p className="text-sm font-semibold">
              {isLoadingJobProfile ? (
                <span className="animate-pulse text-sm">-- / --</span>
              ) : (
                `${internal}/${maxInternal}`
              )}
            </p>
            <div className="relative w-20 h-20">
              <svg className="absolute top-0 left-0 w-full h-full">
                <circle cx="40" cy="40" r="36" stroke="#ffffff70" strokeWidth="4" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#fff"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="226.2"
                  strokeDashoffset={
                    isLoadingJobProfile
                      ? 226.2
                      : 226.2 - (226.2 * internal) / maxInternal
                  }

                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {isLoadingJobProfile ? (
                  <span className="animate-pulse text-xs">--%</span>
                ) : (
                  `${Math.round((internal / maxInternal) * 100)}%`
                )}
              </div>
            </div>
          </div>

          {/* 🔹 External Applications */}
          <div className="flex flex-col justify-center items-center gap-2 w-96">
            <p className="text-sm font-medium text-white">External Applications</p>
            <p className="text-sm font-semibold text-white">
              {isLoadingJobProfile ? (
                <span className="animate-pulse text-sm">-- / --</span>
              ) : (
                `${external}/${maxExternal}`
              )}
            </p>
            <div className="relative w-20 h-20">
              <svg className="absolute top-0 left-0 w-full h-full">
                <circle cx="40" cy="40" r="36" stroke="#ffffff70" strokeWidth="4" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#fff"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="226.2"
                  strokeDashoffset={
                    isLoadingJobProfile
                      ? 226.2
                      : 226.2 - (226.2 * external) / maxExternal
                  }

                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {isLoadingJobProfile ? (
                  <span className="animate-pulse text-xs">--%</span>
                ) : (
                  `${Math.round((external / maxExternal) * 100)}%`
                )}
              </div>
            </div>
          </div>

          {/* 🔹 Proficiency Test */}
          <div className="flex flex-col justify-center items-center gap-2 w-96">
            <p className="text-sm font-medium text-white">Proficiency Test</p>
            <p className="text-sm font-semibold text-white">
              {/* {proficiency}/{maxProficiency} */}
              {isLoadingJobProfile ? (
                <span className="animate-pulse text-sm">-- / --</span>
              ) : (
                `${proficiency}/${maxProficiency}`
              )}
            </p>
            <div className="relative w-20 h-20">
              <svg className="absolute top-0 left-0 w-full h-full">
                <circle cx="40" cy="40" r="36" stroke="#ffffff70" strokeWidth="4" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#fff"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="226.2"
                  strokeDashoffset={
                    isLoadingJobProfile || maxProficiency === 0
                      ? 226.2
                      : 226.2 - (226.2 * proficiency) / maxProficiency
                  }

                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {/* {Math.round((proficiency / maxProficiency) * 100)}% */}
                {isLoadingJobProfile || maxProficiency === 0 ? (
                  <span className="animate-pulse text-xs">--%</span>
                ) : (
                  `${Math.round((proficiency / maxProficiency) * 100)}%`
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full h-14 bg-white rounded-md flex justify-center items-center'>
        <p className='text-[#2c6472] font-medium'><strong className='text-black'>Please Note: </strong>For better job results, ensure your profile details are filled correctly and completely.</p>
      </div>

      <div className="flex justify-between py-3 px-5  w-full bg-white rounded-md">
        <div className="flex items-center gap-6">
          <div className='w-20 h-20 rounded-full'>
            <img
              src={profileImage || profile}
              alt="Profile"
              className="w-full h-full rounded-full object-cover cursor-pointer"
              onClick={() => setShowModal(true)}
            />
          </div>

          <div>
            <h2 className="font-bold">
              {isLoadingPersonalInfo ? (
                <span className="animate-pulse text-sm"></span>
              ) : (
                fullName
              )}
            </h2>
            <p>
              {isLoadingJobProfile ? (
                <span className="animate-pulse text-sm"></span>
              ) : (
                profileData?.seeker?.primary_title
              )}
            </p>
          </div>
        </div>

        {/* 🧠 Image Modal Popup */}
        {showModal && (
          <ProfileImageModal
            imageUrl={profileImage}
            onClose={() => setShowModal(false)}
            onUpload={() => {
              fetchProfileImage(); // 🔁 updates context globally
              setShowModal(false);         // ✅ close the modal
            }}
          />
        )}


        <div className="flex flex-col items-center">
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
                strokeDashoffset={
                  isLoadingJobProfile
                    ? 150
                    : 150 - (150 * (profileData?.seeker?.profile_completion ?? 0)) / 100
                }

                strokeLinecap="round"
                transform="rotate(-90 28 28)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
              {isLoadingJobProfile ? (
                <span className="animate-pulse text-xs">--%</span>
              ) : (
                profileData?.profile_completion ? `${animatedScore}%` : "--%"
              )}
            </div>
          </div>
          <span className="text-xs mt-2 font-bold text-gray-600">Profile Complete</span>
        </div>
      </div>

      {/* Personal Information */}
      <div className="flex justify-between items-center py-5 px-6 w-full bg-white rounded-md">
        <div className='flex flex-col gap-3'>
          <h2 className="text-sm font-bold">Personal Information</h2>
          <p className='text-sm font-medium text-gray-500'>
            Name: {isLoadingPersonalInfo ? (
              <span className="animate-pulse"></span>
            ) : (
              fullName
            )}
          </p>

          <p className='text-sm font-medium text-gray-500'>
            Address: {isLoadingPersonalInfo ? (
              <span className="animate-pulse"></span>
            ) : (
              address
            )}
          </p>

          <p className='text-sm font-medium text-gray-500'>
            LinkedIn: <span className='underline cursor-pointer'>
              {isLoadingPersonalInfo ? (
                <span className="animate-pulse"></span>
              ) : (
                linkedin
              )}
            </span>
          </p>

        </div>
        <div onClick={handlePersonalInfoPopup} className="flex justify-center items-center h-fit p-3 rounded-full hover:bg-slate-300 cursor-pointer">
          <img src={edit} alt="" />
        </div>
      </div>

      {/* Education */}
      <div className=" flex  justify-between items-center py-5 px-6 w-full bg-white rounded-md  ">
        <div className=' flex flex-col h-[200px] overflow-y-auto hide-scrollbar'>
          <h2 className="text-sm font-bold">Education</h2>
          {isLoadingEducation ? (
            <p className="text-gray-500 text-sm"></p>
          ) : (
            education?.length > 0 ? (
              education.map((edu, index) => (
                <div key={index} className='flex flex-col gap-2 '>
                  <div className='w-full flex gap-2 mt-2'>
                    <p className='text-sm font-medium text-gray-500'>Degree Title :</p>
                    <p className='text-sm font-medium text-gray-500'>{edu.degree}</p>
                  </div>
                  <div className='flex gap-2 mt-1'>
                    <p className='text-sm font-medium text-gray-500'>Instution Name :</p>
                    <p className='text-sm font-medium text-gray-500'>{edu.institution}</p>
                  </div>
                  <div className='flex gap-2 mt-1'>
                    <p className='text-sm font-medium text-gray-500'>Field of Study :</p>
                    <p className='text-sm font-medium text-gray-500'>{edu.field_of_study}</p>
                  </div>
                  <div className='flex gap-2 mt-1'>
                    <p className='text-sm font-medium text-gray-500'>{new Date(edu.start_date).toLocaleDateString()}</p>
                    <span className='-mt-1 text-gray-500'>-</span>
                    <p className='text-sm font-medium text-gray-500'>{new Date(edu.end_date).toLocaleDateString()}</p>
                  </div>
                  <hr className='my-1' />
                </div>
              ))
            ) : (
              <p className='text-sm text-gray-400'>No education data available</p>
            )
          )}
        </div>
        <div onClick={handleEducationPopup} className="flex justify-center items-center h-fit p-3 rounded-full hover:bg-slate-300 cursor-pointer">
          <img src={edit} alt="Edit" />
        </div>
      </div>

      {/* Work Experience */}
      <div className="flex justify-between items-center py-5 px-6 w-full bg-white rounded-md">
        <div className='flex flex-col gap-2 h-[200px] overflow-y-auto hide-scrollbar'>
          <h2 className="text-sm font-bold mb-1">Work Experience</h2>
          {isLoadingWork ? (
            <p className="text-gray-500 text-sm"></p>
          ) : (
            workExp?.length > 0 ? (
              workExp.map((work, index) => (
                <div key={index}>
                  <p className='text-sm font-semibold mb-1 text-gray-500'>{work.job_title}</p>
                  <div className='flex gap-16'>
                    <p className='text-sm font-medium w-20 text-gray-500'>{work.company_name}</p>
                    <p className='text-sm font-medium text-gray-500'>
                      {new Date(work.start_date).toLocaleDateString()} - {new Date(work.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <hr className='my-2' />
                </div>
              ))
            ) : (
              <p className='text-sm text-gray-400'>No work experience added</p>
            )
          )}

        </div>
        <div onClick={handleWorkPopup} className="flex justify-center items-center h-fit p-3 rounded-full hover:bg-slate-300 cursor-pointer">
          <img src={edit} alt="Edit" />
        </div>
      </div>

      {/* Projects */}
      <div className="flex justify-between items-center py-5 px-6 w-full bg-white rounded-md">
        <div className='flex flex-col gap-2 h-[180px] overflow-y-auto hide-scrollbar'>
          <h2 className="text-sm font-bold">Projects</h2>
          {isLoadingProjects ? (
            <p className="text-gray-500 text-sm"></p>
          ) : (
            projects?.length > 0 ? (
              projects.map((project, index) => (
                <div key={index} className='flex flex-col gap-1.5'>
                  <p className='text-sm font-semibold text-gray-500'>{project.project_name}</p>
                  <p className='text-sm font-medium text-gray-500'>{project.institution}</p>
                  <p className='text-sm font-medium text-gray-500'>
                    {new Date(project.start_date).toLocaleDateString()} -{" "}
                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : "Present"}
                  </p>
                  <hr className='my-2' />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No projects added</p>
            )
          )}

        </div>
        <div onClick={handleProjectUpdateForm} className="flex justify-center items-center h-fit p-3 rounded-full hover:bg-slate-300 cursor-pointer">
          <img src={edit} alt="Edit" />
        </div>
      </div>

      {/* Certificates and Courses */}
      <div className="flex justify-between items-center py-5 px-6 w-full bg-white rounded-md">
        <div className='flex flex-col h-24 gap-2 overflow-y-auto hide-scrollbar'>
          <h2 className="text-sm font-bold">Certificates & Courses</h2>
          {isLoadingCertificates ? (
            <p className="text-gray-500 text-sm"></p>
          ) : (
            certificates?.length > 0 ? (
              certificates.map((cert, index) => (
                <p key={index} className='text-sm font-medium text-gray-500'>• {cert.certificate_name}</p>
              ))
            ) : (
              <p className="text-sm text-gray-400">No certificates added</p>
            )
          )}

        </div>
        <div onClick={handleCertificatesPopup} className="flex justify-center items-center h-fit p-3 rounded-full hover:bg-slate-300 cursor-pointer">
          <img src={edit} alt="Edit" />
        </div>
      </div>

      {/* Languages */}
      <div className="flex justify-between items-center py-5 px-6 w-full bg-white rounded-md">
        <div className='flex flex-col gap-2 h-[130px] overflow-y-auto hide-scrollbar'>
          <h2 className="text-sm font-bold">Languages</h2>
          {isLoadingLanguages ? (
            <p className="text-gray-500 text-sm"></p>
          ) : (
            languages?.length > 0 ? (
              languages.map((lang, index) => (
                <p key={index} className='text-sm font-medium text-gray-500'>• {lang.language}</p>
              ))
            ) : (
              <p className="text-sm text-gray-400">No languages added</p>
            )
          )}

        </div>
        <div onClick={handleLanguagesPopup} className="flex justify-center items-center h-fit p-3 rounded-full hover:bg-slate-300 cursor-pointer">
          <img src={edit} alt="Edit" />
        </div>
      </div>

      {/* Modals */}
      {workpopup && <WorkExpUpdateForm onclose={handleClose} />}
      {educationpopup && <EducationUpdateForm onclose={handleClose} />}
      {certificatesPopup && <CertificatesUpdateForm onclose={handleClose} />}
      {languagesPopup && <LanguageUpdateForm onclose={handleClose} />}
      {personalinfoPopup && <PersonalnfoUpdateForm onclose={handleClose} />}
      {professionalSummaryPopup && <ProfessionalSumUpdateForm onclose={handleClose} />}
      {showJobTitleUpdateForm && <JobTitleUpdateForm onclose={handleClose} />}
      {showProjectUpdateForm && <ProjectUpdateForm onClose={handleClose} />}

    </div>
  );
};

export default Profile;