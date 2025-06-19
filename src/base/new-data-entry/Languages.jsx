import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import right_arrow from '../../assets/left-arrow.png'

const Languages = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    language: '',
    proficiency: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('language', formData.language);
      formDataToSend.append('proficiency', formData.proficiency);


      const response = await fetch('https://jse.arshan.digital/b1/languages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      alert(`✅ Languages uploaded successfully`);

      setFormData({
        language: '',
        proficiency: ''
      });

    } catch (err) {
      console.error('Error uploading language:', err);
      alert('Failed to upload language data.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setLoading(true);
    navigate('/user/dashboard');
    // navigate("/user/onboarding/jobtitles");  // Only navigate, no data posting here
    setLoading(false);
  };


  return (
    <div className='w-full  p-5 ml-5  text-black'>
      <div className="flex flex-col">
        <div className="flex items-center mb-5 cursor-pointer">
          <img src={right_arrow} className='w-2.5 h-3.5 object-cover' alt="" />
          <p className='ml-2 text-lg font-medium'  onClick={() => navigate(-1)}>Back</p>
        </div>

        <div>
          <p className=' flex font-semibold text-[#2c6472]'>STEP 5 OF 8</p>
        </div>

        <div>
          <h1 className='text-2xl font-semibold mt-7'>Add the languages you know.</h1>
        </div>

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
              required
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
              {['Beginner(A1,A2)', 'Intermediate(B1,B2)', 'Fluent/Native(C1,C2)'].map((level) => (
                <label key={level} className="flex items-center cursor-pointer ">
                  <input
                    type="radio"
                    name="proficiency" // Fixed name attribute
                    value={level}
                    checked={formData.proficiency === level} // Fix checked condition
                    onChange={handleChange}
                    className="mr-2 mb-1 text-gray-500"
                  />
                  {level}
                </label>
              ))}
            </div>
          </div><br />

          {/* Buttons */}
          <div className="flex w-[70%] justify-between items-center gap-4 mt-4">
            <button
              type="submit"
              onClick={handleAddCertificate}
              className=" py-2 w-[180px] bg-white text-[#2c6472]  h-[43px]  font-semibold cursor-pointer mt-1 hover:scale-95 transition-transform duration-200 ease-in-out"
            >
              +Add languages
            </button>

            <button
              type="button"
              className=" teal-button px-6 py-2 bg-[#2c6472] text-white w-[100px] h-[41px]  rounded-xl focus:outline-none transition-transform duration-200 ease-in-out"
              onClick={handleNext}
            >
              {loading ? 'Saving...' : 'Next'}
            </button>
          </div>
        </form>
      </div>



    </div>
  )
}

export default Languages
