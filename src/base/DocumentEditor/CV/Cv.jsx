import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import download_icon from '../../../assets/download.svg'
import save_icon from '../../../assets/tick.svg'
import edit_icon from '../../../assets/edit-icon.svg'
import ModernDeedy from './ModernDeedy';
import html2pdf from 'html2pdf.js';
import { useCv } from '../Context/CvContext';
import axios from 'axios';
import { BASE_URL } from '../../../utils/api';
import PlushCV from './PlushCV';
import ThirdCV from './CV-Third-Template';
import EuropassCV from './EuropassCV'
import ModernClassic from './ModernClassic';
import profile from "../../../assets/profile1.png"

const Cv = () => {

    const navigate = useNavigate();

    const {
        personalInfo, setPersonalInfo,
        professionalSummary, setProfessionalSummary,
        workExperience, setWorkExperience,
        education, setEducation,
        projects, setProjects,
        certificates, setCertificates,
        skills, setSkills,
        languages, setLanguages
    } = useCv();

    const [selectedCompanyIdx, setSelectedCompanyIdx] = useState(0);
    const [selectedProjectIdx, setSelectedProjectIdx] = useState(0);
    const [selectedEducationIdx, setSelectedEducationIdx] = useState(0);

    // 🔽 Add at the top (under hooks)
    const templates = {
        ModernDeedy,
        PlushCV,
        ThirdCV,
        EuropassCV,
        ModernClassic
    };
    const [selectedTemplate, setSelectedTemplate] = useState("EuropassCV");
    const SelectedTemplate = templates[selectedTemplate];

    const [profileImage, setProfileImage] = useState(null);
    const token = sessionStorage.getItem("authToken");
    const [language, setLanguage] = useState(() => sessionStorage.getItem("selectedLanguage") || "en");


    const previewRef = useRef();

    const handleDownload = () => {
        const element = previewRef.current;
        if (!element) return;

        const opt = {
            margin: 0,
            filename: 'CV.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }

        };

        html2pdf().set(opt).from(element).save();
    };

    const [activeSection, setActiveSection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleFieldChange = (key, value) => {
        setPersonalInfo((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // ✅ Add this useEffect to refresh sessionStorage data on mount
    useEffect(() => {
        let rawData = {};
        try {
            rawData = JSON.parse(sessionStorage.getItem("generatedCV")) || {};

        } catch (e) {
            console.error("Invalid JSON in sessionStorage for generatedCV:", e);

        }

        setPersonalInfo({
            Name: rawData.personal_info?.name || "",
            Title: rawData.personal_info?.title || "",
            Mail: rawData.personal_info?.mail || "",
            Phone: rawData.personal_info?.phone || "",
            LinkedIn: rawData.personal_info?.linkedin || "",
            Website: rawData.personal_info?.portfolio || "[your website]",
        });

        setProfessionalSummary({
            title: "Professional Summary",
            content: rawData.profile_summary || ""
        });

        setWorkExperience({
            title: "Work Experience",
            content: (rawData.work_experience || []).map(item => ({
                Role: item.position || "",
                Company: item.company_name || "",
                Duration: item.period || "",
                Description: Array.isArray(item.description) ? item.description : [item.description || ""]
            }))
        });

        setEducation({
            title: "Education",
            content: (rawData.education || []).map(entry => ({
                degree: entry || ""
            }))
        });

        setProjects({
            title: "Projects",
            content: (rawData.projects || []).map(item => ({
                Name: item.project_name || "",
                Company: item.company_name || "",
                Duration: item.period || "",
                Skills: item.skills_used || "",
                Description: Array.isArray(item.description) ? item.description : [item.description || ""]
            }))
        });

        setCertificates({
            title: "Certificates",
            content: (rawData.certifications || []).map(name => ({
                Name: name || ""
            }))
        });

        setSkills({
            title: "Skills",
            content: rawData.skills || []
        });

        setLanguages({
            title: "Languages",
            content: rawData.languages || []
        });
        setIsLoading(false); // Set loading to false after data is set
    }, []); // 👈 Run only once when CV page mounts

    const handleUpdateCV = async () => {
        const token = sessionStorage.getItem("authToken");
        const stored = sessionStorage.getItem("generatedCV");

        if (!token || !stored) {
            console.warn("⚠️ Missing auth token or generatedCV data.");
            return;
        }

        const parsed = JSON.parse(stored);
        const jobId = parsed.job_id;

        if (!jobId) {
            console.warn("⚠️ job_id is missing in generatedCV.");
            return;
        }

        // 🧠 BUILD CV PAYLOAD FROM CURRENT STATE
        const payload = {
            job_id: jobId,
            cv_data: {
                personal_info: {
                    name: personalInfo.Name,
                    title: personalInfo.Title,
                    mail: personalInfo.Mail,
                    phone: personalInfo.Phone,
                    address: personalInfo.Address || "", // optional
                    linkedin: personalInfo.LinkedIn,
                    portfolio: personalInfo.Website
                },
                profile_summary: professionalSummary.content || "",
                education: education.content.map(e => e.degree),
                certifications: certificates.content.map(c => c.Name),
                skills: skills.content,
                languages: languages.content,
                work_experience: workExperience.content.map(item => ({
                    position: item.Role,
                    company_name: item.Company,
                    period: item.Duration,
                    description: item.Description
                })),
                projects: projects.content.map(item => ({
                    project_name: item.Name,
                    company_name: item.Company,
                    period: item.Duration,
                    skills_used: item.Skills,
                    description: item.Description
                }))
            }
        };

        console.log("📦 Final PUT Payload:", payload);

        try {
            const response = await axios.put(
                `${BASE_URL}/internal/generate-resume`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("✅ CV updated successfully:", response.data);
        } catch (error) {
            console.error("❌ Failed to update CV:", error.response?.data || error.message);
        }
    };


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-medium text-gray-600 animate-pulse">Loading your cv...</p>
            </div>
        );
    }


    return (
        <div className='flex flex-col justify-center items-center mx-auto'>
            <div className="flex items-center w-full px-4 mt-5 max-w-[1400px]">
                {/* Empty left space */}
                <div className="flex-1" />

                <div className="flex-1 text-center">
                    <h2 className="text-2xl font-semibold uppercase">Curriculum Vitae</h2>
                </div>

                <div className="flex-1 flex justify-end">
                </div>
            </div>

            <div className='flex gap-5 p-5 mt-3 ms-2'>

                <div className='w-[600px]'>

                    {/* Personal Info */}
                    <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${activeSection === 'personalInfo' ? 'border-[#2c6472]' : 'border-gray-300'
                        }`}>
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">Personal Information</h2>
                            <img
                                width="30px"
                                className={`cursor-pointer p-2 rounded-full transition ${activeSection === 'personalInfo' ? 'hover:bg-gray-300' : 'hover:bg-gray-300'
                                    }`}
                                src={activeSection === 'personalInfo' ? save_icon : edit_icon}
                                alt=""
                                onClick={() => {
                                    if (activeSection === 'personalInfo') {
                                        setActiveSection(null);
                                    } else {
                                        setActiveSection('personalInfo');
                                    }
                                }}
                            />
                        </div>

                        <div className="pl-1 text-sm space-y-1.5">
                            {Object.entries(personalInfo).map(([key, value]) => {
                                const isReadOnly = ["Name", "Mail", "Phone"].includes(key);
                                return (
                                    <div key={key} className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-semibold text-gray-700 min-w-[80px]">{key}:</span>
                                        {activeSection === 'personalInfo' ? (
                                            isReadOnly ? (
                                                <p className="text-[#00000082] font-medium">{value}</p>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => handleFieldChange(key, e.target.value)}
                                                    className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1 flex-1"
                                                />
                                            )
                                        ) : (
                                            <p className="text-[#00000082] font-medium">{value}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Professional Summary */}
                    <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${activeSection === 'summary' ? 'border-[#2c6472]' : 'border-gray-300'
                        }`}>
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{professionalSummary.title}</h2>
                            <img
                                width="30px"
                                className={`cursor-pointer p-2 rounded-full transition ${activeSection === 'summary' ? 'hover:bg-gray-300' : 'hover:bg-gray-300'
                                    }`}
                                src={activeSection === 'summary' ? save_icon : edit_icon}
                                alt=""
                                onClick={() => {
                                    if (activeSection === 'summary') {
                                        setActiveSection(null);
                                    } else {
                                        setActiveSection('summary');
                                    }
                                }}
                            />
                        </div>

                        <div className="pl-1 text-sm">
                            {activeSection === 'summary' ? (
                                <textarea
                                    value={professionalSummary.content}
                                    onChange={(e) =>
                                        setProfessionalSummary((prev) => ({
                                            ...prev,
                                            content: e.target.value,
                                        }))
                                    }
                                    className="w-full min-h-[150px] resize-y text-[#00000082] font-medium rounded px-2 py-1 outline-none"
                                />
                            ) : (
                                <p className="text-[#00000082] font-medium whitespace-pre-line">
                                    {professionalSummary.content}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Work Experience */}
                    <div
                        className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${activeSection === 'workExperience' ? 'border-[#2c6472]' : 'border-gray-300'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{workExperience.title}</h2>
                            <img
                                width="30px"
                                className={`cursor-pointer p-2 rounded-full transition ${activeSection === 'workExperience' ? 'hover:bg-gray-300' : 'hover:bg-gray-300'
                                    }`}
                                src={activeSection === 'workExperience' ? save_icon : edit_icon}
                                alt=""
                                onClick={() => {
                                    if (activeSection === 'workExperience') {
                                        setActiveSection(null);
                                    } else {
                                        setActiveSection('workExperience');
                                    }
                                }}
                            />
                        </div>

                        <div className="flex gap-2 flex-wrap my-3">
                            {workExperience.content.map((exp, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedCompanyIdx(idx)}
                                    className={`px-3.5 py-1.5 text-xs border rounded-full ${selectedCompanyIdx === idx
                                        ? 'bg-[#2c6472] text-white border-[#2c6472]'
                                        : 'bg-white text-gray-700 border-gray-300'
                                        }`}
                                >
                                    {exp.Company && exp.Company.trim() !== '' ? exp.Company : `Work ${idx + 1}`}
                                </button>
                            ))}
                        </div>

                        {/* Selected Experience Inputs */}
                        <div className="space-y-2">
                            {/* Role */}
                            <div className="flex items-center">
                                <label className="text-sm font-semibold text-gray-700 min-w-[80px]">Role: </label>
                                {activeSection === 'workExperience' ? (
                                    <input
                                        type="text"
                                        value={workExperience.content[selectedCompanyIdx].Role}
                                        onChange={(e) => {
                                            const updated = [...workExperience.content];
                                            updated[selectedCompanyIdx].Role = e.target.value;
                                            setWorkExperience((prev) => ({ ...prev, content: updated }));
                                        }}
                                        className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1 flex-1"
                                    />
                                ) : (
                                    <p className="text-[#00000082] font-medium">
                                        {workExperience?.content?.[selectedCompanyIdx]?.Role || ''}
                                    </p>
                                )}
                            </div>

                            {/* Company */}
                            <div className="flex items-center mb-3">
                                <label className="text-sm font-semibold text-gray-700 min-w-[80px]">Company: </label>
                                {activeSection === 'workExperience' ? (
                                    <input
                                        type="text"
                                        value={workExperience.content[selectedCompanyIdx].Company}
                                        onChange={(e) => {
                                            const updated = [...workExperience.content];
                                            updated[selectedCompanyIdx].Company = e.target.value;
                                            setWorkExperience((prev) => ({ ...prev, content: updated }));
                                        }}
                                        className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1 flex-1"
                                    />
                                ) : (
                                    <p className="text-[#00000082] font-medium">
                                        {workExperience?.content?.[selectedCompanyIdx]?.Company || ''}
                                    </p>
                                )}
                            </div>

                            {/* Duration */}
                            <div className="flex items-center mb-3">
                                <label className="text-sm font-semibold text-gray-700 min-w-[80px]">Duration: </label>
                                {activeSection === 'workExperience' ? (
                                    <input
                                        type="text"
                                        value={workExperience.content[selectedCompanyIdx].Duration}
                                        onChange={(e) => {
                                            const updated = [...workExperience.content];
                                            updated[selectedCompanyIdx].Duration = e.target.value;
                                            setWorkExperience((prev) => ({ ...prev, content: updated }));
                                        }}
                                        className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1 flex-1"
                                    />
                                ) : (
                                    <p className="text-[#00000082] font-medium">
                                        {workExperience?.content?.[selectedCompanyIdx]?.Duration || ''}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Description: </label>

                                {activeSection === 'workExperience' ? (
                                    <textarea
                                        value={workExperience.content[selectedCompanyIdx].Description.join('\n')}
                                        onChange={(e) => {
                                            const updated = [...workExperience.content];
                                            updated[selectedCompanyIdx].Description = e.target.value.split('\n');
                                            setWorkExperience((prev) => ({ ...prev, content: updated }));
                                        }}
                                        className="w-full min-h-[150px] resize-y rounded px-2 py-1 outline-none text-[#00000082] font-medium"
                                    />
                                ) : (
                                    <ul className="list-disc ml-5 text-gray-700 space-y-0.5">
                                        {workExperience?.content?.[selectedCompanyIdx]?.Description
                                            .filter((line) => line.trim() !== '') // remove empty or whitespace lines
                                            .map((line, i) => (
                                                <li key={i}>{line}</li>
                                            ))}
                                    </ul>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Education */}
                    {education.content.length > 0 && (
                        <div
                            className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${activeSection === 'education' ? 'border-[#2c6472]' : 'border-gray-300'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="font-semibold text-gray-800">{education.title}</h2>
                                <img
                                    width="30px"
                                    className={`cursor-pointer p-2 rounded-full transition ${activeSection === 'education' ? 'hover:bg-gray-300' : 'hover:bg-gray-300'
                                        }`}
                                    src={activeSection === 'education' ? save_icon : edit_icon}
                                    alt=""
                                    onClick={() => {
                                        if (activeSection === 'education') {
                                            setActiveSection(null);
                                        } else {
                                            setActiveSection('education');
                                        }
                                    }}
                                />
                            </div>

                            {/* Education Tabs */}
                            <div className="flex gap-2 flex-wrap my-3">
                                {education.content.map((edu, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedEducationIdx(idx)}
                                        className={`px-3.5 py-1.5 text-xs border rounded-full ${selectedEducationIdx === idx
                                            ? 'bg-[#2c6472] text-white border-[#2c6472]'
                                            : 'bg-white text-gray-700 border-gray-300'
                                            }`}
                                    >
                                        Education {idx + 1}
                                    </button>
                                ))}
                            </div>

                            {/* Single Degree Field */}
                            <div className="pl-1 text-sm space-y-3">
                                {/* Degree */}
                                <div className="flex items-start gap-2">
                                    <label className="text-sm font-semibold text-gray-700 min-w-[110px]">Degree:</label>
                                    {activeSection === 'education' ? (
                                        <input
                                            type="text"
                                            value={education.content[selectedEducationIdx].degree}
                                            onChange={(e) => {
                                                const updated = [...education.content];
                                                updated[selectedEducationIdx].degree = e.target.value;
                                                setEducation(prev => ({ ...prev, content: updated }));
                                            }}
                                            className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                                        />
                                    ) : (
                                        <p className="text-[#00000082] font-medium">{education.content[selectedEducationIdx].degree}</p>
                                    )}
                                </div>

                                {/* Field of Study */}
                                <div className="flex items-start gap-2">
                                    <label className="text-sm font-semibold text-gray-700 min-w-[110px]">Field of Study:</label>
                                    {activeSection === 'education' ? (
                                        <input
                                            type="text"
                                            value={education.content[selectedEducationIdx].field_of_study}
                                            onChange={(e) => {
                                                const updated = [...education.content];
                                                updated[selectedEducationIdx].field_of_study = e.target.value;
                                                setEducation(prev => ({ ...prev, content: updated }));
                                            }}
                                            className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                                        />
                                    ) : (
                                        <p className="text-[#00000082] font-medium">{education.content[selectedEducationIdx].field_of_study}</p>
                                    )}
                                </div>

                                {/* City */}
                                <div className="flex items-start gap-2">
                                    <label className="text-sm font-semibold text-gray-700 min-w-[110px]">City:</label>
                                    {activeSection === 'education' ? (
                                        <input
                                            type="text"
                                            value={education.content[selectedEducationIdx].city}
                                            onChange={(e) => {
                                                const updated = [...education.content];
                                                updated[selectedEducationIdx].city = e.target.value;
                                                setEducation(prev => ({ ...prev, content: updated }));
                                            }}
                                            className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                                        />
                                    ) : (
                                        <p className="text-[#00000082] font-medium">{education.content[selectedEducationIdx].city}</p>
                                    )}
                                </div>

                                {/* End Date */}
                                <div className="flex items-start gap-2">
                                    <label className="text-sm font-semibold text-gray-700 min-w-[110px]">End Date:</label>
                                    {activeSection === 'education' ? (
                                        <input
                                            type="text"
                                            value={education.content[selectedEducationIdx].end_date}
                                            onChange={(e) => {
                                                const updated = [...education.content];
                                                updated[selectedEducationIdx].end_date = e.target.value;
                                                setEducation(prev => ({ ...prev, content: updated }));
                                            }}
                                            className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                                        />
                                    ) : (
                                        <p className="text-[#00000082] font-medium">{education.content[selectedEducationIdx].end_date}</p>
                                    )}
                                </div>

                                {/* Achievements */}
                                <div className="flex flex-col items-start gap-2">
                                    <label className="text-sm font-semibold text-gray-700 min-w-[110px] mb-1">Achievements:</label>
                                    {activeSection === 'education' ? (
                                        <textarea
                                            value={education.content[selectedEducationIdx].achievements}
                                            onChange={(e) => {
                                                const updated = [...education.content];
                                                updated[selectedEducationIdx].achievements = e.target.value;
                                                setEducation(prev => ({ ...prev, content: updated }));
                                            }}
                                            className="w-full outline-none text-[#00000082] font-medium px-2 py-1 rounded-md"
                                            rows={3}
                                        />
                                    ) : (
                                        <p className="text-[#00000082] font-medium whitespace-pre-wrap">{education.content[selectedEducationIdx].achievements}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {projects.content.length > 0 && (
                        <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${activeSection === 'projects' ? 'border-[#2c6472]' : 'border-gray-300'
                            }`}>
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="font-semibold text-gray-800">{projects.title}</h2>
                                <img
                                    width="30px"
                                    className="cursor-pointer p-2 rounded-full hover:bg-gray-300 transition"
                                    src={activeSection === 'projects' ? save_icon : edit_icon}
                                    alt=""
                                    onClick={() =>
                                        setActiveSection(activeSection === 'projects' ? null : 'projects')
                                    }
                                />
                            </div>

                            {/* Project Tabs */}
                            <div className="flex gap-2 flex-wrap my-3">
                                {projects.content.map((proj, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedProjectIdx(idx)}
                                        className={`px-3.5 py-1.5 text-xs border rounded-full ${selectedProjectIdx === idx
                                            ? 'bg-[#2c6472] text-white border-[#2c6472]'
                                            : 'bg-white text-gray-700 border-gray-300'
                                            }`}
                                    >
                                        {proj.Name || `Project ${idx + 1}`}
                                    </button>
                                ))}
                            </div>

                            {/* Selected Project Fields */}
                            {projects.content[selectedProjectIdx] && (
                                <div className="space-y-3">
                                    {["Name", "Company", "Duration", "Skills"].map((field) => (
                                        <div key={field} className="flex items-start gap-2">
                                            <label className="text-sm font-semibold text-gray-700 min-w-[90px]">{field}:</label>
                                            {activeSection === 'projects' ? (
                                                <input
                                                    type="text"
                                                    value={projects.content[selectedProjectIdx][field]}
                                                    onChange={(e) => {
                                                        const updated = [...projects.content];
                                                        updated[selectedProjectIdx][field] = e.target.value;
                                                        setProjects((prev) => ({ ...prev, content: updated }));
                                                    }}
                                                    className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                                                />
                                            ) : (
                                                <p className="text-[#00000082] font-medium">{projects.content[selectedProjectIdx][field]}</p>
                                            )}
                                        </div>
                                    ))}

                                    {/* Description */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-semibold text-gray-700 mb-1">Description: </label>

                                        {activeSection === 'projects' ? (
                                            <textarea
                                                value={projects.content[selectedProjectIdx].Description.join('\n')}
                                                onChange={(e) => {
                                                    const updated = [...projects.content];
                                                    updated[selectedProjectIdx].Description = e.target.value.split('\n');
                                                    setProjects((prev) => ({ ...prev, content: updated }));
                                                }}
                                                className="w-full min-h-[150px] resize-y rounded px-2 py-1 outline-none text-[#00000082] font-medium"
                                            />
                                        ) : (
                                            <ul className="list-disc ml-5 text-gray-700 space-y-0.5">
                                                {projects?.content?.[selectedProjectIdx]?.Description
                                                    .filter((line) => line.trim() !== '') // Skip empty lines
                                                    .map((line, i) => (
                                                        <li key={i}>{line}</li>
                                                    ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Skills */}
                    <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${activeSection === 'skills' ? 'border-[#2c6472]' : 'border-gray-300'
                        }`}>
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{skills.title}</h2>
                            <img
                                width="30px"
                                className="cursor-pointer p-2 rounded-full transition hover:bg-gray-300"
                                src={activeSection === 'skills' ? save_icon : edit_icon}
                                alt=""
                                onClick={() => {
                                    if (activeSection === 'skills') {
                                        // Optional: Remove empty or whitespace-only entries on save
                                        const cleanedSkills = skills.content.filter(skill => skill.trim() !== '');
                                        setSkills({ ...skills, content: cleanedSkills });
                                        setActiveSection(null);
                                    } else {
                                        setActiveSection('skills');
                                    }
                                }}
                            />
                        </div>

                        <div className="pl-1 text-sm flex flex-wrap gap-2">
                            {activeSection === 'skills' ? (
                                skills.content.map((skill, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        value={skill}
                                        onChange={(e) => {
                                            const updatedSkills = [...skills.content];
                                            updatedSkills[idx] = e.target.value;
                                            setSkills({ ...skills, content: updatedSkills });
                                        }}
                                        className="border outline-none rounded px-2 py-1 text-[#00000082] font-medium"
                                    />
                                ))
                            ) : (
                                <p className="text-[#00000082] font-medium">
                                    {skills.content.filter(s => s.trim() !== '').join(', ')}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Languages */}
                    <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${activeSection === 'languages' ? 'border-[#2c6472]' : 'border-gray-300'
                        }`}>
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{languages.title}</h2>
                            <img
                                width="30px"
                                className="cursor-pointer p-2 rounded-full transition hover:bg-gray-300"
                                src={activeSection === 'languages' ? save_icon : edit_icon}
                                alt=""
                                onClick={() => {
                                    if (activeSection === 'languages') {
                                        const cleaned = languages.content.filter(l => l.trim() !== '');
                                        setLanguages({ ...languages, content: cleaned });
                                        setActiveSection(null);
                                    } else {
                                        setActiveSection('languages');
                                    }
                                }}
                            />
                        </div>

                        <div className="pl-1 text-sm space-y-3">
                            {activeSection === 'languages' ? (
                                languages.content.map((langObj, idx) => (
                                    <div key={idx} className="flex gap-5">
                                        <input
                                            type="text"
                                            placeholder="Language"
                                            value={langObj.language}
                                            onChange={(e) => {
                                                const updated = [...languages.content];
                                                updated[idx].language = e.target.value;
                                                setLanguages({ ...languages, content: updated });
                                            }}
                                            className="w-[45%] outline-none border rounded px-2 py-1 text-[#00000082] font-medium"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Proficiency (e.g., fluent)"
                                            value={langObj.proficiency}
                                            onChange={(e) => {
                                                const updated = [...languages.content];
                                                updated[idx].proficiency = e.target.value;
                                                setLanguages({ ...languages, content: updated });
                                            }}
                                            className="w-[45%] outline-none border rounded px-2 py-1 text-[#00000082] font-medium"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="text-[#00000082] font-medium space-y-1">
                                    {languages.content.length > 0 ? (
                                        languages.content.map((langObj, idx) => (
                                            <p key={idx}>
                                                {langObj.language} — <span className="italic">{langObj.proficiency}</span>
                                            </p>
                                        ))
                                    ) : (
                                        <p className="italic text-gray-400">No languages added</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Certificates */}
                    <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${activeSection === 'certificates' ? 'border-[#2c6472]' : 'border-gray-300'
                        }`}>
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{certificates.title}</h2>
                            <img
                                width="30px"
                                className={`cursor-pointer p-2 rounded-full transition ${activeSection === 'skills' ? 'hover:bg-gray-300' : 'hover:bg-gray-300'
                                    }`}
                                src={activeSection === 'certificates' ? save_icon : edit_icon}
                                alt=""
                                onClick={() => {
                                    if (activeSection === 'certificates') {
                                        setActiveSection(null);
                                    } else {
                                        setActiveSection('certificates');
                                    }
                                }}
                            />
                        </div>

                        <div className="pl-1 text-sm space-y-3">
                            {certificates.content.map((item, index) => (
                                <div key={index} className="flex gap-5">
                                    {activeSection === 'certificates' ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Certificate Name"
                                                value={item.certificate_name}
                                                onChange={(e) => {
                                                    const updated = [...certificates.content];
                                                    updated[index].certificate_name = e.target.value;
                                                    setCertificates((prev) => ({ ...prev, content: updated }));
                                                }}
                                                className="w-[45%] border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Provider"
                                                value={item.provider}
                                                onChange={(e) => {
                                                    const updated = [...certificates.content];
                                                    updated[index].provider = e.target.value;
                                                    setCertificates((prev) => ({ ...prev, content: updated }));
                                                }}
                                                className="w-[45%] border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                                            />
                                        </>
                                    ) : (
                                        <p className="text-[#00000082] font-medium">
                                            {item.certificate_name}
                                            {item.provider && (
                                                <span className="text-gray-500 italic"> — {item.provider}</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='bg-white p-5 border border-gray-300 rounded-lg'>
                        <h1 className='flex font-medium text-lg'>Templates</h1>

                        <p className='text-center font-medium my-2'>Pick your favourite CV Template</p>


                        <div className="flex flex-wrap gap-4 mt-5 justify-center">
                            {Object.entries(templates).map(([name, Template]) => {
                                if (name === selectedTemplate) return null;

                                return (

                                    <div
                                        key={name}
                                        className="cursor-pointer border rounded hover:shadow-lg hover:border-[#2C6472] transition duration-200 bg-white w-[200px]   overflow-hidden"
                                        onClick={() => setSelectedTemplate(name)}
                                    >
                                        {/* 🔍 Container for scaled template */}
                                        <div className="w-full h-[280px] overflow-hidden relative bg-white">
                                            {/* Template scaled and positioned */}
                                            <div
                                                className="absolute top-0 left-0"
                                                style={{
                                                    transform: "scale(0.25)",
                                                    transformOrigin: "top left",
                                                    width: "794px",
                                                    height: "1123px",
                                                }}
                                            >
                                                <div className="bg-white w-[794px] h-[1123px] shadow">
                                                    <Template
                                                        personalInfo={personalInfo}
                                                        professionalSummary={professionalSummary}
                                                        workExperience={workExperience}
                                                        education={education}
                                                        projects={projects}
                                                        skills={skills}
                                                        languages={languages}
                                                        certificates={certificates}
                                                        language={language}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* 👇 Template name below */}
                                        <div className="text-center text-sm py-2 bg-[#3f6068] text-white font-semibold">
                                            {name}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>



                </div>

                <div className="w-[60%] flex flex-col gap-8">

                    {/* 🖥️ MAIN BIG CV PREVIEW */}
                    <div ref={previewRef} className="min-h-[1123px] w-[794px] bg-white shadow border">
                        <SelectedTemplate
                            personalInfo={personalInfo}
                            professionalSummary={professionalSummary}
                            workExperience={workExperience}
                            education={education}
                            projects={projects}
                            skills={skills}
                            languages={languages}
                            certificates={certificates}
                            language={language} // 👈 Add this line

                        />
                    </div>



                    {/* 🎯 Download Button */}
                    <div className="flex w-[794px] justify-end">
                        <button
                            onClick={() => {
                                handleDownload();
                                handleUpdateCV();
                                setActiveSection(null);
                                setTimeout(() => navigate(-1), 800);
                            }}
                            className="bg-[#2c6472] text-white px-8 py-1.5 rounded-lg"
                        >
                            Download & Finish Editing
                        </button>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default Cv
