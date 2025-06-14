import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import frame from "./../../assets/Frame.png";
import logo from "./../../assets/logo.png";
import { jobskills } from '../../assets/data';

const JobTitle = () => {
  const navigate = useNavigate();
  const dropdownRefs = {
    primary_title: useRef(null),
    secondary_title: useRef(null),
    tertiary_title: useRef(null),
  };

  // const sortedJobTitles = [...jobskills.map((j) => j.jobTitle)].sort();
  const sortedJobTitles = Object.keys(jobskills).sort();



  const [formData, setFormData] = useState({
    primary_title: '',
    secondary_title: '',
    tertiary_title: '',
  });

  const [searchTerms, setSearchTerms] = useState({
    primary_title: '',
    secondary_title: '',
    tertiary_title: '',
  });

  const [showDropdowns, setShowDropdowns] = useState({
    primary_title: false,
    secondary_title: false,
    tertiary_title: false,
  });

  const [errors, setErrors] = useState({});

  const handleSearchChange = (e, fieldName) => {
    const { value } = e.target;
    setSearchTerms((prev) => ({ ...prev, [fieldName]: value }));
    setShowDropdowns((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleSelect = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setSearchTerms((prev) => ({ ...prev, [fieldName]: value }));
    setShowDropdowns((prev) => ({ ...prev, [fieldName]: false }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.primary_title) {
      newErrors.primary_title = 'Primary title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('❌ No token found in sessionStorage');
      return;
    }

    try {
      const response = await fetch('https://jse.arshan.digital/b1/jobtitles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Failed to upload job titles:', errorData);
      } else {
        alert(`✅ Job Titles uploaded successfully`);
        navigate('/user/onboarding/professional-summary');
      }
    } catch (error) {
      console.error('❌ Error while posting job titles:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs).forEach((field) => {
        if (
          dropdownRefs[field].current &&
          !dropdownRefs[field].current.contains(event.target)
        ) {
          setShowDropdowns((prev) => ({ ...prev, [field]: false }));
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFilteredTitles = (searchTerm) =>
    sortedJobTitles.filter((title) =>
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );



  return (
    <div className="flex flex-col min-h-[87vh] w-[85%] mx-auto bg-white border mt-2 border-gray-300 rounded-xl shadow-lg shadow-gray-300/60">
      <div className="flex flex-1 rounded-xl shadow-md shadow-slate-300">
        {/* Left Panel */}
        <div className="flex flex-1 justify-center items-center p-8 bg-white rounded-s-xl">
          <div className="max-w-lg w-full">
            <form className="grid gap-y-4" onSubmit={handleNext}>
              {['primary_title', 'secondary_title', 'tertiary_title'].map((fieldName) => (
                <div key={fieldName} className="relative mb-6" ref={dropdownRefs[fieldName]}>
                  <label className="text-gray-500 text-sm mb-1 ms-3 block">
                    {fieldName.split('_')[0].charAt(0).toUpperCase() +
                      fieldName.split('_')[0].slice(1)}{' '}
                    Title
                    {fieldName === 'primary_title' && (
                      <span className="text-red-500 ms-1"> *</span>
                    )}
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'
                      } rounded-md text-base text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2c6472]`}
                    placeholder={`Search or select ${fieldName.split('_')[0]} title...`}
                    value={searchTerms[fieldName]}
                    onChange={(e) => handleSearchChange(e, fieldName)}
                    onFocus={() => setShowDropdowns((prev) => ({ ...prev, [fieldName]: true }))}
                  />
                  {showDropdowns[fieldName] && (
                    <ul className="absolute z-10 w-full max-h-48 overflow-y-auto mt-1 bg-white border border-gray-300 rounded shadow-md">
                      {getFilteredTitles(searchTerms[fieldName]).map((title, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelect(fieldName, title)}
                          className="px-4 py-2 cursor-pointer text-gray-500 hover:bg-[#2c6472] hover:text-white"
                        >
                          {title}
                        </li>
                      ))}
                      {getFilteredTitles(searchTerms[fieldName]).length === 0 && (
                        <li className="px-4 py-2 text-gray-400">No matching titles</li>
                      )}
                    </ul>
                  )}
                  {errors[fieldName] && (
                    <div className="text-red-500 text-sm mt-1">{errors[fieldName]}</div>
                  )}
                </div>
              ))}

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="teal-button px-6 py-2 bg-[#2c6472] text-white w-[100px] h-[41px] rounded-full  focus:outline-none"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="teal-button px-6 py-2 bg-[#2c6472] text-white w-[100px] h-[41px]  rounded-full focus:outline-none"
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
            <img src={logo} className="h-8 w-8" />
            <h3 className="text-black text-xl font-medium">JSE AI</h3>
          </div>
          <div className="text-center">
            <h3 className="text-white text-lg font-medium ms-4 mb-4">Job Preferences</h3>
          </div>
          <div className="relative mb-5 flex justify-center items-center ms-4">
            <img src={frame} alt="" className="relative object-cover" />
            <DotLottieReact
              src={'https://lottie.host/a5116b74-e6e0-4fef-abfb-d99d2b580033/msf2IWJRuh.lottie'}
              loop
              autoplay
              style={{ width: '250px', height: '250px' }}
              className="absolute object-cover me-2 p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTitle;
