import React, { useState } from 'react'
import axios from 'axios';
import drop from '../../assets/drop-icon.svg'
import { useNavigate } from 'react-router-dom';
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
    title: '',
    link: '',
  });

  const [errors, setErrors] = useState({});

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

    if (showOthers) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.link.trim()) newErrors.link = "Link is required";
    }

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

        console.log("✅ Form submitted successfully:", response.data);
        navigate('/user/onboarding/work-experience');

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

        {/* Portfolio */}
        {showOthers && (
          <div className="flex justify-start gap-10 text-lg w-full">
            <div className="flex flex-col gap-2 w-[50%]">
              <label className='font-medium' htmlFor="title">Title <span className='text-red-500'>*</span></label>
              <input
                className={`px-5 py-3 rounded-lg border ${errors.title ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                value={formData.title}
                onChange={handleChange}
                type="text"
                id='title'
              />
              {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
            </div>
            <div className="flex flex-col gap-2 w-[50%]">
              <label className='font-medium' htmlFor="link">Link <span className='text-red-500'>*</span></label>
              <input
                className={`px-5 py-3 rounded-lg border ${errors.link ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                value={formData.link}
                onChange={handleChange}
                type="text"
                id='link'
              />
              {errors.link && <span className="text-red-500 text-sm">{errors.link}</span>}
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

    </div>
  )
}

export default PersonalInfo