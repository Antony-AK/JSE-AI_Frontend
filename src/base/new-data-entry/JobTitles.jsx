import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import right_arrow from '../../assets/left-arrow.png';
import { jobskills } from '../../assets/data';
import { BASE_URL } from '../../utils/api';
import warning from "../../assets/carbon_warning.png"



const JobTitles = () => {

  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const sortedJobTitles = Object.keys(jobskills).sort();
  const firstMatchRef = useRef(null);
  const [pendingTitleToAdd, setPendingTitleToAdd] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // 👈 new
  const itemRefs = useRef([]);





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

    setSearchTerms((prev) => ({
      ...prev,
      [fieldName]: value, // ✅ Let the user type freely
    }));

    setShowDropdowns((prev) => ({ ...prev, [fieldName]: true }));
  };


  const getFilteredTitles = (searchTerm) =>
    sortedJobTitles.filter((title) =>
      title.toLowerCase().includes((searchTerm || '').toString().toLowerCase())
    );

  const isDuplicate = (title) => {
    const lower = title.toLowerCase();
    return (
      formData.primary_title?.toLowerCase() === lower ||
      formData.secondary_title?.toLowerCase() === lower ||
      formData.tertiary_title?.toLowerCase() === lower
    );
  };



  const filteredTitles = getFilteredTitles(searchTerms.primary_title);



 const addSkill = (jobtitle) => {
  jobtitle = jobtitle?.trim();
  if (!jobtitle || !sortedJobTitles.includes(jobtitle)) {
    toast.error("Please select a valid job title.");
    return;
  }

  if (isDuplicate(jobtitle)) {
    toast.error('This job title was already added!');
    return;
  }

  if (!formData.primary_title) {
    setFormData((prev) => ({ ...prev, primary_title: jobtitle }));
  } else if (!formData.secondary_title) {
    setFormData((prev) => ({ ...prev, secondary_title: jobtitle }));
  } else if (!formData.tertiary_title) {
    setFormData((prev) => ({ ...prev, tertiary_title: jobtitle }));
  } else {
    toast.error('You can only add up to 3 job titles.');
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

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.primary_title) {
      newErrors.primary_title = 'Please add at least one job title';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
  if (pendingTitleToAdd) {
    const lower = pendingTitleToAdd.toLowerCase();
    const isValid = sortedJobTitles.some(title => title.toLowerCase() === lower);

    if (isValid) {
      addSkill(pendingTitleToAdd);
      setPendingTitleToAdd(null);
    } else {
      toast.error("Not a valid job title.");
      setPendingTitleToAdd(null);
    }
  }
}, [pendingTitleToAdd]);


  useEffect(() => {
    if (highlightedIndex !== -1 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedIndex]);



  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!accepted) {
      toast.error('Please accept the condition.');
      return;
    }

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('No token found in sessionStorage');
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
        toast.error('Failed to upload job titles:', errorData.issue)
      } else {
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

        <p className='flex font-semibold text-[#2c6472]'>STEP 7 OF 8</p>

        <h1 className='text-2xl font-semibold mt-7'>Your designation defines your position.</h1>

        <form className='ms-6' onSubmit={handleNext}>
          <div className='flex flex-col mt-5 mb-4'>
            <label className='mb-3 block font-medium text-lg'>
              Job Search Postions <span className='text-red-500 ms-1'>*</span>
            </label>
            <p className='text-base font-medium text-gray-500 mb-2'>
              Job Search titles you're interested in , Select upto 3 titles.
            </p>
          </div>

          <div className='relative flex mt-4 mb-1' ref={dropdownRef}>
            <input
              ref={inputRef}
              type='text'
              className={`w-[70%] h-[64px] px-4 py-3 border ${errors.primary_title ? 'border-red-500' : 'border-gray-300'} rounded-lg text-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2c6472]`}
              value={searchTerms.primary_title}
              onChange={(e) => handleSearchChange(e, 'primary_title')}
              onFocus={() => setShowDropdowns({ primary_title: true })}
              onKeyDown={(e) => {
                const inputValue = searchTerms.primary_title.trim();
                const currentList = getFilteredTitles(inputValue);

                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHighlightedIndex((prev) =>
                    prev < currentList.length - 1 ? prev + 1 : 0
                  );
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHighlightedIndex((prev) =>
                    prev > 0 ? prev - 1 : currentList.length - 1
                  );
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  const selectedTitle =
                    highlightedIndex >= 0
                      ? currentList[highlightedIndex]
                      : currentList[0];

                  if (!selectedTitle) {
                    toast.error("Job title not found.");
                    return;
                  }

                  setPendingTitleToAdd(selectedTitle);
                  setHighlightedIndex(-1);

                  setTimeout(() => {
                    inputRef.current?.blur();
                  }, 0);
                }
              }}


              placeholder='Search or select job title...'
            />


            {showDropdowns.primary_title && (
              <ul className='absolute z-10 w-[70%] max-h-48 overflow-y-auto mt-14 bg-white border border-gray-300 rounded shadow-md'>
                {filteredTitles.map((title, index) => (
                  <li
                    ref={(el) => (itemRefs.current[index] = el)}
                    onClick={() => handleSelect('primary_title', title)}
                    className={`px-4 py-2 cursor-pointer ${index === highlightedIndex
                      ? 'bg-[#2c6472] text-white'
                      : 'text-gray-500 hover:bg-[#2c6472] hover:text-white'
                      }`}
                  >
                    {title}
                  </li>
                ))}

                {getFilteredTitles(searchTerms.primary_title).length === 0 && (
                  <li className='px-4 py-2 text-gray-400'>No matching titles</li>
                )}
              </ul>
            )}

            {/* <button
              type='button'
              onClick={addSkill}
              disabled={selectedTitles.length >= 3}
              className='w-24 mt-2 ms-5 px-2 py-2 border-2 border-[#2c6472] text-[#2c6472] h-[44px] text-sm font-medium bg-white hover:scale-95 transition-transform ease-linear duration-200 ml-2'
            >
              + Add 
            </button> */}
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

          <div className="flex gap-3 mt-5 items-start">
            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 mt-0.5 accent-[#2c6472]"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span className="text-sm text-red-500">
                Please enter your job title accurately. This cannot be changed once saved.
              </span>
            </label>
          </div>


          <div className='flex w-[70%] justify-end items-center gap-4 mt-8 mb-10'>
            <button
              type='submit'
              disabled={loading}
              className={`teal-button px-6 py-2 h-[40px] rounded-xl focus:outline-none transition-transform duration-200 ease-in-out
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

      {showSavePopup && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 bg-white border-b-4 border-[#2C6472] text-black rounded-md shadow-lg transform transition-all duration-500 ease-in-out animate-toast-in`}>
          <div className="relative px-3 py-1">
            <span>✅ Jobtitles saved successfully!</span>
            <div className="absolute bottom-0 left-0 h-[3px] bg-white animate-progress w-full" />
          </div>
        </div>
      )}

      {/* Footer appears after scrolling all content */}
      <div className="flex justify-start gap-2 text-[#2c6472] font-medium text-sm mt-8">
        <img src={warning} className="w-5 ms-5 h-5 object-cover" alt="" />
        AI is not perfect. Make sure your data is accurate before saving.            </div>
    </div>
  );
};

export default JobTitles;
