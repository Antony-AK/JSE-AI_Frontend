import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import right_arrow from '../../assets/left-arrow.png'
import { BASE_URL } from '../../utils/api';
import { MoreVertical } from "lucide-react";
import warning from "../../assets/carbon_warning.png"



const Languages = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    language: '',
    proficiency: ''
  });


  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [addedCompanies, setAddedCompanies] = useState([]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };



  const validateForm = () => {
    const newErrors = {};
    if (!formData.language.trim()) {
      newErrors.language = 'Language name is required';
    }
    if (!formData.proficiency) {
      newErrors.proficiency = 'Proficiency level is required';
      toast.error(errors.response?.data.issue || 'Please select a proficiency level');
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    return true;
  };


  const handleAddCertificate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/user/login');
      toast.error('User not found. Please log in');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        language: formData.language,
        proficiency: formData.proficiency,
      };

      const response = await fetch(`${BASE_URL}/languages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Upload failed');
      }

      setFormData({
        language: '',
        proficiency: ''
      });

      setAddedCompanies((prev) => [...prev, formData.language]);


    } catch (err) {
      console.error('Error uploading language:', err);
      toast.error('Failed to upload language.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      toast.error('User not found. Please log in.');
      return;
    }

    setLoading(true);
    try {


      const response = await fetch(`${BASE_URL}/languages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Add this

        },
        body: JSON.stringify({
          language: formData.language,
          proficiency: formData.proficiency,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }


      setFormData({
        language: '',
        proficiency: ''
      });

      navigate('/user/onboarding/certificates');

    } catch (err) {
      console.error('Error uploading language:', err);
      toast.error(errors.response?.data.issue || 'Failed to upload language.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='w-full  p-5 ml-5  text-black'>

      {addedCompanies.length > 0 && (
        <div className="flex absolute items-center justify-end w-[85%] mt-2">
          <div
            className="cursor-pointer px-4 py-2 rounded transition"
            onClick={() => navigate('/user/onboarding/certificates')}
          >
            <p className="text-lg font-medium text-[#00000057]">Skip</p>
          </div>
        </div>
      )}
      <div className="flex flex-col">

        <div>
          <p className=' flex font-semibold text-[#2c6472]'>STEP 5 OF 8</p>
        </div>

        <div>
          <h1 className='text-2xl font-semibold mt-7'>Add the languages you know.</h1>
        </div>


        {addedCompanies.length > 0 && (
          <div className=" px-6 py-4 -mb-5 flex gap-3 rounded-lg w-[90%]">
            <ul className="flex gap-3 overflow-x-auto hide-scrollbar">
              {addedCompanies.map((company, index) => (
                <li className='bg-gray-500/30 px-4 py-2 rounded-lg min-w-32 text-center font-semibold text-[#2c6472]' key={index}>{company}</li>
              ))}
            </ul>
          </div>
        )}



        <form className="flex flex-col mt-5 ms-6 " onSubmit={handleAddCertificate}>
          {/* Language Input */}
          <div className="relative mb-2">
            <label className="mb-3 block font-medium text-lg ">
              Language <span className='text-red-500 ms-1'>*</span>
            </label>
            <input
              id='language'
              type="text"
              name="language" // Fixed name attribute
              placeholder=" "
              value={formData.language}
              onChange={handleChange}
              className={`w-[70%] h-[64px] flex mb-1 px-4 py-6 border text-lg shadow-sm rounded-lg focus:outline-none focus:ring-1 
              ${errors.language ? 'border-red-500 animate-shake' : 'border-gray-300 focus:ring-[#2c6472]'}`}
            />
            {errors.language && (
              <span className="text-red-500 text-sm mt-1">{errors.language}</span>
            )}
          </div><br />

          {/* Proficiency */}
          <div className="mb-2 ms-1">
            <p className="  text-lg font-medium mb-3">Proficiency <span className='text-red-500 ms-1'>*</span></p>
            <div className="flex flex-col gap-5">
              {[
                { label: 'Beginner (A1, A2)', value: 'beginner' },
                { label: 'Intermediate (B1, B2)', value: 'intermediate' },
                { label: 'Fluent / Native (C1, C2)', value: 'fluent' }, // or use 'native' if needed
              ].map((level) => (
                <label key={level.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="proficiency"
                    value={level.value}
                    checked={formData.proficiency === level.value}
                    onChange={handleChange}
                    className="mr-2 mb-1 text-gray-500"
                  />
                  {level.label}
                </label>
              ))}

            </div>
          </div><br />

          <div className='text-xs flex items-center justify-start text-center  '><p><span className='font-medium'>Please note:</span><span className='text-[#2c6472] ms-1'>Enter your details carefully , you can  only edit them later.</span></p></div>


          {/* Buttons */}
          <div className="flex w-[70%] justify-between items-center gap-4 mt-4 mb-10">
            <button
              type="submit"
              disabled={loading}
              className={`py-2 w-[180px] h-[43px] font-semibold mt-1 transition-transform duration-200 ease-in-out
                ${loading ? 'bg-white cursor-not-allowed' : 'bg-white text-[#2c6472] hover:scale-95'}`}
            >
              + Add Another
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className={`teal-button px-6 py-2 h-[40px] rounded-xl transition-transform duration-200 ease-in-out
                flex items-center justify-center
                ${loading ? 'bg-[#2c6472]/70 cursor-not-allowed' : 'bg-[#2c6472]'} text-white w-[150px]`}
            >
              {loading ? (
                <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Save & Next'
              )}
            </button>
          </div>
        </form>
      </div>


      {/* Footer appears after scrolling all content */}
      <div className="flex justify-start gap-2 text-[#2c6472] font-medium text-sm mt-8">
        <img src={warning} className="w-5 ms-5 h-5 object-cover" alt="" />
        AI is not perfect. Make sure your data is accurate before saving.            </div>

    </div>
  )
}

export default Languages
