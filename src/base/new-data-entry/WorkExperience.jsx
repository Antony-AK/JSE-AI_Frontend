import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { data, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/api'
import right_arrow from '../../assets/left-arrow.png'
import Calendar from '../Calender/Calender';
import { format } from 'date-fns';


const WorkExperience = () => {

  const navigate = useNavigate();

  const apiUrl = `${BASE_URL}/work-experience`;

  const token = sessionStorage.getItem('authToken');

  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    location: '',
    start_date: '',
    enddate: '',
    currentwork: false,
    key_responsibilities: ''
  });

  const [errors, setErrors] = useState({});
  // const [showSavePopup, setShowSavePopup] = useState(false);
  const [addedCompanies, setAddedCompanies] = useState([]);



  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      let updatedFormData = {
        ...prev,
        [id]: newValue,
      };

      // Special case: If 'currentwork' is checked, clear 'enddate'
      if (id === 'currentwork' && checked) {
        updatedFormData.enddate = '';
      }

      return updatedFormData;
    });

    // Clear the error for the specific field when the user starts typing
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (newValue && updatedErrors[id]) {
        delete updatedErrors[id];
      }

      // Also clear enddate error if 'currentwork' is checked
      if (id === 'currentwork' && checked) {
        delete updatedErrors['enddate'];
      }

      return updatedErrors;
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.job_title.trim()) newErrors.job_title = 'Role is required';
    if (!formData.company_name.trim()) newErrors.company_name = 'Company is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.currentwork && !formData.enddate) {
      newErrors.enddate = 'End date is required if not currently working';
    }

    const start = formData.start_date ? new Date(formData.start_date) : null;
    const end = new Date(formData.enddate);
    const today = new Date();

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required.";
    }

    if (!formData.currentwork) {
      if (!formData.enddate) {
        newErrors.enddate = "End date is required.";
      } else if (start > end) {
        newErrors.enddate = "End date cannot be before start date.";
      }
    } else {
      // If currently working, ensure start date is not in the future
      if (start > today) {
        newErrors.start_date = "Start date cannot be after current date";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (navigateNext = false) => {
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        if (!token) {
          navigate('/user/login');
          toast.error("User not found. Please log in.");
          return;
        }

        const toISOString = (date) => date ? new Date(date).toISOString() : null;

        const payload = {
          job_title: formData.job_title,
          company_name: formData.company_name,
          location: formData.location,
          start_date: toISOString(formData.start_date),
          end_date: formData.currentwork ? null : toISOString(formData.enddate),
          currently_working: formData.currentwork,
          key_responsibilities: formData.key_responsibilities,
        };

        const response = await axios.post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (navigateNext) {
          navigate('/user/onboarding/education');
          window.scrollTo({ top: 0, behavior: 'auto' });

        } else {

          setAddedCompanies((prev) => [...prev, formData.company_name]);

          // Clear form after add
          setFormData({
            job_title: '',
            company_name: '',
            location: '',
            start_date: '',
            enddate: '',
            currentwork: false,
            key_responsibilities: ''
          });
          window.scrollTo({ top: 0, behavior: 'auto' });

          setErrors({});
        }

      } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
        toast.error(error.response?.data.issue || "Submission failed. Please try again.");
      }
    }
  };

  return (
    <div className='p-10 pt-2 flex flex-col gap-5 w-[100%] min-h-screen overflow-y-auto'>
      <div
        className="flex items-center justify-end w-[95%] mt-2"
      >
        <div
          className="cursor-pointer px-4 py-2 rounded transition"
          onClick={() => navigate('/user/onboarding/education')}
        >
          <p className="text-lg font-medium text-[#00000057]">Skip</p>
        </div>
      </div>


      <p className='text-[#2c6472] font-semibold -mt-10'>STEP 2 OF 8</p>

      <h2 className='font-bold text-xl'>Highlight your Work Experience.</h2>

      {addedCompanies.length > 0 && (
        <div className=" px-6 py-4 -m-3 w-[90%] flex gap-3 rounded-lg overflow-x-auto hide-scrollbar">
          <ul className="flex gap-3 ">
            {addedCompanies.map((company, index) => (
              <li className='bg-gray-500/30 px-4 py-2 rounded-lg h-10 text-center flex items-center justify-center font-semibold text-[#2c6472] whitespace-nowrap flex-shrink-0' key={index}>{company}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="p-5 pt-2 flex flex-col gap-5 w-[80%]">

        {/* Role */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="job_title">Role <span className='text-red-500'>*</span></label>
          <input
            className={`px-5 py-3 rounded-lg border ${errors.job_title ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
            type="text"
            id='job_title'
            value={formData.job_title}
            onChange={handleChange}
          />
          {errors.job_title && <p className='text-red-500 text-sm'>{errors.job_title}</p>}
        </div>

        {/* company_name & Location */}
        <div className="flex justify-start gap-10 text-lg w-full">
          <div className="flex flex-col gap-2 w-[50%]">
            <label className='font-medium' htmlFor="company_name">Company <span className='text-red-500'>*</span></label>
            <input
              className={`px-5 py-3 rounded-lg border ${errors.company_name ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
              type="text"
              id='company_name'
              value={formData.company_name}
              onChange={handleChange}
            />
            {errors.company_name && <p className='text-red-500 text-sm'>{errors.company_name}</p>}
          </div>
          <div className="flex flex-col gap-2 w-[50%]">
            <label className='font-medium' htmlFor="location">Location <span className='text-red-500'>*</span></label>
            <input
              className={`px-5 py-3 rounded-lg border ${errors.location ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
              type="text"
              id='location'
              value={formData.location}
              onChange={handleChange}
            />
            {errors.location && <p className='text-red-500 text-sm'>{errors.location}</p>}
          </div>
        </div>

        {/* Start & End Date */}
        <div className="flex justify-start gap-10 text-lg w-full">
          <div className="flex flex-col gap-2 w-[50%]">
            <p className="font-medium">
              Start Date <span className="text-red-500">*</span>
            </p>
            <Calendar
              selectedDate={formData.start_date ? new Date(formData.start_date) : null}
              onDateChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  start_date: format(date, 'yyyy-MM-dd'),
                }))
              }
            />
            {errors.start_date && (
              <p className="text-red-500 text-sm">{errors.start_date}</p>
            )}
          </div>


          <div className="flex flex-col gap-2 w-[50%]">
            <label className='font-medium' htmlFor="enddate">End Date {!formData.currentwork && <span className='text-red-500'>*</span>}</label>
            <input
              className={`px-5 py-3 rounded-lg border ${errors.enddate ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
              type="date"
              id='enddate'
              value={formData.enddate}
              onChange={handleChange}
              disabled={formData.currentwork}
            />
            {errors.enddate && <p className='text-red-500 text-sm'>{errors.enddate}</p>}
          </div>
        </div>

        {/* currently working */}
        <div className="flex items-center gap-5">
          <input
            className='w-5 h-5 accent-[#2c6472] rounded-xl'
            id='currentwork'
            type="checkbox"
            checked={formData.currentwork}
            onChange={handleChange}
          />
          <label className='font-medium text-lg' htmlFor="currentwork">I currently work here</label>
        </div>

        {/* Work Description */}
        <div className="flex flex-col gap-2 text-lg">
          <label className="font-medium" htmlFor="key_responsibilities">Work Description <span className='text-[#0000009c]'>(Optional)</span></label>
          <textarea
            id="key_responsibilities"
            className="px-5 py-3 rounded-lg border border-[rgba(0,0,0,0.14)] outline-none focus:border-[#2c6472] resize-none"
            rows={4}
            value={formData.key_responsibilities}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="flex justify-between mt-7">
          <div className="cursor-pointer" onClick={() => handleSubmit(false)}>
            <p className='text-lg text-[#2C6472] font-semibold'>+ Add Another</p>
          </div>
          <button type="button" onClick={() => handleSubmit(true)} className='rounded-xl px-6 py-2 bg-[#2C6472] text-[#fff] mb-10'>Save & Next</button>
        </div>

      </form>

      {/* {showSavePopup && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 bg-white border-b-4 border-[#2C6472] text-black rounded-md shadow-lg transform transition-all duration-500 ease-in-out animate-toast-in`}>
          <div className="relative px-3 py-1">
            <span>✅ WorkExperience saved successfully!</span>
            <div className="absolute bottom-0 left-0 h-[3px] bg-white animate-progress w-full" />
          </div>
        </div>
      )} */}

    </div>
  )
}

export default WorkExperience