import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import frame from "./../../assets/Frame.png";
import logo from "./../../assets/logo.png";
import axios from 'axios';
import { jobskills } from '../../assets/data';



const ProfessionalSummary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState('');
  const hasDataRef = useRef(false);

  const allSkills = Object.values(jobskills).flatMap(job => job.skills);
  const [dynamicSkills, setDynamicSkills] = useState(allSkills);




  const dropdownRef = useRef(null);

  const apiUrl = "https://jse.arshan.digital/b1/professional-summary";
  const jobtitleapiurl = "https://jse.arshan.digital/b1/jobtitles"
  const token = sessionStorage.getItem("authToken");

  const fetchjobtitle = async () => {
    try {
      const res = await axios.get(jobtitleapiurl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobTitle(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch jobtitles info", err);
    }
  };

  const jobTitlesArray = [
    jobTitle.primary_title,
    jobTitle.secondary_title,
    jobTitle.tertiary_title,
  ].filter(Boolean);



  const fetchProfessionalsummaryInfo = async () => {
    try {
      const res = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });



      let info = {};

      if (Array.isArray(res.data)) {
        info = res.data[0] || {};
      } else if (Array.isArray(res.data?.professional_summary)) {
        info = res.data.professional_summary[0] || {};
      } else if (typeof res.data?.professional_summary === 'object') {
        info = res.data.professional_summary;
      } else if (typeof res.data === 'object') {
        info = res.data;
      }

      const hasData = Object.keys(info).length > 0;
      hasDataRef.current = hasData;  // <== keep immediate ref update
      setHasExistingData(hasData);

      console.log("existingdata", hasDataRef);


      setFormData({
        about: info.about || "",
        annual_income: info.annual_income || "",
        skills: Array.isArray(info.skills) ? info.skills : [], // populate skills
        newSkill: '', // keep this to avoid undefined issues
      });


    } catch (err) {
      console.error("Failed to fetch personal info", err);
    }
  };

  useEffect(() => {
    fetchProfessionalsummaryInfo();
    fetchjobtitle();
  }, []);

  useEffect(() => {
    console.log("Updated hasExistingData:", hasExistingData);
  }, [hasExistingData]);



  const filteredSkills = dynamicSkills.filter(skill =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (skill) => {
    setFormData({ ...formData, newSkill: skill });
    setSearchTerm(skill);
    setShowDropdown(false);
  };

  const [formData, setFormData] = useState({
    about: '',
    skills: [],
    newSkill: '',
    annual_income: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    const trimmedSkill = formData.newSkill.trim();

    if (!trimmedSkill) return;

    const isDuplicate = formData.skills.some(
      (skill) => skill.toLowerCase() === trimmedSkill.toLowerCase()
    );

    if (isDuplicate) {
      alert("This skill is already added!");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmedSkill],
      newSkill: '',
    }));

    setSearchTerm('');
  };


  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    console.log("🔍 Validating form:", formData);

    if (!formData.about.trim()) {
      console.error("❌ About field is empty");
      return false;
    }

    if (formData.skills.length === 0) {
      console.error("❌ No skills selected");
      return false;
    }

    if (!formData.annual_income.trim()) {
      console.error("❌ Annual income is empty");
      return false;
    }

    console.log("✅ Form validation passed!");
    return true;
  };



  const handleNext = async (e) => {
    e.preventDefault();
    console.log("handleNext clicked!");
    console.log("Is form valid?", validateForm());


    if (!validateForm()) return;

    const token = sessionStorage.getItem('authToken'); // Assuming token is stored as 'token'
    if (!token) {
      console.error("❌ No token found in sessionStorage");
      return;
    }

    const payload = {
      about: formData.about,
      skills: formData.skills,
      annual_income: parseFloat(formData.annual_income),
    };

    const method = hasDataRef.current ? 'PUT' : 'POST'; // <-- immediate & accurate

    console.log("method", method);

    try {
      const response = await fetch('https://jse.arshan.digital/b1/professional-summary', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Error uploading data:", data);
      } else {
        navigate('/user/onboarding/work-experience');
      }
    } catch (error) {
      console.error("❌ Network or server error:", error);
    }
  };

  // 🔁 Hook to handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-[87vh] w-[85%] mx-auto bg-white border mt-2 border-gray-300 shadow-lg shadow-gray-300/60 rounded-xl">
      <div className="flex flex-1 rounded-xl shadow-md shadow-slate-300">
        {/* Left Panel */}
        <div className="flex-1 flex justify-center items-center p-8 bg-white rounded-s-xl">
          <div className="max-w-md w-full">
            <form className="grid gap-y-6" onSubmit={handleNext}>
              {/* About */}
              <div className="relative ">
                <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                  Summary                         <span className="text-red-500">*</span>

                </label>
                <textarea
                  id='about'
                  name="about"
                  placeholder=" Describe about yourself.."
                  value={formData.about}
                  onChange={handleChange}
                  className="peer w-full p-4 border border-gray-300 text-gray-500 text-sm min-h-[100px] focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                />


              </div>

              {/* Skills */}
              <div className="mb-2">
                <div className="relative items-center mb-2" ref={dropdownRef}>
                  <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                    Skills    <span className="text-red-500">*</span>

                  </label>

                  <div className="expereince-title flex gap-4  mb-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                    {jobTitlesArray.map((title, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedTitle(title);

                          // 🔍 Find the selected job title from jobskills and update the dropdown skills
                          const matchedJob = jobskills[title];
                          if (matchedJob && Array.isArray(matchedJob.skills)) {
                            setDynamicSkills(matchedJob.skills);
                          } else {
                            setDynamicSkills([]); // fallback
                          };

                        


                          setSearchTerm('');           // optional: clear search bar
                          setShowDropdown(true);



                        }}

                        className={`flex-shrink-0 h-8 px-3 py-1.5 text-sm rounded snap-start cursor-pointer 
        ${selectedTitle === title ? 'bg-[#2c6472] text-white' : 'text-white bg-gray-500/40'}
        hover:bg-[#2c6472] hover:text-white transition-all duration-200`}
                      >
                        {title}
                      </div>
                    ))}
                  </div>
                  <div className='flex'>
                    <input
                      type="text"
                      className="peer w-full scrollbar-custom px-4 py-2 border border-gray-300 text-base text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                      placeholder="Search or select a skill..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                    />
                    {showDropdown && (
                      <ul className="absolute top-16 z-10 w-[78%] max-h-48 overflow-y-auto text-gray-600 bg-white border border-gray-300 shadow-md">
                        {filteredSkills.length > 0 ? (
                          filteredSkills.map((skill, index) => (
                            <li
                              key={index}
                              className="px-4 py-2 cursor-pointer hover:bg-[#2c6472] hover:text-white"
                              onClick={() => handleSelect(skill)}
                            >
                              {skill}
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-gray-400">No matching skills</li>
                        )}
                      </ul>
                    )}
                    <button
                      type="button"
                      onClick={addSkill}
                      className=" w-28 px-2 py-2 border-2 border-[#2c6472] text-[#2c6472] h-[41px] text-sm font-medium bg-white hover:scale-95 transition-transform ease-linear  duration-200 ml-2"
                    >
                      +Add Skill
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 h-[80px]  overflow-y-auto p-2 rounded ">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 h-8 px-3 py-1 text-gray-500 rounded-full flex items-center"
                    >
                      <span className="mr-2">{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-gray-500 hover:text-red-500 focus:outline-none"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>



              </div>

              {/* Annual Income */}
              <div className="relative mb-2">
                <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                  Desired Income (Annual)      <span className="text-red-500">*</span>

                </label>
                <input
                  id='annual_income'
                  type="text"
                  name="annual_income"
                  placeholder=" "
                  value={formData.annual_income}
                  onChange={handleChange}
                  className="peer w-full p-4 border border-gray-300 h-[41px] text-gray-500 text-base focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                />

              </div>

              {/* Navigation */}
              <div className="flex justify-center gap-5 ">
                <button
                  type="button"
                  className="teal-button px-6 py-2 bg-[#2c6472] text-white w-[100px] h-[41px] rounded-full focus:outline-none"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="teal-button px-6 py-2 bg-[#2c6472] text-white  h-[41px] w-[100px] rounded-full focus:outline-none"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-[#2c6472] flex flex-col justify-center items-center p-4 text-white rounded-e-xl">
          <div className="flex items-center mb-2">
            <img
              src={logo}
              className="h-8 w-8"
            />
            <h3 className="text-black text-xl font-medium">JSE AI</h3>
          </div>
          <div className="text-center ">
            <h3 className="text-white text-lg font-medium mb-4">Professional summary</h3>
          </div>
          <div className='relative mb-5 flex justify-center items-center ms-4'>
            <img src={frame} alt="" className='relative object-cover ' />
            <DotLottieReact
              src="https://lottie.host/5968740b-6c7a-4ce0-8e43-808c202722ae/P3fww1TqS8.lottie"
              loop
              autoplay
              style={{ width: "350px", height: "350px" }}
              className='absolute object-cover me-2 p-2'
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default ProfessionalSummary;
