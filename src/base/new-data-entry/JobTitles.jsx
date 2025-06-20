import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import right_arrow from '../../assets/left-arrow.png';
import { jobskills } from '../../assets/data';
import { BASE_URL } from '../../utils/api';


const JobTitles = () => {
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const sortedJobTitles = Object.keys(jobskills).sort();

  const [formData, setFormData] = useState({
    primary_title: '',
    secondary_title: '',
    tertiary_title: '',
  });

  const [searchTerms, setSearchTerms] = useState({
    primary_title: '',
  });

  const [showDropdowns, setShowDropdowns] = useState({
    primary_title: false,
  });

  const [errors, setErrors] = useState({});

  const handleSearchChange = (e, fieldName) => {
    const { value } = e.target;
    setSearchTerms((prev) => ({ ...prev, [fieldName]: value }));
    setShowDropdowns((prev) => ({ ...prev, [fieldName]: true }));
  };

  const getFilteredTitles = (searchTerm) =>
    sortedJobTitles.filter((title) =>
      title.toLowerCase().includes((searchTerm || '').toString().toLowerCase())
    );

  const isDuplicate = (title) => {
    const lower = title.toLowerCase();
    return (
      formData.primary_title.toLowerCase() === lower ||
      formData.secondary_title.toLowerCase() === lower ||
      formData.tertiary_title.toLowerCase() === lower
    );
  };

  const addSkill = () => {
    const jobtitle = searchTerms.primary_title.trim();
    if (!jobtitle) return;

    if (isDuplicate(jobtitle)) {
      alert('This job title is already added!');
      return;
    }

    if (!formData.primary_title) {
      setFormData((prev) => ({ ...prev, primary_title: jobtitle }));
    } else if (!formData.secondary_title) {
      setFormData((prev) => ({ ...prev, secondary_title: jobtitle }));
    } else if (!formData.tertiary_title) {
      setFormData((prev) => ({ ...prev, tertiary_title: jobtitle }));
    } else {
      alert('You can only add up to 3 job titles.');
      return;
    }

    setSearchTerms({ primary_title: '' });
    setShowDropdowns({ primary_title: false });
    setErrors({});
  };

  const removeSkill = (fieldName) => {
    if (fieldName === 'primary_title') {
      setFormData((prev) => ({
        ...prev,
        primary_title: prev.secondary_title,
        secondary_title: prev.tertiary_title,
        tertiary_title: '',
      }));
    } else if (fieldName === 'secondary_title') {
      setFormData((prev) => ({
        ...prev,
        secondary_title: prev.tertiary_title,
        tertiary_title: '',
      }));
    } else if (fieldName === 'tertiary_title') {
      setFormData((prev) => ({ ...prev, tertiary_title: '' }));
    }
  };

  const handleSelect = (fieldName, value) => {
    setSearchTerms((prev) => ({ ...prev, [fieldName]: value }));
    setShowDropdowns((prev) => ({ ...prev, [fieldName]: false }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.primary_title) {
      newErrors.primary_title = 'Please add at least one job title';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!accepted) {
  alert('Please accept the condition before continuing.');
  return;
}

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('❌ No token found in sessionStorage');
      return;
    }

    const payload = {
      primary_title: formData.primary_title,
      secondary_title: formData.secondary_title,
      tertiary_title: formData.tertiary_title,
    };

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/jobtitles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Failed to upload job titles:', errorData);
      } else {
        alert('✅ Job Titles uploaded successfully');
        navigate('/user/onboarding/skills');
      }
    } catch (error) {
      console.error('❌ Error while posting job titles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdowns((prev) => ({ ...prev, primary_title: false }));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedTitles = [
    { key: 'primary_title', value: formData.primary_title },
    { key: 'secondary_title', value: formData.secondary_title },
    { key: 'tertiary_title', value: formData.tertiary_title },
  ].filter((item) => item.value);

  return (
    <div className='w-full p-5 ml-5 text-black'>
      <div className='flex flex-col'>
        <div className='flex items-center mb-5 cursor-pointer'>
          <img src={right_arrow} className='w-2.5 h-3.5 object-cover' alt='' />
          <p className='ml-2 text-lg font-medium' onClick={() => navigate(-1)}>Back</p>
        </div>

        <p className='flex font-semibold text-[#2c6472]'>STEP 5 OF 8</p>

        <h1 className='text-2xl font-semibold mt-7'>Your designation defines your position.</h1>

        <form className='ms-6' onSubmit={handleNext}>
          <div className='flex flex-col mt-5 mb-4'>
            <label className='mb-3 block font-medium text-lg'>
              Positions <span className='text-red-500 ms-1'>*</span>
            </label>
            <p className='text-base font-medium text-gray-500'>
              Job titles you're interested in.<br />
              Maximum of 3.
            </p>
          </div>

          <div className='relative flex mt-4 mb-1' ref={dropdownRef}>
            <input
              type='text'
              className={`w-[60%] h-[64px] px-4 py-3 border ${errors.primary_title ? 'border-red-500' : 'border-gray-300'} rounded-lg text-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2c6472]`}
              value={searchTerms.primary_title}
              onChange={(e) => handleSearchChange(e, 'primary_title')}
              onFocus={() => setShowDropdowns({ primary_title: true })}
              placeholder='Search or select job title...'
            />
            
 
            {showDropdowns.primary_title && (
              <ul className='absolute z-10 w-[60%] max-h-48 overflow-y-auto mt-14 bg-white border border-gray-300 rounded shadow-md'>
                {getFilteredTitles(searchTerms.primary_title).map((title, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect('primary_title', title)}
                    className='px-4 py-2 cursor-pointer text-gray-500 hover:bg-[#2c6472] hover:text-white'
                  >
                    {title}
                  </li>
                ))}
                {getFilteredTitles(searchTerms.primary_title).length === 0 && (
                  <li className='px-4 py-2 text-gray-400'>No matching titles</li>
                )}
              </ul>
            )}

            <button
              type='button'
              onClick={addSkill}
              disabled={selectedTitles.length >= 3}
              className='w-24 mt-2 ms-5 px-2 py-2 border-2 border-[#2c6472] text-[#2c6472] h-[44px] text-sm font-medium bg-white hover:scale-95 transition-transform ease-linear duration-200 ml-2'
            >
              +Add Skill
            </button>
          </div>

          {errors.primary_title && (
            <div className='text-red-500 text-sm mt-1'>{errors.primary_title}</div>
          )}

          <div className='flex flex-wrap w-[70%] mt-5 gap-3 h-[100px] p-2 rounded'>
            {selectedTitles.map(({ key, value }, index) => (
              <div
                key={index}
                className='bg-gray-100 h-8 px-3 py-1 text-gray-500 rounded-full flex items-center'
              >
                <span className='mr-2'>{value}</span>
                <button
                  type='button'
                  onClick={() => removeSkill(key)}
                  className='text-gray-500 text-xl hover:text-red-500 focus:outline-none'
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className='flex gap-3 mt-5'>
            <input
              type='checkbox'
              className='w-4 mt-0.5 h-4 bg-[#2c6472] text-[#2c6472]'
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <p className='text-sm text-gray-500'>
              Please enter your job title accurately. This cannot be changed once saved.
            </p>
          </div>
          <p className='text-xs mt-0.5 ms-7 text-red-500'>
            Note: You cannot change the job title after this. Please enter it carefully.
          </p>

          <div className='flex w-[70%] justify-end items-center gap-4 mt-8'>
            <button
              type='submit'
              className='teal-button px-6 py-2 bg-[#2c6472] text-white w-[100px] h-[41px] rounded-xl focus:outline-none transition-transform duration-200 ease-in-out'
            >
              {loading ? 'Saving...' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobTitles;
