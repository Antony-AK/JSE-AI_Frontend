import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import right_arrow from '../../assets/left-arrow.png'
import { jobskills } from '../../assets/data';

const JobTitles = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dropdownRefs = {
        primary_title: useRef(null),
    };

    // const sortedJobTitles = [...jobskills.map((j) => j.jobTitle)].sort();
    const sortedJobTitles = Object.keys(jobskills).sort();



    const [formData, setFormData] = useState({
        job_titles: [],
    });


    const [searchTerms, setSearchTerms] = useState({
        primary_title: '',
    });

    const [showDropdowns, setShowDropdowns] = useState({
        primary_title: false,
    });

    const [errors, setErrors] = useState({});

    const addSkill = () => {
        const jobtitle = searchTerms.primary_title.trim();
        if (!jobtitle) return;

        const isDuplicate = formData.job_titles.some(
            (title) => title.toLowerCase() === jobtitle.toLowerCase()
        );

        if (isDuplicate) {
            alert("This job title is already added!");
            return;
        }

        if (formData.job_titles.length >= 3) {
            alert("You can only add up to 3 job titles.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            job_titles: [...prev.job_titles, jobtitle],
        }));

        setSearchTerms({ primary_title: '' });
    };


    const removeSkill = (index) => {
        setFormData((prev) => ({
            ...prev,
            job_titles: prev.job_titles.filter((_, i) => i !== index),
        }));
    };


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
        if (formData.job_titles.length === 0) {
            newErrors.primary_title = 'Please add at least one job title';
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
                body: JSON.stringify({ primary_title: formData.job_titles }),
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
        <div className='w-full min-h-screen p-5 ml-5  text-black'>
            <div className="flex flex-col">
                <div className="flex items-center mb-5 cursor-pointer">
                    <img src={right_arrow} className='w-2.5 h-3.5 object-cover' alt="" />
                    <p className='ml-2 text-lg font-medium'  onClick={() => navigate(-1)}>Back</p>
                </div>

                <div>
                    <p className=' flex font-semibold text-[#2c6472]'>STEP 5 OF 8</p>
                </div>

                <div>
                    <h1 className='text-2xl font-semibold mt-7'>Your designation defines your position.</h1>
                </div>

                <form className='ms-6' onSubmit={handleNext}>
                    <div className="flex flex-col mt-5 mb-4">
                        <label className="mb-3 block font-medium text-lg ">
                            Positions <span className='text-red-500 ms-1'>*</span>
                        </label>
                        <p className='text-base font-medium text-gray-500'>Job titles you're interested in.<br />
                            Maximum of 3.</p>
                    </div>

                    <div className="relative flex   mt-4 mb-1" ref={dropdownRefs.primary_title}>
                        <input
                            type="text"
                            className={`w-[60%] h-[64px] px-4 py-3 border ${errors.primary_title ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg text-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2c6472]`}
                            value={searchTerms.primary_title}
                            onChange={(e) => handleSearchChange(e, "primary_title")}
                            onFocus={() => setShowDropdowns((prev) => ({ ...prev, primary_title: true }))}
                        />
                        {showDropdowns.primary_title && (
                            <ul className="absolute z-10 w-[60%] max-h-48 overflow-y-auto mt-14 bg-white border border-gray-300 rounded shadow-md">
                                {getFilteredTitles(searchTerms.primary_title).map((title, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSelect("primary_title", title)}
                                        className="px-4 py-2 cursor-pointer text-gray-500 hover:bg-[#2c6472] hover:text-white"
                                    >
                                        {title}
                                    </li>
                                ))}
                                {getFilteredTitles(searchTerms.primary_title).length === 0 && (
                                    <li className="px-4 py-2 text-gray-400">No matching titles</li>
                                )}
                            </ul>
                        )}

                        <button
                            type="button"
                            onClick={addSkill}
                            disabled={formData.job_titles.length >= 3}
                            className=" w-24 mt-2 ms-5  px-2 py-2 border-2 border-[#2c6472] text-[#2c6472] h-[44px] text-sm font-medium bg-white hover:scale-95 transition-transform ease-linear  duration-200 ml-2"
                        >
                            +Add Skill
                        </button>
                    </div>
                    {errors.primary_title && (
                        <div className="text-red-500 text-sm mt-1">{errors.primary_title}</div>
                    )}

                    <div className="flex flex-wrap w-[70%] mt-5 gap-3 h-[100px]  p-2 rounded">
                        {formData.job_titles.map((title, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 h-8 px-3 py-1 text-gray-500 rounded-full flex items-center"
                            >
                                <span className="mr-2">{title}</span>
                                <button
                                    type="button"
                                    onClick={() => removeSkill(index)}
                                    className="text-gray-500 text-xl hover:text-red-500 focus:outline-none"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>



                    <div className="flex gap-3 mt-5">
                        <input type="checkbox" className='w-4 mt-0.5 h-4 bg-[#2c6472] text-[#2c6472]' name="primary_title" id="primary_title" />
                        <p className='text-sm text-gray-500'>Please enter your job title accurately. This cannot be changed once saved.</p>
                    </div>
                    <p className='text-xs mt-0.5 ms-7 text-red-500'>Note: You cannot change the job title after this. Please enter it carefully.</p>

                    <div className="flex w-[70%] justify-end items-center gap-4 mt-8">
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

export default JobTitles
