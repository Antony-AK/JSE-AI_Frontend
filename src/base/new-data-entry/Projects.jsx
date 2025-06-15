import React, { useState } from 'react'
import right_arrow from '../../assets/left-arrow.png'

const Projects = () => {

  const [formData, setFormData] = useState({
    project: '',
    company: '',
    startdate: '',
    enddate: '',
    currentdo: false,
    projectdescription: ''
  });    

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
        enddate: id === 'currentdo' && checked ? '' : prev.enddate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value
      }));
    }
  };
  

  const validate = () => {
    const newErrors = {};
    if (!formData.project.trim()) newErrors.project = 'Project name is required';
    if (!formData.startdate) newErrors.startdate = 'Start date is required';
    if (!formData.currentdo && !formData.enddate) newErrors.enddate = 'End date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form Submitted:', formData);
      // Proceed to next step
    }
  };  

  return (
    <div className='p-10 pt-2 flex flex-col gap-5 w-[100%] h-screen overflow-y-auto'>

        <div className="flex justify-between items-center w-[95%]">
            <div className="flex items-center cursor-pointer">
                <img src={right_arrow} className='w-2.5 h-3.5 object-cover' alt="" />
                <p className='ml-2 text-lg font-medium'>Back</p>
            </div>

            <div className="flex items-center cursor-pointer">
                <p className='ml-2 text-lg font-medium text-[#00000057]'>Skip</p>
            </div>
        </div>

        <p className='text-[#2c6472] font-semibold'>STEP 4 OF 8</p>

        <h2 className='font-bold text-xl'>Share your past project experience.</h2>

        <form onSubmit={handleSubmit} className="p-5 pt-2 flex flex-col gap-5 w-[90%]">

            {/* Project Name */}
            <div className="flex flex-col gap-2 text-lg">
                <label className='font-medium' htmlFor="project">Project Name <span className='text-red-500'>*</span></label>
                <input 
                    className={`px-5 py-3 rounded-lg border ${errors.project ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`} 
                    type="text" 
                    id='project'
                    value={formData.project}
                    onChange={handleChange}
                />
                {errors.project && <p className='text-red-500 text-sm'>{errors.project}</p>}
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-2 text-lg">
                <label className='font-medium' htmlFor="company">University / Company Name</label>
                <input 
                    className={`px-5 py-3 rounded-lg border border-[rgba(0,0,0,0.14)] outline-none focus:border-[#2c6472]`} 
                    type="text" 
                    id='company'
                    value={formData.company}
                    onChange={handleChange}
                />
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
                    <label className='font-medium' htmlFor="enddate">End Date {!formData.currentdo && <span className='text-red-500'>*</span>}</label>
                    <input
                    className={`px-5 py-3 rounded-lg border ${errors.enddate ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                    type="date" 
                    id='enddate'
                    value={formData.enddate}
                    onChange={handleChange}
                    disabled={formData.currentdo}
                    />
                    {errors.enddate && <p className='text-red-500 text-sm'>{errors.enddate}</p>}
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
                <label className="font-medium" htmlFor="projectdescription">Project Description</label>
                <textarea
                    id="projectdescription"
                    className="px-5 py-3 rounded-lg border border-[rgba(0,0,0,0.14)] outline-none focus:border-[#2c6472] resize-none"
                    rows={4}
                    value={formData.projectdescription}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="flex justify-between mt-7">
                <div className="cursor-pointer">
                    <p className='text-lg text-[#2C6472] font-semibold'>+ Add Project</p>
                </div>
                <button type="submit" className='rounded-xl px-8 py-2 bg-[#2C6472] text-[#fff] mb-10'>Next</button>           
            </div>                     

        </form>

    </div>
  )
}

export default Projects