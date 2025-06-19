import React, { useState } from 'react'
import right_arrow from '../../assets/left-arrow.png'

const WorkExperience = () => {

  const [formData, setFormData] = useState({
    role: '',
    company: '',
    location: '',
    startdate: '',
    enddate: '',
    currentwork: false,
    workdescription: ''
  });

  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };
  
  const validate = () => {
    const newErrors = {};

    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.startdate) newErrors.startdate = 'Start date is required';
    if (!formData.currentwork && !formData.enddate) {
      newErrors.enddate = 'End date is required if not currently working';
    }

    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted successfully', formData);
      // Proceed to next step or API call
    }
  };  

  return (
    <div className='p-10 pt-2 flex flex-col gap-5 w-[100%] min-h-screen overflow-y-auto'>
        <div className="flex justify-between items-center w-[95%]">
            <div className="flex items-center cursor-pointer">
                <img src={right_arrow} className='w-2.5 h-3.5 object-cover' alt="" />
                <p className='ml-2 text-lg font-medium'>Back</p>
            </div>

            <div className="flex items-center cursor-pointer">
                <p className='ml-2 text-lg font-medium text-[#00000057]'>Skip</p>
            </div>
        </div>

        <p className='text-[#2c6472] font-semibold'>STEP 2 OF 8</p>

        <h2 className='font-bold text-xl'>Highlight your Work Experience.</h2>

        <form onSubmit={handleSubmit} className="p-5 pt-2 flex flex-col gap-5 w-[80%]">

            {/* Role */}
            <div className="flex flex-col gap-2 text-lg">
                <label className='font-medium' htmlFor="role">Role <span className='text-red-500'>*</span></label>
                <input 
                    className={`px-5 py-3 rounded-lg border ${errors.role ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`} 
                    type="text" 
                    id='role'
                    value={formData.role}
                    onChange={handleChange}
                />
                {errors.role && <p className='text-red-500 text-sm'>{errors.role}</p>}
            </div>

            {/* Company & Location */}
            <div className="flex justify-start gap-10 text-lg w-full">
                <div className="flex flex-col gap-2 w-[50%]">
                    <label className='font-medium' htmlFor="company">Company <span className='text-red-500'>*</span></label>
                    <input 
                    className={`px-5 py-3 rounded-lg border ${errors.company ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                    type="text" 
                    id='company'
                    value={formData.company}
                    onChange={handleChange}
                    />
                    {errors.company && <p className='text-red-500 text-sm'>{errors.company}</p>}
                </div>
                <div className="flex flex-col gap-2 w-[50%]">
                    <label className='font-medium' htmlFor="location">Location <span className='text-red-500'>*</span></label>
                    <input
                    className={`px-5 py-3 rounded-lg border ${errors.location ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
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
                    <label className='font-medium' htmlFor="startdate">Start Date <span className='text-red-500'>*</span></label>
                    <input 
                    className={`px-5 py-3 rounded-lg border ${errors.startdate ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                    type="date" 
                    id='startdate'
                    value={formData.startdate}
                    onChange={handleChange}
                    />
                    {errors.startdate && <p className='text-red-500 text-sm'>{errors.startdate}</p>}
                </div>
                <div className="flex flex-col gap-2 w-[50%]">
                    <label className='font-medium' htmlFor="enddate">End Date {!formData.currentwork && <span className='text-red-500'>*</span>}</label>
                    <input
                    className={`px-5 py-3 rounded-lg border ${errors.enddate ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
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
                <label className="font-medium" htmlFor="workdescription">Work Description</label>
                <textarea
                    id="workdescription"
                    className="px-5 py-3 rounded-lg border border-[rgba(0,0,0,0.14)] outline-none focus:border-[#2c6472] resize-none"
                    rows={4}
                    value={formData.workdescription}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="flex justify-between mt-7">
                <div className="cursor-pointer">
                    <p className='text-lg text-[#2C6472] font-semibold'>+ Add Work Experience</p>
                </div>
                <button type="submit" className='rounded-xl px-8 py-2 bg-[#2C6472] text-[#fff] mb-10'>Next</button>           
            </div>           

        </form>        

    </div>
  )
}

export default WorkExperience