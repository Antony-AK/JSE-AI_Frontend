import React, { useState } from 'react'

const PersonalInfo = () => {

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    linkedIn: '',
    country: '',
    state: '',
    city: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fname.trim()) newErrors.fname = "First name is required";
    if (!formData.lname.trim()) newErrors.lname = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.linkedIn.trim()) newErrors.linkedIn = "LinkedIn is required";

    return newErrors;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Api key send data
      console.log("Form submitted", formData);
    }
  };


  return (
    <div className='p-10 pt-14 flex flex-col gap-5 w-[100%] h-screen overflow-y-auto'>

      <p className='text-[#2c6472] font-semibold'>STEP 1 OF 8</p>

      <h2 className='font-bold text-xl'>Let's start with your personal information.</h2>

      <form onSubmit={handleSubmit} className="p-5 pt-2 flex flex-col gap-5 w-[90%]">

        {/* Name */}
        <div className="flex justify-start gap-10 text-lg w-full">
          <div className="flex flex-col gap-2 w-[50%]">
            <label className='font-medium' htmlFor="fname">First Name <span className='text-red-500'>*</span></label>
            <input 
              className={`px-5 py-3 rounded-lg border ${ errors.fname ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]' } outline-none focus:border-[#2c6472]`}
              value={formData.fname} 
              onChange={handleChange} 
              type="text" 
              id='fname'
            />
            {errors.fname && <span className="text-red-500 text-sm">{errors.fname}</span>}
          </div>
          <div className="flex flex-col gap-2 w-[50%]">
            <label className='font-medium' htmlFor="lname">Last Name <span className='text-red-500'>*</span></label>
            <input
              className={`px-5 py-3 rounded-lg border ${ errors.lname ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]' } outline-none focus:border-[#2c6472]` }
              value={formData.lname}
              onChange={handleChange} 
              type="text" 
              id='lname'
            />
            {errors.lname && <span className="text-red-500 text-sm">{errors.lname}</span>}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="email">Email Address <span className='text-red-500'>*</span></label>
          <input 
            className={`px-5 py-3 rounded-lg border ${ errors.email ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]' } outline-none focus:border-[#2c6472]`}
            value={formData.email}
            onChange={handleChange} 
            type="email" 
            id='email'
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="phone">Phone Number <span className='text-red-500'>*</span></label>
          <input
            className={`px-5 py-3 rounded-lg border ${ errors.phone ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]' } outline-none focus:border-[#2c6472]`} 
            value={formData.phone}
            onChange={handleChange}
            type="phone"  
            id='phone'
          />
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}  
        </div>

        {/* Linked in */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="linkedIn">Linkedin Profile <span className='text-red-500'>*</span></label>
          <input 
            className={`px-5 py-3 rounded-lg border ${ errors.linkedIn ? 'border-red-500' : 'border-[rgba(0,0,0,0.14)]' } outline-none focus:border-[#2c6472]`} 
            value={formData.linkedIn}
            onChange={handleChange}
            type="text" 
            id='linkedIn'
          />
          {errors.linkedIn && <span className="text-red-500 text-sm">{errors.linkedIn}</span>}
        </div>   

        {/* Country */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="country">Country</label>
          <input className='px-5 py-3 rounded-lg border border-[rgba(0, 0, 0, 0.14)] outline-none focus:border-[#2c6472]' type="text" id='country'/>
        </div>    

        {/* State */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="state">State</label>
          <input className='px-5 py-3 rounded-lg border border-[rgba(0, 0, 0, 0.14)] outline-none focus:border-[#2c6472]' type="text" id='state'/>
        </div> 

        {/* City */}
        <div className="flex flex-col gap-2 text-lg">
          <label className='font-medium' htmlFor="city">City</label>
          <input className='px-5 py-3 rounded-lg border border-[rgba(0, 0, 0, 0.14)] outline-none focus:border-[#2c6472]' type="text" id='city'/>
        </div>    

        <div className="flex justify-end mt-7">
          <button type="submit" className='rounded-xl px-8 py-2 bg-[#2C6472] text-[#fff] mb-10'>Next</button>           
        </div>                      

      </form>

    </div>
  )
}

export default PersonalInfo