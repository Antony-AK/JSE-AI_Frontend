import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import frame from "./../../assets/Frame.png";
import logo from "./../../assets/logo.png";


const Education = () => {
  const navigate = useNavigate();
  const sessionKey = 'education-token'; // Key to fetch the token
  const apiUrl = 'https://jse.arshan.digital/b1/education';

  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    achievements: ''
  });

  const handleAddEducation = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Error: No token found in session storage.');
      return;
    }

    // Transforming the date inputs to ISO 8601 format
    const formatDateToISO = (date) => {
      const localDate = new Date(date);
      // Format to YYYY-MM-DD, or adjust to the format your backend expects
      return localDate.toISOString().split('T')[0];
    };

    const updatedFormData = {
      degree: e.target.degree.value,
      institution: e.target.institution.value,
      field_of_study: e.target.field_of_study.value,
      start_date: formatDateToISO(e.target.start_date.value),
      end_date: formatDateToISO(e.target.end_date.value),
      achievements: e.target.achievements.value
    };



    try {
      const response = await axios.post(apiUrl, updatedFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert(`✅ Education data uploaded successfully`);

      setFormData({
        degree: '',
        institution: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        achievements: ''
      });
    } catch (error) {
      console.error('Error uploading data:', error);
      if (error.response) {
        console.error('API Response:', error.response.data);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    navigate('/user/onboarding/certificates');
  };


  return (
    <div className="flex flex-col  h-[87vh]  w-[85%] mx-auto  border mt-2 border-gray-300 rounded-xl shadow-lg shadow-gray-300/60">
      <div className="flex flex-1 bg-slate-400 rounded-xl shadow-md shadow-slate-300">
        {/* Left Panel */}
        <div className="flex flex-1 justify-center items-center p-8 bg-white rounded-s-xl">
          <div className="w-full max-w-md">
            <form className="flex flex-col -space-y-2" onSubmit={handleAddEducation}>
              {/* Degree Title */}
              <div className="relative ">
                <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                  Degree Title <span className="text-red-500">*</span>
                </label>
                <input
                  id='degree'
                  type="text"
                  name="degree"
                  placeholder=" "
                  onChange={handleChange}
                  value={formData.degree}
                  required
                  className="w-full h-[52px] px-4 py-3 border border-gray-300 text-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#2c6472] peer"
                />

              </div><br />

              {/* Institution Name */}
              <div className="relative ">
                <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                  Institution Name <span className="text-red-500">*</span>
                </label>
                <input
                  id='institution'
                  type="text"
                  name="institution"
                  placeholder="  "
                  onChange={handleChange}
                  value={formData.institution}
                  required
                  className="w-full h-[52px] px-4 py-3 border border-gray-300 text-gray-500  text-base focus:outline-none focus:ring-1 focus:ring-[#2c6472] peer"
                />

              </div><br />

              {/* Field of Study */}
              <div className="relative ">
                <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                  Field of Study <span className="text-red-500">*</span>
                </label>
                <input
                  id='field_of_study'
                  type="text"
                  name="field_of_study"
                  placeholder=" "
                  onChange={handleChange}
                  value={formData.field_of_study}
                  required
                  className="w-full h-[52px] px-4 py-3 border border-gray-300 text-gray-500  text-sm focus:outline-none focus:ring-1 focus:ring-[#2c6472] peer"
                />

              </div><br />

              {/* Start and End Dates */}
              <div className="flex gap-5 ">
                <div className="relative flex-1">
                  <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id='start_date'
                    type="date"
                    name="start_date"
                    placeholder=" "
                    onChange={handleChange}
                    value={formData.start_date}
                    required
                    className="w-full h-[52px] px-4 py-4 border text-gray-500 border-gray-300  text-sm focus:outline-none focus:ring-1 focus:ring-[#2c6472] peer"
                  />

                </div>
                <div className="relative flex-1">
                  <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id='end_date'
                    type="date"
                    name="end_date"
                    placeholder=" "
                    onChange={handleChange}
                    value={formData.end_date}
                    required
                    className="w-full h-[52px] px-4 py-4 border text-gray-500 border-gray-300  text-sm focus:outline-none focus:ring-1 focus:ring-[#2c6472] peer"
                  />

                </div>
              </div><br />

              {/* Achievements */}
              <div className="relative ">
                <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                  Achievements <span className="text-red-500">*</span>
                </label>
                <textarea
                  id='achievements'
                  name="achievements"
                  placeholder=" "
                  onChange={handleChange}
                  value={formData.achievements}
                  required
                  className="w-full p-4 border border-gray-300 text-gray-500 text-sm min-h-[100px] peer focus:outline-none focus:ring-1  focus:ring-[#2c6472]"
                />

              </div><br />

              {/* Buttons */}
              <div className="flex justify-center items-center gap-4">
                <button type="button"
                  className="px-6 py-2 teal-button bg-[#2c6472] text-white w-[100px] h-[41px] rounded-full focus:outline-none"
                  onClick={() => navigate(-1)}>
                  Back
                </button>
                <button
                  type="submit"
                  className=" px-6 py-2 bg-white text-[#2c6472] border border-[#2c6472] h-[43px] rounded-full text-sm font-semibold cursor-pointer mt-1 hover:scale-95 transition-transform duration-200"
                >
                  +Add Education
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 teal-button bg-[#2c6472] text-white w-[100px] h-[41px] rounded-full focus:outline-none"
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
            <h3 className="text-white ms-4 text-lg font-medium mb-4">Education</h3>
          </div>
          <div className='relative mb-5 flex justify-center items-center ms-4'>
            <img src={frame} alt="" className='relative object-cover ' />
            <DotLottieReact
              src="https://lottie.host/a5116b74-e6e0-4fef-abfb-d99d2b580033/msf2IWJRuh.lottie"
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

export default Education;
