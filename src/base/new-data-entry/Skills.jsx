import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import right_arrow from '../../assets/left-arrow.png'
import axios from 'axios';
import { jobskills } from '../../assets/data';

const Skills = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [hasExistingData, setHasExistingData] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const hasDataRef = useRef(false);

    const allSkills = Object.values(jobskills).flatMap(job => job.skills);
    const [dynamicSkills, setDynamicSkills] = useState(allSkills);

    const dropdownRef = useRef(null);

    const apiUrl = "https://jse.arshan.digital/b1/professional-summary";
    const jobtitleapiurl = "https://jse.arshan.digital/b1/jobtitles"
    const token = sessionStorage.getItem("authToken");


    const fetchjobtitle = async () => {
        try {
            const res = await axios.get(jobtitleapiurl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setJobTitle(res.data);
            console.log(res.data);
        } catch (err) {
            console.error("Failed to fetch jobtitles info", err);
        }
    };

    const jobTitlesArray = [
        jobTitle.primary_title,
    ].filter(Boolean);



    const fetchProfessionalsummaryInfo = async () => {
        try {
            const res = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });



            let info = {};

            if (Array.isArray(res.data)) {
                info = res.data[0] || {};
            } else if (Array.isArray(res.data?.professional_summary)) {
                info = res.data.professional_summary[0] || {};
            } else if (typeof res.data?.professional_summary === 'object') {
                info = res.data.professional_summary;
            } else if (typeof res.data === 'object') {
                info = res.data;
            }

            const hasData = Object.keys(info).length > 0;
            hasDataRef.current = hasData;  // <== keep immediate ref update
            setHasExistingData(hasData);

            console.log("existingdata", hasDataRef);


            setFormData({
                skills: Array.isArray(info.skills) ? info.skills : [], // populate skills
                newSkill: '', // keep this to avoid undefined issues
            });


        } catch (err) {
            console.error("Failed to fetch personal info", err);
        }
    };

    useEffect(() => {
        fetchProfessionalsummaryInfo();
        fetchjobtitle();
    }, []);

    useEffect(() => {
        console.log("Updated hasExistingData:", hasExistingData);
    }, [hasExistingData]);



    const filteredSkills = dynamicSkills.filter(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (skill) => {
        setFormData({ ...formData, newSkill: skill });
        setSearchTerm(skill);
        setShowDropdown(false);
    };

    const [formData, setFormData] = useState({
        skills: [],
        newSkill: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addSkill = () => {
        const trimmedSkill = formData.newSkill.trim();

        if (!trimmedSkill) return;

        const isDuplicate = formData.skills.some(
            (skill) => skill.toLowerCase() === trimmedSkill.toLowerCase()
        );

        if (isDuplicate) {
            alert("This skill is already added!");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, trimmedSkill],
            newSkill: '',
        }));

        setSearchTerm('');
    };


    const removeSkill = (index) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        console.log("🔍 Validating form:", formData);

    

        if (formData.skills.length === 0) {
            console.error("❌ No skills selected");
            return false;
        }

     

        console.log("✅ Form validation passed!");
        return true;
    };



    const handleNext = async (e) => {
        e.preventDefault();
        console.log("handleNext clicked!");
        console.log("Is form valid?", validateForm());


        if (!validateForm()) return;

        const token = sessionStorage.getItem('authToken'); // Assuming token is stored as 'token'
        if (!token) {
            console.error("❌ No token found in sessionStorage");
            return;
        }

        const payload = {
            skills: formData.skills,
        };

        const method = hasDataRef.current ? 'PUT' : 'POST'; // <-- immediate & accurate

        console.log("method", method);

        try {
            const response = await fetch('https://jse.arshan.digital/b1/professional-summary', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("❌ Error uploading data:", data);
            } else {
                navigate('/user/onboarding/work-experience');
            }
        } catch (error) {
            console.error("❌ Network or server error:", error);
        }
    };

    // 🔁 Hook to handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <div className='w-full h-screen p-5 ml-5 overflow-y-auto text-black'>
            <div className="flex flex-col">
                <div className="flex items-center mb-5 cursor-pointer">
                    <img src={right_arrow} className='w-2.5 h-3.5 object-cover' alt="" />
                    <p className='ml-2 text-lg font-medium' onClick={() => navigate(-1)}>Back</p>
                </div>

                <div>
                    <p className=' flex font-semibold text-[#2c6472]'>STEP 5 OF 8</p>
                </div>

                <div>
                    <h1 className='text-2xl font-semibold mt-7'>Add your key skills.</h1>
                </div>

                <form className='ms-6' >
                    <div className="flex flex-col mt-5 ">
                        <label className="mb-3 block font-medium text-lg ">
                            General Skills <span className='text-red-500 ms-1'>*</span>
                        </label>
                    </div>

                    {/* Skills */}
                    <div className="mb-2">
                        <div className="relative items-center mb-2" ref={dropdownRef}>
                            <div className='flex'>
                                <input
                                    type="text"
                                    className="peer w-[60%] h-[64px] rounded-lg text-lg scrollbar-custom px-4 py-2 border border-gray-300  text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                />
                                {showDropdown && (
                                    <ul className="absolute top-16 z-10 w-[50%] max-h-48 overflow-y-auto text-gray-600 bg-white border border-gray-300 shadow-md">
                                        {filteredSkills.length > 0 ? (
                                            filteredSkills.map((skill, index) => (
                                                <li
                                                    key={index}
                                                    className="px-4 py-2 cursor-pointer hover:bg-[#2c6472] hover:text-white"
                                                    onClick={() => handleSelect(skill)}
                                                >
                                                    {skill}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="px-4 py-2 text-gray-400">No matching skills</li>
                                        )}
                                    </ul>
                                )}
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className=" w-24 mt-2 ms-5 px-2 py-2 border-2 border-[#2c6472] text-[#2c6472] h-[44px] text-sm font-medium bg-white hover:scale-95 transition-transform ease-linear  duration-200 ml-2"
                                >
                                    +Add Skill
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 h-[80px] w-[60%] scrollbar-custom overflow-y-auto p-2 rounded ">
                            {formData.skills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 h-8 px-3 py-1 text-gray-500 rounded-full flex items-center"
                                >
                                    <span className="mr-2">{skill}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(index)}
                                        className="text-gray-500 hover:text-red-500 focus:outline-none"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>


                    <div className='mt-8'>
                        <label className="mb-3 block font-medium text-lg ">
                            Job Specific Skills <span className='text-red-500 ms-1'>*</span>
                        </label>
                    <div className="expereince-title flex gap-4  mb-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory">

                        {jobTitlesArray.map((title, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedTitle(title);

                                    // 🔍 Find the selected job title from jobskills and update the dropdown skills
                                    const matchedJob = jobskills[title];
                                    if (matchedJob && Array.isArray(matchedJob.skills)) {
                                        setDynamicSkills(matchedJob.skills);
                                    } else {
                                        setDynamicSkills([]); // fallback
                                    };
                                    setSearchTerm('');           // optional: clear search bar
                                    setShowDropdown(true);
                                }}
                                className={`flex-shrink-0 h-8 px-3 py-1.5 text-sm rounded snap-start cursor-pointer 
                                            ${selectedTitle === title ? 'bg-[#2c6472] text-white' : 'text-white bg-gray-500/40'}
                                            hover:bg-[#2c6472] hover:text-white transition-all duration-200`}
                            >
                                {title}
                            </div>
                        ))}
                        </div>

                        <div className='flex'>
                            <input
                                type="text"
                                className="peer w-[60%] h-[64px] rounded-lg text-lg scrollbar-custom px-4 py-2 border border-gray-300  text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                            />
                            {showDropdown && (
                                <ul className="absolute top-16 z-10 w-[50%] max-h-48 overflow-y-auto text-gray-600 bg-white border border-gray-300 shadow-md">
                                    {filteredSkills.length > 0 ? (
                                        filteredSkills.map((skill, index) => (
                                            <li
                                                key={index}
                                                className="px-4 py-2 cursor-pointer hover:bg-[#2c6472] hover:text-white"
                                                onClick={() => handleSelect(skill)}
                                            >
                                                {skill}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-2 text-gray-400">No matching skills</li>
                                    )}
                                </ul>
                            )}
                            <button
                                type="button"
                                onClick={addSkill}
                                className=" w-24 mt-2 ms-5 px-2 py-2 border-2 border-[#2c6472] text-[#2c6472] h-[44px] text-sm font-medium bg-white hover:scale-95 transition-transform ease-linear  duration-200 ml-2"
                            >
                                +Add Skill
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 h-[80px] w-[60%] mt-3 mb-12 scrollbar-custom overflow-y-auto p-2 rounded ">
                        {formData.skills.map((skill, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 h-8 px-3 py-1 text-gray-500 rounded-full flex items-center"
                            >
                                <span className="mr-2">{skill}</span>
                                <button
                                    type="button"
                                    onClick={() => removeSkill(index)}
                                    className="text-gray-500 hover:text-red-500 focus:outline-none"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}

                    </div>

                    <div className="flex gap-3 mt-5">
                        <input type="checkbox" className='w-4 mt-2 h-4 bg-[#2c6472] text-[#2c6472]' name="primary_title" id="primary_title" />
                        <p className='text-sm text-gray-500'>Please enter only relevant job-related skills.</p>
                    </div>
                    <p className='text-sm  ms-7 text-gray-500'>Adding unrelated or inaccurate skills may affect the quality of your profile.</p>

                    <div className="flex w-[70%] mb-16 justify-end items-center gap-4 mt-8">
                        <button
                            type="button"
                            className=" teal-button px-6 py-2 bg-[#2c6472] text-white  h-[41px]  rounded-xl focus:outline-none transition-transform duration-200 ease-in-out"
                            onClick={handleNext}
                        >
                            {loading ? 'Saving...' : 'Go to Dashboard'}
                        </button>
                    </div>




                </form>


            </div>
        </div>
    )
}

export default Skills
