import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import frame from "./../../assets/Frame.png";
import logo from "./../../assets/logo.png";
import axios from 'axios';


const PersonalInfo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    second_name: '',
    date_of_birth: '',
    address: '',
    linkedin_profile: '',
  });

  const apiUrl = 'https://jse.arshan.digital/b1/personal-info';

  const token = sessionStorage.getItem('authToken'); // Assuming token is stored as 'token'


  const [errors, setErrors] = useState({});

  const fetchProfileInfo = async () => {
    try {
      const res = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched response ✅", res.data); // <-- ADD THIS


      let info = {};

      if (Array.isArray(res.data)) {
        info = res.data[0] || {};
      } else if (Array.isArray(res.data?.personal_info)) {
        info = res.data.personal_info[0] || {};
      } else if (typeof res.data?.personal_info === 'object') {
        info = res.data.personal_info;
      } else if (typeof res.data === 'object') {
        info = res.data;
      }


      setFormData({
        first_name: (info.first_name || "").trim(),
        second_name: (info.second_name || "").trim(),
        date_of_birth: info.date_of_birth || "",
        address: info.address || "",
        linkedin_profile: info.linkedin_profile || ""
      });
    } catch (err) {
      console.error("Failed to fetch personal info", err);
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }


    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;


    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error uploading data:', errorData);
      } else {
        navigate("/user/onboarding/jobtitles");  // Only navigate, no data posting here
      }
    } catch (error) {
      console.error('❌ Network error:', error);
    }
  };

  const fields = [
    { label: 'First Name', name: 'first_name', type: 'text' },
    { label: 'Last Name', name: 'second_name', type: 'text' },
    { label: 'Date of Birth ', name: 'date_of_birth', type: 'date' },
    { label: 'Current address', name: 'address', type: 'text' },
    { label: 'Linkedin Profile', name: 'linkedin_profile', type: 'text' },
  ];

  return (
    <div className="flex flex-col min-h-[87vh] w-[85%] mx-auto bg-white border mt-2 border-gray-300 rounded-xl shadow-lg shadow-gray-300/60">
      <div className="flex flex-1 rounded-xl shadow-md shadow-slate-300">
        {/* Left Panel */}
        <div className="flex flex-1 justify-center items-center p-8 bg-white rounded-s-xl">
          <div className="max-w-lg w-full">
            <form className="grid gap-y-6" onSubmit={handleNext}>
              {fields.map((field) => (
                <div key={field.name} className="relative h-15 flex flex-col ">
                  <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                    {field.label}
                    <label className=" text-gray-700 font-medium mb-1 ms-1">
                      {field.name !== 'second_name' && field.name !== 'linkedin_profile' && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                  </label>
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    placeholder=" "
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.name !== 'second_name' && field.name !== 'linkedin_profile'}
                    className="  w-full h-full px-4 py-4   border text-gray-500 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                  />
                </div>
              ))}

              {/* Button Section */}
              <div className="flex justify-center gap-5 mt-4">
                <button
                  type="button"
                  className="teal-button px-6 py-2 bg-[#2c6472] text-white w-[100px] h-[41px] rounded-full focus:outline-none"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="teal-button px-6 py-2 bg-[#2c6472] text-white w-[100px] h-[41px] rounded-full focus:outline-none"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-[#2c6472] flex flex-col justify-center items-center p-4 text-white rounded-e-xl">
          <div className="flex items-center ms-1 mb-2">
            <img
              src={logo}
              className="h-8 w-8"
            />
            <h3 className="text-black text-xl font-medium">JSE AI</h3>
          </div>
          <div className="text-center ">
            <h3 className="text-white ms-4 text-lg font-medium mb-4">Personal Info</h3>
          </div>
          <div className='relative mb-5 flex justify-center items-center ms-4'>
            <img src={frame} alt="" className='relative object-cover ' />
            <DotLottieReact
              src="https://lottie.host/72d38dc2-d827-4840-aa4b-e45bd40fcc7a/bpxhRARUmj.lottie"
              loop
              autoplay
              style={{ width: '250px', height: '250px' }}
              className='absolute object-cover me-2 p-2'
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default PersonalInfo;
