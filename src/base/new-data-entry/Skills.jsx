import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import right_arrow from '../../assets/left-arrow.png'
import axios from 'axios';
import { jobskills } from '../../assets/data';
import { generalskills } from '../../assets/data';
import { BASE_URL } from '../../utils/api';
import warning from "../../assets/carbon_warning.png"


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
    const [triggerAddSkill, setTriggerAddSkill] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(0);




    const generalInputRef = useRef(null);
    const jobInputRef = useRef(null);


    const allSkills = Object.values(jobskills).flatMap(job => job.skills);
    const [dynamicSkills, setDynamicSkills] = useState(allSkills);
    const generalRefs = useRef([]);
    const jobRefs = useRef([]);

    const [highlightIndexGeneral, setHighlightIndexGeneral] = useState(0);
    const [highlightIndexJob, setHighlightIndexJob] = useState(0);


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
            return (generalskills || []).filter(skill =>
                skill.toLowerCase().includes((generalSearchTerm || '').toLowerCase())
            );
        }
        return [];
    })();




    useEffect(() => {
        console.log("jobTitle", jobTitle);
    }, [jobTitle]);

    useEffect(() => {
        const stored = sessionStorage.getItem("extractedResume");

        if (stored) {
            const parsed = JSON.parse(stored);
            const generalFromSession = parsed?.data?.generalSkills || [];
            const jobFromSession = parsed?.data?.jobSpecificSkills || [];

            // 🚫 No validation, no toasts — just set everything directly
            setFormData({
                generalSkills: generalFromSession,
                jobSpecificSkills: jobFromSession,
            });
        }
    }, []);


    useEffect(() => {
        if (
            dropdownType === "general" &&
            highlightIndexGeneral !== -1 &&
            generalRefs.current[highlightIndexGeneral]
        ) {
            generalRefs.current[highlightIndexGeneral].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [highlightIndexGeneral, dropdownType]);

    useEffect(() => {
        if (
            dropdownType === "job" &&
            highlightIndexJob !== -1 &&
            jobRefs.current[highlightIndexJob]
        ) {
            jobRefs.current[highlightIndexJob].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [highlightIndexJob, dropdownType]);






    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ Handles selection from dropdown, ONLY fills input — no adding
    const handleSelect = (skill) => {
        const isGeneral = dropdownType === "general";

        const alreadyExists = isGeneral
            ? formData.generalSkills.includes(skill)
            : formData.jobSpecificSkills.includes(skill);

        if (alreadyExists) {
            toast.error("This skill is already added.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            generalSkills: isGeneral
                ? [...prev.generalSkills, skill]
                : prev.generalSkills,
            jobSpecificSkills: !isGeneral
                ? [...prev.jobSpecificSkills, skill]
                : prev.jobSpecificSkills,
        }));

        // Clear input + hide dropdown
        if (isGeneral) {
            setGeneralSearchTerm('');
            setTimeout(() => {
                generalInputRef.current?.blur(); // 👈 force blur
                setShowDropdown(false);
            }, 100);
        } else {
            setJobSearchTerm('');
            setTimeout(() => {
                jobInputRef.current?.blur(); // 👈 force blur
                setShowDropdown(false);
            }, 100);
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
            toast.error("This skill was already added.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            generalSkills:
                dropdownType === "general"
                    ? [...prev.generalSkills, term]
                    : prev.generalSkills,
            jobSpecificSkills:
                dropdownType === "job"
                    ? [...prev.jobSpecificSkills, term]
                    : prev.jobSpecificSkills,
        }));

        if (dropdownType === "general") {
            setGeneralSearchTerm('');
            setTimeout(() => {
                generalInputRef.current?.blur(); // 🧠 Blur input instead of focusing
                setShowDropdown(false);
            }, 100);
        } else {
            setJobSearchTerm('');
            setTimeout(() => {
                jobInputRef.current?.blur(); // 🧠 Same here
                setShowDropdown(false);
            }, 100);
        }
    };


    // ✅ Removes a skill by index from the right category
    const removeSkill = (index, type) => {
        setFormData((prev) => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    useEffect(() => {
        if (triggerAddSkill) {
            addSkill();
            setTriggerAddSkill(false);
        }
    }, [generalSearchTerm, triggerAddSkill]);


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
            toast.error('Please accept the condition.');
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

            await fetchEntryProgressAndRedirect(token);

        } catch (error) {
            console.error("❌ Network or server error:", error);
        }
    };


    const fetchEntryProgressAndRedirect = async (token) => {
        try {
            const res = await fetch(`${BASE_URL}/user/entry-progress/check`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const progress = await res.json();
            console.log("🧠 Entry Progress Response:", progress);

            if (res.ok && progress.completed === true) {
                // ✅ Only allow access to dashboard if completed
                navigate('/user/dashboard');
            } else {
                // ❌ Any incomplete, unknown, or invalid response — logout user
                toast.error("❌ Data entry incomplete or invalid user. Logging out...");
                sessionStorage.clear();
                localStorage.clear();
                navigate('/user/login');
            }
        } catch (err) {
            console.error('💥 Error:', err);
            toast.error("Something went wrong. Logging out...");
            sessionStorage.clear();
            localStorage.clear();
            navigate('/user/login');
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
                                    ref={generalInputRef}
                                    type="text"
                                    className="peer w-[70%] h-[64px] rounded-lg text-lg scrollbar-custom px-4 py-2 border border-gray-300  text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                                    value={generalSearchTerm}
                                    onChange={(e) => {
                                        setGeneralSearchTerm(e.target.value);
                                        setShowDropdown(true);
                                        setDropdownType("general");
                                        setErrors((prev) => ({ ...prev, generalSkills: null }));
                                        setHighlightIndex(0); // reset highlight to first


                                    }}
                                    onKeyDown={(e) => {
                                        const currentList = filteredSkills;

                                        if (e.key === 'ArrowDown') {
                                            e.preventDefault();
                                            setHighlightIndexGeneral((prev) =>
                                                prev < currentList.length - 1 ? prev + 1 : 0
                                            );
                                        } else if (e.key === 'ArrowUp') {
                                            e.preventDefault();
                                            setHighlightIndexGeneral((prev) =>
                                                prev > 0 ? prev - 1 : currentList.length - 1
                                            );
                                        } else if (e.key === 'Enter') {
                                            e.preventDefault();

                                            const selectedSkill =
                                                highlightIndexGeneral >= 0
                                                    ? currentList[highlightIndexGeneral]
                                                    : currentList[0];

                                            if (!selectedSkill) return;
                                            handleSelect(selectedSkill);
                                            setHighlightIndexGeneral(0);
                                        }
                                    }}


                                    onFocus={() => {
                                        setShowDropdown(true);
                                        setDropdownType("general");
                                    }}

                                />
                                {showDropdown && dropdownType === "general" && (
                                    <ul className="absolute top-16 z-10 w-[70%] max-h-48 overflow-y-auto text-gray-600 bg-white border border-gray-300 shadow-md">
                                        {filteredSkills.map((skill, index) => (
                                            <li
                                                key={index}
                                                ref={(el) => (generalRefs.current[index] = el)}
                                                className={`px-4 py-2 cursor-pointer ${index === highlightIndexGeneral
                                                    ? 'bg-[#2c6472] text-white'
                                                    : 'hover:bg-[#2c6472] hover:text-white text-gray-600'
                                                    }`}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    handleSelect(skill);
                                                }}
                                            >
                                                {skill}
                                            </li>
                                        ))}

                                    </ul>
                                )}

                            </div>
                        </div>

                        {errors.generalSkills && (
                            <div className="text-red-500 text-sm mt-1">{errors.generalSkills}</div>
                        )}

                        <div className="flex flex-wrap gap-2 h-[80px] w-[70%] scrollbar-custom border-x border-black overflow-y-auto p-2  ">
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
                                ref={jobInputRef}
                                type="text"
                                className="peer w-[70%] h-[64px] rounded-lg text-lg scrollbar-custom px-4 py-2 border border-gray-300  text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                                value={jobSearchTerm}
                                onChange={(e) => {
                                    setJobSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                    setDropdownType("job");
                                    setErrors((prev) => ({ ...prev, jobSpecificSkills: null }));

                                }}
                                onKeyDown={(e) => {
                                    const currentList = filteredSkills;

                                    if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        setHighlightIndexJob((prev) =>
                                            prev < currentList.length - 1 ? prev + 1 : 0
                                        );
                                    } else if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        setHighlightIndexJob((prev) =>
                                            prev > 0 ? prev - 1 : currentList.length - 1
                                        );
                                    } else if (e.key === 'Enter') {
                                        e.preventDefault();

                                        const selectedSkill =
                                            highlightIndexJob >= 0 ? currentList[highlightIndexJob] : currentList[0];

                                        if (!selectedSkill) return;
                                        handleSelect(selectedSkill);
                                        setHighlightIndexJob(0);
                                    }
                                }}

                                onFocus={() => {
                                    setShowDropdown(true);
                                    setDropdownType("job");
                                }}
                            />
                            {selectedTitle && showDropdown && dropdownType === "job" && (
                                <ul className="absolute top-16 z-10 w-[70%] max-h-48 overflow-y-auto text-gray-600 bg-white border border-gray-300 shadow-md">
                                    {filteredSkills.map((skill, index) => (
                                        <li
                                            key={index}
                                            ref={(el) => (jobRefs.current[index] = el)}
                                            className={`px-4 py-2 cursor-pointer ${index === highlightIndexJob
                                                    ? 'bg-[#2c6472] text-white'
                                                    : 'hover:bg-[#2c6472] hover:text-white text-gray-600'
                                                }`}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSelect(skill);
                                            }}
                                        >
                                            {skill}
                                        </li>
                                    ))}

                                </ul>
                            )}

                        </div>
                    </div>

                    {errors.jobSpecificSkills && (
                        <div className="text-red-500 text-sm mt-1">{errors.jobSpecificSkills}</div>
                    )}


                    <div className="flex flex-wrap gap-2 h-[80px] w-[70%] mt-3 mb-12 scrollbar-custom border-x border-black overflow-y-auto p-2  ">
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



                    <div className="flex gap-3 items-center mt-5">
                        <input
                            type="checkbox"
                            className='w-4  h-4 bg-[#2c6472] text-[#2c6472]'
                            name="primary_title" id="primary_title"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)} />
                        <p className='text-sm text-gray-500'>Please enter only relevant skills. Adding unrelated may affect the quality of your profile.</p>
                    </div>

                    <div className='text-xs my-5 flex items-center justify-start text-center  '><p><span className='font-medium'>Please note:</span><span className='text-[#2c6472] ms-1'>Enter your details carefully , you can  only edit them later.</span></p></div>

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

            {/* Footer appears after scrolling all content */}
            <div className="flex justify-start gap-2 text-gray-500 text-sm mt-5 ">
                <img src={warning} className="w-5 ms-5 h-5 object-cover" alt="" />
                AI is not perfect. Make sure your data is accurate before saving.            </div>

        </div>
    )
}

export default Skills
