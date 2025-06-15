import React, { useState } from 'react'
import right_arrow from '../../assets/left-arrow.png'

const Education = () => {

  const [formData, setFormData] = useState({
    institution: '',
    city: '',
    degree: '',
    field: '',
    startdate: '',
    enddate: '',
    currentstudy: false,
    adddescription: ''
  });
  
  const [errors, setErrors] = useState({}); 
  
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === 'checkbox') {
        setFormData((prev) => ({
        ...prev,
        [id]: checked,
        enddate: id === 'currentstudy' && checked ? '' : prev.enddate,
        }));
    } else {
        setFormData({
        ...formData,
        [id]: value,
        });
    }
    };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.institution.trim()) newErrors.institution = "Institution is required";
    if (!formData.city.trim()) newErrors.city = "City / Country is required";
    if (!formData.degree.trim()) newErrors.degree = "Degree is required";
    if (!formData.field.trim()) newErrors.field = "Field of Study is required";
    if (!formData.startdate) newErrors.startdate = "Start Date is required";

    // Only validate end date if not currently studying
    if (!formData.currentstudy && !formData.enddate) {
      newErrors.enddate = "End Date is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted:", formData);
      // continue with next step or API call
    }
  };  

  return (
    <div className='p-10 pt-2 flex flex-col gap-5 w-[100%] h-screen overflow-y-auto'>

        <div className="flex justify-between items-center w-[95%]">
            <div className="flex items-center cursor-pointer">
                <img src={right_arrow} className='w-2.5 h-3.5 object-cover' alt="" />
                <p className='ml-2 text-lg font-medium'>Back</p>
            </div>
        </div>

        <p className='text-[#2c6472] font-semibold'>STEP 3 OF 8</p>

        <h2 className='font-bold text-xl'>Add your academic story.</h2>  

        <form onSubmit={handleSubmit} className="p-5 pt-2 flex flex-col gap-5 w-[90%]">

            {/* Institution */}
            <div className="flex flex-col gap-2 text-lg">
                <label className='font-medium' htmlFor="institution">School, University or Institution <span className='text-red-500'>*</span></label>
                <input 
                    className={`px-5 py-3 rounded-lg border ${errors.institution ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`} 
                    type="text" 
                    id='institution'
                    value={formData.institution}
                    onChange={handleChange}
                />
                {errors.institution && <span className="text-red-500 text-sm">{errors.institution}</span>}
            </div>

            {/* City */}
            <div className="flex flex-col gap-2 text-lg">
                <label className='font-medium' htmlFor="city">City / Country <span className='text-red-500'>*</span></label>
                <input 
                    className={`px-5 py-3 rounded-lg border ${errors.city ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`} 
                    type="text" 
                    id='city'
                    value={formData.city}
                    onChange={handleChange}
                />
                {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
            </div>   

            {/* Degree */}
            <div className="flex flex-col gap-2 text-lg">
                <label className='font-medium' htmlFor="degree">Degree, Qualification, or Major <span className='text-red-500'>*</span></label>
                <input 
                    className={`px-5 py-3 rounded-lg border ${errors.degree ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`} 
                    type="text" 
                    id='degree'
                    value={formData.degree}
                    onChange={handleChange}
                />
                {errors.degree && <span className="text-red-500 text-sm">{errors.degree}</span>}
            </div>   

            {/* Field */}
            <div className="flex flex-col gap-2 text-lg">
                <label className='font-medium' htmlFor="field">Field of Study <span className='text-red-500'>*</span></label>
                <input 
                    className={`px-5 py-3 rounded-lg border ${errors.field ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`} 
                    type="text" 
                    id='field'
                    value={formData.field}
                    onChange={handleChange}
                />
                {errors.field && <span className="text-red-500 text-sm">{errors.field}</span>}
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
                    {errors.startdate && <span className="text-red-500 text-sm">{errors.startdate}</span>}
                </div>
                <div className="flex flex-col gap-2 w-[50%]">
                    <label className='font-medium' htmlFor="enddate">End Date {!formData.currentstudy && <span className='text-red-500'>*</span>}</label>
                    <input
                    className={`px-5 py-3 rounded-lg border ${errors.enddate ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                    type="date" 
                    id='enddate'
                    value={formData.enddate}
                    onChange={handleChange}
                    disabled={formData.currentstudy}
                    />
                    {errors.enddate && <span className="text-red-500 text-sm">{errors.enddate}</span>}
                </div>
            </div>     

            {/* currently Studies */}
            <div className="flex items-center gap-5">
                <input 
                className='w-5 h-5 accent-[#2c6472] rounded-xl' 
                id='currentstudy' 
                type="checkbox" 
                checked={formData.currentstudy}
                onChange={handleChange}
                />
                <label className='font-medium text-lg' htmlFor="currentstudy">I currently study here</label>
            </div>    

            {/* Additional Description */}
            <div className="flex flex-col gap-2 text-lg">
                <label className="font-medium" htmlFor="adddescription">Additional Description <span className='text-[#0000009c]'>(Optional)</span></label>
                <textarea
                    id="adddescription"
                    className="px-5 py-3 rounded-lg border border-[rgba(0,0,0,0.14)] outline-none focus:border-[#2c6472] resize-none"
                    rows={4}
                    value={formData.adddescription}
                    onChange={handleChange}
                ></textarea>
            </div>          

            <div className="flex justify-between mt-7">
                <div className="cursor-pointer">
                    <p className='text-lg text-[#2C6472] font-semibold'>+ Add Education</p>
                </div>
                <button type="submit" className='rounded-xl px-8 py-2 bg-[#2C6472] text-[#fff] mb-10'>Next</button>           
            </div>                               

        </form>      

    </div>
  )
}

export default Education