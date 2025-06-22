import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import right_arrow from '../../assets/left-arrow.png'
import axios from 'axios';
import { jobskills } from '../../assets/data';
import { BASE_URL } from '../../utils/api';

const Skills = () => {
    const navigate = useNavigate();
    const [jobTitle, setJobTitle] = useState({});
    const [showDropdown, setShowDropdown] = useState(false);
    const [hasExistingData, setHasExistingData] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const hasDataRef = useRef(false);
    const [dropdownType, setDropdownType] = useState(null); // "general" or "job"
    const jobDropdownRef = useRef(null);
    const [generalSearchTerm, setGeneralSearchTerm] = useState('');
    const [jobSearchTerm, setJobSearchTerm] = useState('');
    const [errors, setErrors] = useState({});
    const [accepted, setAccepted] = useState(false);
    const [showSavePopup, setShowSavePopup] = useState(false);






    const allSkills = Object.values(jobskills).flatMap(job => job.skills);
    const [dynamicSkills, setDynamicSkills] = useState(allSkills);

    const dropdownRef = useRef(null);

    const [formData, setFormData] = useState({
        generalSkills: [],
        jobSpecificSkills: [],
    });


    const apiUrl = `${BASE_URL}/keyskills`;
    const jobtitleapiurl = `${BASE_URL}/jobtitles`;
    const token = sessionStorage.getItem("authToken");

    const jobTitlesArray = [
        jobTitle.primary_title,
        jobTitle.secondary_title,
        jobTitle.tertiary_title,
    ].filter(Boolean);


    const fetchjobtitle = async () => {
        if (!token) {
            console.warn("🚫 Not logged in, skipping job title fetch");
            setJobTitle({}); // fallback
            return;
        }
        try {
            const res = await axios.get(jobtitleapiurl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setJobTitle(res.data);

            const fetchedJobTitle = res.data;
            setJobTitle(fetchedJobTitle);

            const allFetchedTitles = [
                fetchedJobTitle.primary_title,
                fetchedJobTitle.secondary_title,
                fetchedJobTitle.tertiary_title,
            ].filter(Boolean);

            // 👇 Set first job title as default
            if (allFetchedTitles.length > 0) {
                setSelectedTitle(allFetchedTitles[0]);
                setDropdownType("job");
                setShowDropdown(true); // 👈 open job-specific dropdown
            }
        } catch (err) {
            console.error("Failed to fetch jobtitles info", err);
        }
    };
    useEffect(() => {
        console.log("🎯 selectedTitle:", selectedTitle);
        const matchedJob = jobskills[selectedTitle];
        if (matchedJob && Array.isArray(matchedJob.skills)) {
            console.log("✅ Skills for selected title:", matchedJob.skills);
            setDynamicSkills(matchedJob.skills);
        } else {
            console.warn("❌ No skills found for this title");
            setDynamicSkills([]);
        }
    }, [selectedTitle]);





    useEffect(() => {
        fetchjobtitle();
    }, []);

    useEffect(() => {
        if (dropdownType === "job" && selectedTitle && dynamicSkills.length > 0) {
            setShowDropdown(true);
        }
    }, [selectedTitle, dynamicSkills]);


    useEffect(() => {
        console.log("Updated hasExistingData:", hasExistingData);
    }, [hasExistingData]);




    const filteredSkills = (() => {
        if (dropdownType === "job") {
            return (dynamicSkills || []).filter(skill =>
                skill.toLowerCase().includes((jobSearchTerm || '').toLowerCase())
            );
        }
        if (dropdownType === "general") {
            return (allSkills || []).filter(skill =>
                skill.toLowerCase().includes((generalSearchTerm || '').toLowerCase())
            );
        }
        return [];
    })();




    useEffect(() => {
        console.log("jobTitle", jobTitle);
    }, [jobTitle]);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ Handles selection from dropdown, ONLY fills input — no adding
    const handleSelect = (skill) => {
        if (dropdownType === "general") {
            setGeneralSearchTerm(skill);
        } else {
            setJobSearchTerm(skill);
        }
        setShowDropdown(false);
    };


    // ✅ Adds selected/typed skill to proper formData field
    const addSkill = () => {
        const term = dropdownType === "general" ? generalSearchTerm.trim() : jobSearchTerm.trim();
        if (!term) return;

        const alreadyExists =
            dropdownType === "general"
                ? formData.generalSkills.includes(term)
                : formData.jobSpecificSkills.includes(term);

        if (alreadyExists) {
            alert("⚠️ This skill is already added.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            generalSkills: dropdownType === "general"
                ? [...prev.generalSkills, term]
                : prev.generalSkills,
            jobSpecificSkills: dropdownType === "job"
                ? [...prev.jobSpecificSkills, term]
                : prev.jobSpecificSkills,
        }));

        // ✅ Clear input and close dropdown
        dropdownType === "general" ? setGeneralSearchTerm('') : setJobSearchTerm('');
        setShowDropdown(false);
    };

    // ✅ Removes a skill by index from the right category
    const removeSkill = (index, type) => {
        setFormData((prev) => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    // ✅ Validates that both lists have at least one skill
    const validateForm = () => {
        const newErrors = {};

        if (formData.generalSkills.length === 0) {
            newErrors.generalSkills = "Please add at least one general skill.";
        }

        if (formData.jobSpecificSkills.length === 0) {
            newErrors.jobSpecificSkills = "Please add at least one job-specific skill.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    // ✅ Final submit logic (unchanged, just clean)
    const handleNext = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (!accepted) {
            alert('Please accept the condition before continuing.');
            return;
        }

        const token = sessionStorage.getItem('authToken');
        if (!token) {
            console.error("❌ No token found in sessionStorage");
            return;
        }

        const mergedSkills = Array.from(new Set([...formData.generalSkills, ...formData.jobSpecificSkills]));

        const payload = {
            skills: mergedSkills,
        };

        const method = hasDataRef.current ? 'PUT' : 'POST';

        try {
            const response = await fetch(apiUrl, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text(); // use text instead of .json()
                console.error("❌ Error uploading data:", errorText);
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                console.error("❌ Error uploading data:", data);
            } else {
                    navigate('/user/dashboard');
            }
        } catch (error) {
            console.error("❌ Network or server error:", error);
        }
    };


    // 🔁 Hook to handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                jobDropdownRef.current &&
                !jobDropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <div className='w-full min-h-screen p-5 ml-5 text-black'>
            <div className="flex flex-col">


                <div>
                    <p className=' flex font-semibold text-[#2c6472]'>STEP 8 OF 8</p>
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
                                    value={generalSearchTerm}
                                    onChange={(e) => {
                                        setGeneralSearchTerm(e.target.value);
                                        setShowDropdown(true);
                                        setDropdownType("general");
                                        setErrors((prev) => ({ ...prev, generalSkills: null }));

                                    }}
                                    onFocus={() => {
                                        setShowDropdown(true);
                                        setDropdownType("general");
                                    }}

                                />
                                {showDropdown && dropdownType === "general" && (
                                    <ul className="absolute top-16 z-10 w-[60%] max-h-48 overflow-y-auto text-gray-600 bg-white border border-gray-300 shadow-md">
                                        {filteredSkills.length > 0 ? (
                                            filteredSkills.map((skill, index) => (
                                                <li
                                                    key={index}
                                                    className="px-4 py-2 cursor-pointer hover:bg-[#2c6472] hover:text-white"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault(); // prevent input from losing focus
                                                        handleSelect(skill);
                                                    }}                                                >
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

                        {errors.generalSkills && (
                            <div className="text-red-500 text-sm mt-1">{errors.generalSkills}</div>
                        )}

                        <div className="flex flex-wrap gap-2 h-[80px] w-[60%] scrollbar-custom overflow-y-auto p-2 rounded ">
                            {formData.generalSkills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 h-8 px-3 py-1 text-gray-500 rounded-full flex items-center"
                                >
                                    <span className="mr-2">{skill}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(index, 'generalSkills')}
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
                                        setSelectedTitle(title); // ✅ only this
                                        setJobSearchTerm('');     // ✅ optional: clear input
                                        setDropdownType('job');   // ✅ ensure it's set properly
                                    }}

                                    className={`flex-shrink-0 h-8 px-3 py-1.5 text-sm rounded snap-start cursor-pointer 
                                            ${selectedTitle === title ? 'bg-[#2c6472] text-white' : 'text-white bg-gray-500/40'}
                                            hover:bg-[#2c6472] hover:text-white transition-all duration-200`}
                                >
                                    {title}
                                </div>
                            ))}
                        </div>

                        <div className='flex relative ' ref={jobDropdownRef}>
                            <input
                                type="text"
                                className="peer w-[60%] h-[64px] rounded-lg text-lg scrollbar-custom px-4 py-2 border border-gray-300  text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                                value={jobSearchTerm}
                                onChange={(e) => {
                                    setJobSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                    setDropdownType("job");
                                    setErrors((prev) => ({ ...prev, jobSpecificSkills: null }));

                                }}
                                onFocus={() => {
                                    setShowDropdown(true);
                                    setDropdownType("job");
                                }}
                            />
                            {selectedTitle && showDropdown && dropdownType === "job" && (
                                <ul className="absolute top-16 z-10 w-[60%] max-h-48 overflow-y-auto text-gray-600 bg-white border border-gray-300 shadow-md">
                                    {filteredSkills.length > 0 ? (
                                        filteredSkills.map((skill, index) => (
                                            <li
                                                key={index}
                                                className="px-4 py-2 cursor-pointer hover:bg-[#2c6472] hover:text-white"
                                                onMouseDown={(e) => {
                                                    e.preventDefault(); // prevent input from losing focus
                                                    handleSelect(skill);
                                                }}                                            >
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

                    {errors.jobSpecificSkills && (
                        <div className="text-red-500 text-sm mt-1">{errors.jobSpecificSkills}</div>
                    )}


                    <div className="flex flex-wrap gap-2 h-[80px] w-[60%] mt-3 mb-12 scrollbar-custom overflow-y-auto p-2 rounded ">
                        {formData.jobSpecificSkills.map((skill, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 h-8 px-3 py-1 text-gray-500 rounded-full flex items-center"
                            >
                                <span className="mr-2">{skill}</span>
                                <button
                                    type="button"
                                    onClick={() => removeSkill(index, 'jobSpecificSkills')}
                                    className="text-gray-500 hover:text-red-500 focus:outline-none"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}

                    </div>



                    <div className="flex gap-3 mt-5">
                        <input
                            type="checkbox"
                            className='w-4 mt-2 h-4 bg-[#2c6472] text-[#2c6472]'
                            name="primary_title" id="primary_title"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)} />
                        <p className='text-sm text-gray-500'>Please enter only relevant job-related skills.</p>
                    </div>
                    <p className='text-sm  ms-7 text-gray-500'>Adding unrelated or inaccurate skills may affect the quality of your profile.</p>

                    <div className="flex w-[70%]   justify-end items-center gap-4 mt-8">
                        <button
                            type="button"
                            className=" teal-button mb-16 px-6 py-2 bg-[#2c6472] text-white  h-[41px]  rounded-xl focus:outline-none transition-transform duration-200 ease-in-out"
                            onClick={handleNext}
                        >
                            {loading ? 'Saving...' : 'Go to Dashboard'}
                        </button>
                    </div>




                </form>


            </div>


            {showSavePopup && (
                <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 bg-white border-b-4 border-[#2C6472] text-black rounded-md shadow-lg transform transition-all duration-500 ease-in-out animate-toast-in`}>
                    <div className="relative px-3 py-1">
                        <span>✅ Skills saved successfully!</span>
                        <div className="absolute bottom-0 left-0 h-[3px] bg-white animate-progress w-full" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Skills
