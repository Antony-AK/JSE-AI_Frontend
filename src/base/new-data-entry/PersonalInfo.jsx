import React, { useState, useEffect } from 'react'
import axios from 'axios';
import drop from '../../assets/drop-icon.svg'
import { useNavigate, useLocation } from 'react-router-dom';
import right_arrow from "../../assets/left-arrow.png"
import { BASE_URL } from '../../utils/api'

const PersonalInfo = () => {

  const navigate = useNavigate();

  const apiUrl = `${BASE_URL}/personal-info`;

  const token = sessionStorage.getItem('authToken');

  const [showOthers, setShowOthers] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    second_name: '',
    email: '',
    phone: '',
    linkedin_profile: '',
    country: '',
    state: '',
    city: '',
    portfolio: '',
    resume: '',
    blog: ''
  });

  const [errors, setErrors] = useState({});
  const [showSavePopup, setShowSavePopup] = useState(false);

  useEffect(() => {
    const hasSubmitted = sessionStorage.getItem("hasSubmittedPersonalInfo");
    if (hasSubmitted === "true") {
      fetchProfileInfo();
    }
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const res = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        first_name: (info.first_name || ''),
        second_name: (info.second_name || ''),
        email: (info.email || ''),
        phone: (info.phone || ''),
        linkedin_profile: (info.linkedin_profile || ''),
        country: (info.country || ''),
        state: (info.state || ''),
        city: (info.city || ''),
        title: (info.title || ''),
        portfolio: (info.portfolio || ''),
        resume: (info.resume || ''),
        blog: (info.blog || '')
      });

      if (info.portfolio || info.resume || info.blog) {
        setShowOthers(true);
      }

    } catch (err) {
      console.error("❌ Failed to fetch personal info", err);
    }
  };  

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [id]: newValue
    }));

    // Clear error when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: ''
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.second_name.trim()) newErrors.second_name = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.linkedin_profile.trim()) newErrors.linkedin_profile = "LinkedIn is required";

    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
          alert("No token found. Please login again.");
          return;
        }

        const response = await axios.post(apiUrl, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        sessionStorage.setItem("hasSubmittedPersonalInfo", "true");

        setShowSavePopup(true);
        setTimeout(() => {
          setShowSavePopup(false);
          navigate('/user/onboarding/work-experience');
        }, 2500);

      } catch (error) {
        console.error("❌ Error submitting form:", JSON.stringify(error.response?.data, null, 2));
        alert("Failed to submit. Please try again.");
      }
    }
  };


  return (
    <div className='p-10 pt-14 flex flex-col gap-5 w-[100%] min-h-screen overflow-y-auto'>

      <div className="flex items-center -mt-10 cursor-pointer">
        <img src={right_arrow} className='w-2.5 h-3.5 object-cover' alt="" />
        <p className='ml-2 text-lg font-medium' onClick={() => navigate('/user/dataonboarding')}>Back</p>
      </div>

      <p className='text-[#2c6472] font-semibold'>STEP 1 OF 8</p>

      <h2 className='font-bold text-xl'>Let's start with your personal information.</h2>

      <form onSubmit={handleSubmit} className="p-5 pt-2 flex flex-col gap-5 w-[80%]">

        {/* Name */}
        <div className="flex justify-start gap-10 text-lg w-full">
          <div className="flex flex-col gap-2 w-[50%]">
            <label className='font-medium' htmlFor="first_name">First Name <span className='text-red-500'>*</span></label>
            <input
              className={`px-5 py-3 rounded-lg border ${errors.first_name ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
              value={formData.first_name}
              onChange={handleChange}
              type="text"
              id='first_name'
            />
            {errors.first_name && <span className="text-red-500 text-sm">{errors.first_name}</span>}
          </div>
          <div className="flex flex-col gap-2 w-[50%]">
            <label className='font-medium' htmlFor="second_name">Last Name <span className='text-red-500'>*</span></label>
            <input
              className={`px-5 py-3 rounded-lg border ${errors.second_name ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
              value={formData.second_name}
              onChange={handleChange}
              type="text"
              id='second_name'
            />
            {errors.second_name && <span className="text-red-500 text-sm">{errors.second_name}</span>}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="email">Email Address <span className='text-red-500'>*</span></label>
          <input
            className={`px-5 py-3 rounded-lg border ${errors.email ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
            value={formData.email}
            onChange={handleChange}
            type="email"
            id='email'
            disabled
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="phone">Phone Number <span className='text-red-500'>*</span></label>
          <input
            className={`px-5 py-3 rounded-lg border ${errors.phone ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            id='phone'
            disabled
          />
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
        </div>

        {/* Linked in */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="linkedin_profile">linkedIn Profile <span className='text-red-500'>*</span></label>
          <input
            className={`px-5 py-3 rounded-lg border ${errors.linkedin_profile ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
            value={formData.linkedin_profile}
            onChange={handleChange}
            type="text"
            id='linkedin_profile'
          />
          {errors.linkedin_profile && <span className="text-red-500 text-sm">{errors.linkedin_profile}</span>}
        </div>

        <div onClick={() => setShowOthers(!showOthers)} className="flex items-center gap-3 cursor-pointer w-fit">
          <p className='text-[#2c6472] font-semibold'>Others</p>
          <img width="15px" src={drop} alt="" className={`transform transition-transform duration-300 ${showOthers ? 'rotate-180' : 'rotate-0'}`} />
        </div>

        {/* Portfolio, Resume, Blog */}
        {showOthers && (
          <div className='flex flex-col gap-5'>
            {/* Portfolio */}

            <div className="flex justify-start gap-10 text-lg w-full">
              <div className="flex flex-col gap-2 w-[50%]">
                <label className='font-medium' htmlFor="portfolio_label">Portfolio</label>
                <input
                  className={`px-5 py-3 rounded-lg border ${errors.portfolio_label ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]  placeholder-black`}
                  value={formData.portfolio_label}
                  onChange={handleChange}
                  type="text"
                  id='portfolio_label'
                  disabled
                  placeholder='Portfolio'
                />
                {errors.portfolio_label && <span className="text-red-500 text-sm">{errors.portfolio_label}</span>}
              </div>
              <div className="flex flex-col gap-2 w-[50%]">
                <label className='font-medium' htmlFor="portfolio">Link</label>
                <input
                  className={`px-5 py-3 rounded-lg border ${errors.portfolio ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                  value={formData.portfolio}
                  onChange={handleChange}
                  type="text"
                  id='portfolio'
                />
                {errors.portfolio && <span className="text-red-500 text-sm">{errors.portfolio}</span>}
              </div>
            </div>

            {/* Resume */}
            
            <div className="flex justify-start gap-10 text-lg w-full">
              <div className="flex flex-col gap-2 w-[50%]">
                <label className='font-medium' htmlFor="resume_label">Resume</label>
                <input
                  className={`px-5 py-3 rounded-lg border ${errors.resume_label ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]  placeholder-black`}
                  value={formData.resume_label}
                  onChange={handleChange}
                  type="text"
                  id='resume_label'
                  disabled
                  placeholder='Resume'
                />
                {errors.resume_label && <span className="text-red-500 text-sm">{errors.resume_label}</span>}
              </div>
              <div className="flex flex-col gap-2 w-[50%]">
                <label className='font-medium' htmlFor="resume">Link</label>
                <input
                  className={`px-5 py-3 rounded-lg border ${errors.resume ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                  value={formData.resume}
                  onChange={handleChange}
                  type="text"
                  id='resume'
                />
                {errors.resume && <span className="text-red-500 text-sm">{errors.resume}</span>}
              </div>
            </div>

            {/* Resume */}
            
            <div className="flex justify-start gap-10 text-lg w-full">
              <div className="flex flex-col gap-2 w-[50%]">
                <label className='font-medium' htmlFor="blog_label">Blog</label>
                <input
                  className={`px-5 py-3 rounded-lg border ${errors.blog_label ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]  placeholder-black`}
                  value={formData.blog_label}
                  onChange={handleChange}
                  type="text"
                  id='blog_label'
                  disabled
                  placeholder='Blog'
                />
                {errors.blog_label && <span className="text-red-500 text-sm">{errors.blog_label}</span>}
              </div>
              <div className="flex flex-col gap-2 w-[50%]">
                <label className='font-medium' htmlFor="resume">Link</label>
                <input
                  className={`px-5 py-3 rounded-lg border ${errors.blog ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                  value={formData.blog}
                  onChange={handleChange}
                  type="text"
                  id='blog'
                />
                {errors.blog && <span className="text-red-500 text-sm">{errors.blog}</span>}
              </div>
            </div>

          </div>
        )}

        {/* Country */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="country">Country</label>
          <input
            className='px-5 py-3 rounded-lg border border-[rgba(0, 0, 0, 0.14)] outline-none focus:border-[#2c6472]'
            value={formData.country}
            onChange={handleChange}
            type="text"
            id='country'
          />
        </div>

        {/* State */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="state">State</label>
          <input
            className='px-5 py-3 rounded-lg border border-[rgba(0, 0, 0, 0.14)] outline-none focus:border-[#2c6472]'
            value={formData.state}
            onChange={handleChange}
            type="text"
            id='state' />
        </div>

        {/* City */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="city">City</label>
          <input
            className='px-5 py-3 rounded-lg border border-[rgba(0, 0, 0, 0.14)] outline-none focus:border-[#2c6472]'
            value={formData.city}
            onChange={handleChange}
            type="text"
            id='city'
          />
        </div>

        <div className="flex justify-end mt-7">
          <button type="submit" className='rounded-xl px-8 py-2 bg-[#2C6472] text-[#fff] mb-10'>Next</button>
        </div>

      </form>


      {showSavePopup && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 bg-white border-b-4 border-[#2C6472] text-black rounded-md shadow-lg transform transition-all duration-500 ease-in-out animate-toast-in`}>
          <div className="relative px-3 py-1">
            <span>✅ PersonalInfo saved successfully!</span>
            <div className="absolute bottom-0 left-0 h-[3px] bg-white animate-progress w-full" />
          </div>
        </div>
      )}

    </div>
  )
}

export default PersonalInfo