import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/api'
import right_arrow from '../../assets/left-arrow.png'

const Projects = () => {

  const navigate = useNavigate();

  const apiUrl = `${BASE_URL}/pastprojects`;

  const token = sessionStorage.getItem('authToken');  

  const [formData, setFormData] = useState({
    project_name: '',
    institution: '',
    start_date: '',
    end_date: '',
    currentdo: false,
    project_description: ''
  });    

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => {
      const updatedForm = {
        ...prev,
        [id]: type === 'checkbox' ? checked : value,
      };

      if (type === 'checkbox' && id === 'currentdo' && checked) {
        updatedForm.end_date = '';
      }

      return updatedForm;
    });

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      // Always clear error for the field being changed
      delete updatedErrors[id];

      // Additionally clear `end_date` error if checkbox is checked
      if (id === 'currentdo' && checked) {
        delete updatedErrors.end_date;
      }

      return updatedErrors;
    });
  };  

  const validate = () => {
    const newErrors = {};
    if (!formData.project_name.trim()) newErrors.project_name = 'Project name is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.currentdo && !formData.end_date) newErrors.end_date = 'End date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (navigateNext = false) => {
    if (validate()) {
      try {
        if (!token) {
          alert("No token found. Please log in.");
          return;
        }

        const toISOString = (date) => date ? new Date(date).toISOString() : null;

        const payload = {
          project_name: formData.project_name,
          institution: formData.institution,
          start_date: toISOString(formData.start_date),
          end_date: formData.currentdo ? null : toISOString(formData.end_date),
          currently_doing: formData.currentdo,
          project_description: formData.project_description,
        };

        const response = await axios.post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log("✅ Submitted:", response.data);
        alert("Project added successfully!");

        if (navigateNext) {
          navigate('/user/onboarding/languages'); // update the path accordingly
        } else {
          // Reset form
          setFormData({
            project_name: '',
            institution: '',
            start_date: '',
            end_date: '',
            currentdo: false,
            project_description: ''
          });
          setErrors({});
        }
      } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
        alert("Submission failed. Please try again.");
      }
    }
  };

  return (
    <div className='p-10 pt-2 flex flex-col gap-5 w-[100%] min-h-screen '>

        <div className="flex justify-between items-center w-[95%]">
            <div className="flex items-center cursor-pointer" onClick={() => navigate(-1)}>
                <img src={right_arrow} className='w-2.5 h-3.5 object-cover' alt="" />
                <p className='ml-2 text-lg font-medium'>Back</p>
            </div>

            <div className="flex items-center cursor-pointer" onClick={() => navigate('/user/onboarding/languages')}>
                <p className='ml-2 text-lg font-medium text-[#00000057]'>Skip</p>
            </div>
        </div>

        <p className='text-[#2c6472] font-semibold'>STEP 4 OF 8</p>

        <h2 className='font-bold text-xl'>Share your past project experience.</h2>

        <form onSubmit={handleSubmit} className="p-5 pt-2 flex flex-col gap-5 w-[80%]">

            {/* Project Name */}
            <div className="flex flex-col gap-2 text-lg">
                <label className='font-medium' htmlFor="project_name">Project Name <span className='text-red-500'>*</span></label>
                <input 
                    className={`px-5 py-3 rounded-lg border ${errors.project_name ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`} 
                    type="text" 
                    id='project_name'
                    value={formData.project_name}
                    onChange={handleChange}
                />
                {errors.project_name && <p className='text-red-500 text-sm'>{errors.project_name}</p>}
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-2 text-lg">
                <label className='font-medium' htmlFor="institution">University / Company Name</label>
                <input 
                    className={`px-5 py-3 rounded-lg border border-[rgba(0,0,0,0.14)] outline-none focus:border-[#2c6472]`} 
                    type="text" 
                    id='institution'
                    value={formData.institution}
                    onChange={handleChange}
                />
            </div>    

            {/* Start & End Date */}
            <div className="flex justify-start gap-10 text-lg w-full">
                <div className="flex flex-col gap-2 w-[50%]">
                    <label className='font-medium' htmlFor="start_date">Start Date <span className='text-red-500'>*</span></label>
                    <input 
                    className={`px-5 py-3 rounded-lg border ${errors.start_date ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                    type="date" 
                    id='start_date'
                    value={formData.start_date}
                    onChange={handleChange}
                    />
                    {errors.start_date && <p className='text-red-500 text-sm'>{errors.start_date}</p>}
                </div>
                <div className="flex flex-col gap-2 w-[50%]">
                    <label className='font-medium' htmlFor="end_date">End Date {!formData.currentdo && <span className='text-red-500'>*</span>}</label>
                    <input
                    className={`px-5 py-3 rounded-lg border ${errors.end_date ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                    type="date" 
                    id='end_date'
                    value={formData.end_date}
                    onChange={handleChange}
                    disabled={formData.currentdo}
                    />
                    {errors.end_date && <p className='text-red-500 text-sm'>{errors.end_date}</p>}
                </div>
            </div>

            {/* currently doing */}
            <div className="flex items-center gap-5">
                <input 
                className='w-5 h-5 accent-[#2c6472] rounded-xl' 
                id='currentdo' 
                type="checkbox" 
                checked={formData.currentdo}
                onChange={handleChange}
                />
                <label className='font-medium text-lg' htmlFor="currentdo">I currently doing</label>
            </div>

            {/* Project Description */}
            <div className="flex flex-col gap-2 text-lg">
                <label className="font-medium" htmlFor="project_description">Project Description</label>
                <textarea
                    id="project_description"
                    className="px-5 py-3 rounded-lg border border-[rgba(0,0,0,0.14)] outline-none focus:border-[#2c6472] resize-none"
                    rows={4}
                    value={formData.project_description}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="flex justify-between mt-7">
                <div className="cursor-pointer" onClick={() => handleSubmit(false)}>
                    <p className='text-lg text-[#2C6472] font-semibold'>+ Add Project</p>
                </div>
                <button type="button" onClick={() => handleSubmit(true)} className='rounded-xl px-8 py-2 bg-[#2C6472] text-[#fff] mb-10'>Next</button>           
            </div>                     

        </form>

    </div>
  )
}

export default Projects