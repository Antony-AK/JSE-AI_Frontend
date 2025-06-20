import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import right_arrow from '../../assets/left-arrow.png'
import { BASE_URL } from '../../utils/api';

const Certificates = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        certificate_name: '',
        platform: '',
        start_date: '',
        end_date: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.certificate_name.trim()) {
            newErrors.certificate_name = 'Certificate name is required';
        }
        if (!formData.start_date.trim()) {
            newErrors.start_date = 'Start date is required';
        }
        if (!formData.end_date.trim()) {
            newErrors.end_date = 'End date is required';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return false;
        }

        return true;
    };    // same here




    const handleAddCertificate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const token = sessionStorage.getItem('authToken');
        if (!token) {
            alert("You are not authenticated. Please login.");
            return;
        }


        const formatToISOWithoutMs = (dateStr) => {
            const date = new Date(dateStr);
            return date.toISOString().split('.')[0] + "Z";
        };

        const isoStart = formatToISOWithoutMs(formData.start_date); // ✅ No .000
        const isoEnd = formatToISOWithoutMs(formData.end_date);     // ✅ No .000


        setLoading(true);
        try {
            const payload = {
                certificate_name: formData.certificate_name,
                platform: formData.platform,
                start_date: isoStart,
                end_date: isoEnd,
            };



            const response = await fetch(`${BASE_URL}/certificates`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // ✅ No need to set Content-Type for FormData
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Upload failed");
            }

            alert(`✅ Certificates uploaded successfully`);

            setFormData({
                certificate_name: '',
                platform: '',
                start_date: '',
                end_date: '',
            });

        } catch (error) {
            console.error("Error uploading certificate:", error);
            alert("Failed to upload certificate. \n\n" + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const token = sessionStorage.getItem('authToken');
        if (!token) {
            alert("You are not authenticated. Please login.");
            return;
        }


        const formatToISOWithoutMs = (dateStr) => {
            const date = new Date(dateStr);
            return date.toISOString().split('.')[0] + "Z";
        };

        const isoStart = formatToISOWithoutMs(formData.start_date); // ✅ No .000
        const isoEnd = formatToISOWithoutMs(formData.end_date);     // ✅ No .000


        setLoading(true);
        try {
            const payload = {
                certificate_name: formData.certificate_name,
                platform: formData.platform,
                start_date: isoStart,
                end_date: isoEnd,
            };



            const response = await fetch(`${BASE_URL}/certificates`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // ✅ No need to set Content-Type for FormData
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Upload failed");
            }

            alert(`✅ Certificates uploaded successfully`);

            setFormData({
                certificate_name: '',
                platform: '',
                start_date: '',
                end_date: '',
            });
            navigate("/user/onboarding/jobtitles");  // Only navigate, no data posting here

        } catch (error) {
            console.error("Error uploading certificate:", error);
            alert("Failed to upload certificate. \n\n" + error.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className='w-full  p-5 ml-5  text-black'>
            <div className="flex flex-col">
                <div className="flex items-center mb-5 cursor-pointer">
                    <img src={right_arrow} className='w-2.5 h-3.5 object-cover' alt="" />
                    <p className='ml-2 text-lg font-medium' onClick={() => navigate(-1)}>Back</p>
                </div>

                <div>
                    <p className=' flex font-semibold text-[#2c6472]'>STEP 5 OF 8</p>
                </div>

                <div>
                    <h1 className='text-2xl font-semibold mt-7'>List your certificates / Awards.</h1>
                </div>

                <form className="flex flex-col mt-5 ms-6" onSubmit={handleAddCertificate}>
                    <div className="relative ">
                        <label className="mb-3 block font-medium text-lg ">
                            Certificate /Award Name <span className='text-red-500 ms-1'>*</span>
                        </label>
                        <input
                            id='certificate_name'
                            type="text"
                            name="certificate_name" // Fixed name attribute
                            placeholder=" "
                            value={formData.certificate_name}
                            onChange={handleChange}

                            className={`w-[70%] h-14 flex mb-1 px-4 py-6 border text-lg shadow-sm rounded-lg focus:outline-none focus:ring-1 
                          ${errors.certificate_name ? 'border-red-500 animate-shake' : 'border-gray-300 focus:ring-[#2c6472]'}`}
                        />
                        {errors.certificate_name && (
                            <span className="text-red-500 text-sm mt-1">{errors.certificate_name}</span>
                        )}
                    </div><br />

                    <div className="relative">
                        <label className="mb-3 block font-medium text-lg ">
                            Platform
                        </label>
                        <input
                            id='platform'
                            type="text"
                            name="platform" // Fixed name attribute
                            placeholder=" "
                            value={formData.platform}
                            onChange={handleChange}

                            className="w-[70%] h-14 flex mb-1 px-4 py-6 border text-lg shadow-sm rounded-lg focus:outline-none focus:ring-1 border-gray-300 focus:ring-[#2c6472]"
                        />

                    </div><br />

                    <div className="flex -space-x-24">

                        <div className="relative w-[47%] mb-2">
                            <label className="mb-3 block font-medium text-lg ">
                                Start Date <span className='text-red-500 ms-1'>*</span>
                            </label>
                            <input
                                id='start_date'
                                type="date"
                                name="start_date" // Fixed name attribute
                                placeholder=" "
                                value={formData.start_date}
                                onChange={handleChange}

                                className={`w-[70%] h-14 flex mb-1 px-4 py-6 border text-lg shadow-sm rounded-lg focus:outline-none focus:ring-1 
                             ${errors.start_date ? 'border-red-500 animate-shake' : 'border-gray-300 focus:ring-[#2c6472]'}`}
                            />
                            {errors.start_date && (
                                <span className="text-red-500 text-sm mt-1">{errors.start_date}</span>
                            )}
                        </div>

                        <div className="relative w-[47%] mb-2">
                            <label className="mb-3 block font-medium text-lg ">
                                End Date <span className='text-red-500 ms-1'>*</span>
                            </label>
                            <input
                                id='end_date'
                                type="date"
                                name="end_date" // Fixed name attribute
                                placeholder=" "
                                value={formData.end_date}
                                onChange={handleChange}

                                className={`w-[70%] h-14 flex mb-1 px-4 py-6 border text-lg shadow-sm rounded-lg focus:outline-none focus:ring-1 
                              ${errors.end_date ? 'border-red-500 animate-shake' : 'border-gray-300 focus:ring-[#2c6472]'}`}
                            />
                            {errors.end_date && (
                                <span className="text-red-500 text-sm mt-1">{errors.end_date}</span>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex w-[70%]  justify-between items-center gap-4 mt-4">
                        <button
                            type="submit"
                            className=" py-2 w-[180px] bg-white text-[#2c6472]  h-[43px]  font-semibold cursor-pointer mt-1 hover:scale-95 transition-transform duration-200 ease-in-out"
                        >
                            +Add Certificates
                        </button>

                        <button
                            type="button"
                            className=" teal-button px-6 py-2 bg-[#2c6472] text-white w-[100px] h-[41px]  rounded-xl focus:outline-none transition-transform duration-200 ease-in-out"
                            onClick={handleNext}
                        >
                            {loading ? 'Saving...' : 'Next'}
                        </button>
                    </div>

                </form>


            </div>
        </div>
    )
}

export default Certificates
