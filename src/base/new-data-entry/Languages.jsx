import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import right_arrow from '../../assets/left-arrow.png'
import { BASE_URL } from '../../utils/api';
import { MoreVertical } from "lucide-react";


const Languages = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    language: '',
    proficiency: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [addedCompanies, setAddedCompanies] = useState([]);



  useEffect(() => {
    // Remove old session handling — not needed
  }, []);



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
      alert('You are not authenticated. Please login.');
      return;
    }

    setLoading(true);
    setShowSavePopup(true);

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
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('You are not authenticated. Please login.');
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
      alert('Failed to upload language data.');
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className='w-full  p-5 ml-5  text-black'>
      <div className="flex flex-col">
        <div className="flex items-center mb-5 cursor-pointer">
          <img src={right_arrow} className='w-2.5 h-3.5 object-cover' alt="" />
          <p className='ml-2 text-lg font-medium' onClick={() => navigate(-1)}>Back</p>
        </div>

        <div>
          <p className=' flex font-semibold text-[#2c6472]'>STEP 5 OF 8</p>
        </div>

        <div>
          <h1 className='text-2xl font-semibold mt-7'>Add the languages you know.</h1>
        </div>

           {addedCompanies.length > 0 && (
                <div className=" px-6 py-4 -mb-5 flex gap-3 rounded-lg">
                    <ul className="flex gap-3 overflow-x-auto scrollbar-hide">
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

          {/* Buttons */}
          <div className="flex w-[70%] justify-between items-center gap-4 mt-4">
            <button
              type="submit"
              className=" py-2 w-[180px] bg-white text-[#2c6472]  h-[43px]  font-semibold cursor-pointer mt-1 hover:scale-95 transition-transform duration-200 ease-in-out"
            >
              +Add Another
            </button>

            <button
              type="button"
              className=" teal-button px-6 py-2 bg-[#2c6472] text-white  h-[41px]  rounded-xl focus:outline-none transition-transform duration-200 ease-in-out"
              onClick={handleNext}
            >
              {loading ? 'Saving...' : 'Save & Next'}
            </button>
          </div>
        </form>
      </div>

     




    </div>
  )
}

export default Languages
