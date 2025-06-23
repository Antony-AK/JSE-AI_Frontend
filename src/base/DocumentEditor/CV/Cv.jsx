import React, { useState, useRef } from 'react'
import download_icon from '../../../assets/download.svg'
import edit_icon from '../../../assets/edit-icon.svg'
import ModernDeedy from './ModernDeedy';
import html2pdf from 'html2pdf.js';

const Cv = () => {

    const [selectedCompanyIdx, setSelectedCompanyIdx] = useState(0);
    const [selectedProjectIdx, setSelectedProjectIdx] = useState(0);
    const [selectedEducationIdx, setSelectedEducationIdx] = useState(0);

    const previewRef = useRef();

    const handleDownload = () => {
        const element = previewRef.current;
        if (!element) return;

        const opt = {
            margin:       0,
            filename:     'ModernDeedy_CV.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'px', format: [794, 1123], orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    const [activeSection, setActiveSection] = useState(null);

    const handleFieldChange = (key, value) => {
    setPersonalInfo((prev) => ({
        ...prev,
        [key]: value,
    }));
    };

    const [personalInfo, setPersonalInfo] = useState({
        Name: "Alex Johnson",
        Title: "Software Engineer",
        Mail: "Ramani.mallempuri@gmail.com",
        Phone: "‪+49 17624931591‬",
        LinkedIn: "www.linkedin.com/alex",
        Portfolio: "www.reallygreatsite.com",
        Address: "Prenzlauer Allee 172, Berlin 10409"
    }); 
    
    const [professionalSummary, setProfessionalSummary] = useState({
        title: "Professional Summary",
        content: "Experienced Software Engineer with expertise in Golang, React, PostgreSQL, Docker, Python, and AI/ML. Skilled in Project Management, Teamwork, and Effective Communication. Led full-stack development at TechCorp and built REST APIs at StartUpXYZ. Seeking to contribute to deployment, automation, and security at a cloud software company."
    })

    const [workExperience, setWorkExperience] = useState({
        title: "Work Experience",
        content: [
            {
                Role: "Software Engineer",
                Company: "TechCorp",
                Duration: "07/2019 - 06/2023",
                Description: "Led full-stack development for a SaaS platform at TechCorp, implementing Golang, React, PostgreSQL, Docker, and Python. Managed project timelines, coordinated with cross-functional teams, and ensured effective communication throughout the development process."
            },
            {
                Role: "Backend Developer",
                Company: "StartUpXYZ",
                Duration: "10/2018 - 12/2019",
                Description: "Built REST APIs and microservices at StartUpXYZ using Golang, Docker, and PostgreSQL. Collaborated with front-end developers to integrate backend functionality, ensuring smooth performance and scalability of the application."
            }
        ]
    });

    const [education, setEducation] = useState({
        title: "Education",
        content: [
            {
                degree: "Masters of Computer Science Engineering",
                university: "BORCELLE UNIVERSITY",
                duration: "2029 - 2030",
                idxLabel: "Masters"
            },
            {
                degree: "Bachelors of Computer Science Engineering",
                university: "BORCELLE UNIVERSITY",
                duration: "2025 - 2029",
                idxLabel: "Bachelors"
            }
        ]
    });

    const [projects, setProjects] = useState({
        title: "Projects",
        content: [
            {
                Name: "Automated Spear-Phisher",
                Company: "POSTECH",
                Duration: "Jun 2010 - Jun 2017",
                Skills: "Python, PySpark, Selenium, Apache, NLP, Big Data",
                Description: "Developed a security research tool at POSTECH to send targeted spam messages on social media platforms. Utilized Python, PySpark, and NLP techniques to analyze target feeds and enhance message effectiveness. Implemented Big Data tools for data processing and automation."
            },
            {
                Name: "Image Repository",
                Company: "POSTECH",
                Duration: "Sep 2010 - Oct 2011",
                Skills: "Java, PHP, React, TypeScript, Maven, GCP, MySQL",
                Description: "Created a full-stack image repository at POSTECH with CP-ABE encryption for file security. Developed a GCP cloud function for encryption implementation. Utilized Java, PHP, React, and MySQL to build a user-friendly interface for file storage."
            }
        ]
    });

    const [certificates, setCertificates] = useState({
        title: "Certificates",
        content: [
            { Name: "AWS Certified Developer" },
            { Name: "ML Certified Developer" }
        ]
    });

    const [skills, setSkills] = useState({
        title: "Skills",
        content: [
            { name: "Golang", level: "Advanced" },
            { name: "Python", level: "Advanced" },
            { name: "Docker", level: "Advanced" },
            { name: "React", level: "Intermediate" },
            { name: "PostgreSQL", level: "Intermediate" }
        ]
    });

    const [languages, setLanguages] = useState({
        title: "Languages",
        content: {
            Fluent: ["English", "French"],
            Basics: ["German", "Spanish"]
        }
    });

    return (
        <>
            <div className="flex items-center w-full px-4 mt-5">
                {/* Empty left space */}
                <div className="flex-1" />

                <div className="flex-1 text-center">
                    <h2 className="text-xl font-semibold">CV</h2>
                </div>

                <div className="flex-1 flex justify-end">
                    <button onClick={handleDownload} className="flex items-center gap-4 bg-[#2c6472] px-8 py-1.5 rounded-lg">
                        <img width="12px" src={download_icon} alt=" " />
                        <p className="text-white text-sm">Download</p>
                    </button>
                </div>
            </div>

            <div className='w-full flex gap-5 p-5'>

                <div className='w-[40%]'>

                    {/* Personal Info */}
                    <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${
                    activeSection === 'personalInfo' ? 'border-[#2c6472]' : 'border-gray-300'
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="font-semibold text-gray-800">Personal Information</h2>
                        <img width="12px" className='cursor-pointer' src={edit_icon} alt="" onClick={() => setActiveSection('personalInfo')} />
                    </div>

                    <div className="pl-1 text-sm space-y-1.5">
                        {Object.entries(personalInfo).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-700 min-w-[80px]">{key}:</span>
                            {activeSection === 'personalInfo' ? (
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleFieldChange(key, e.target.value)}
                                className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1 flex-1"
                            />
                            ) : (
                            <p className="text-[#00000082] font-medium">{value}</p>
                            )}
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* Professional Summary */}
                    <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${
                    activeSection === 'summary' ? 'border-[#2c6472]' : 'border-gray-300'
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="font-semibold text-gray-800">{professionalSummary.title}</h2>
                        <img
                        width="12px"
                        src={edit_icon}
                        alt=""
                        onClick={() => setActiveSection('summary')}
                        className="cursor-pointer"
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
                        className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${
                            activeSection === 'workExperience' ? 'border-[#2c6472]' : 'border-gray-300'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{workExperience.title}</h2>
                            <img
                            width="12px"
                            src={edit_icon}
                            alt="Edit"
                            onClick={() => setActiveSection('workExperience')}
                            className="cursor-pointer"
                            />
                        </div>

                        <div className="flex gap-2 flex-wrap mb-3">
                            {workExperience.content.map((exp, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedCompanyIdx(idx)}
                                className={`px-3 py-1 text-xs border rounded-full ${
                                selectedCompanyIdx === idx
                                    ? 'bg-[#2c6472] text-white border-[#2c6472]'
                                    : 'bg-white text-gray-700 border-gray-300'
                                }`}
                            >
                                {exp.Company}
                            </button>
                            ))}
                        </div>

                        {/* Selected Experience Inputs */}
                        <div className="space-y-2">
                        {/* Role */}
                        <div className="flex items-center mb-3">
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
                            <p className="text-[#00000082] font-medium">{workExperience.content[selectedCompanyIdx].Role}</p>
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
                            <p className="text-[#00000082] font-medium">{workExperience.content[selectedCompanyIdx].Company}</p>
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
                            <p className="text-[#00000082] font-medium">{workExperience.content[selectedCompanyIdx].Duration}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-1">Description: </label>
                            {activeSection === 'workExperience' ? (
                            <textarea
                                value={workExperience.content[selectedCompanyIdx].Description}
                                onChange={(e) => {
                                const updated = [...workExperience.content];
                                updated[selectedCompanyIdx].Description = e.target.value;
                                setWorkExperience((prev) => ({ ...prev, content: updated }));
                                }}
                                className="w-full min-h-[150px] resize-y rounded px-2 py-1 outline-none text-[#00000082] font-medium"
                            />
                            ) : (
                            <p className="text-[#00000082] font-medium whitespace-pre-line">
                                {workExperience.content[selectedCompanyIdx].Description}
                            </p>
                            )}
                        </div>
                        </div>
                    </div>

                {/* Education */}
                    <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${
                    activeSection === 'education' ? 'border-[#2c6472]' : 'border-gray-300'
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="font-semibold text-gray-800">{education.title}</h2>
                        <img width="12px" className='cursor-pointer' src={edit_icon} alt="" onClick={() => setActiveSection('education')} />
                    </div>

                    {/* Education Tabs */}
                    <div className="flex gap-2 flex-wrap mb-3">
                        {education.content.map((edu, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedEducationIdx(idx)}
                            className={`px-3 py-1 text-xs border rounded-full ${
                            selectedEducationIdx === idx
                                ? 'bg-[#2c6472] text-white border-[#2c6472]'
                                : 'bg-white text-gray-700 border-gray-300'
                            }`}
                        >
                            {edu.idxLabel}
                        </button>
                        ))}
                    </div>

                    {/* Selected Education Entry */}
                    <div className="pl-1 text-sm space-y-3">
                        {/* Degree */}
                        <div className="flex items-start gap-2">
                        <label className="text-sm font-semibold text-gray-700 min-w-[80px]">Degree:</label>
                        {activeSection === 'education' ? (
                            <input
                            type="text"
                            value={education.content[selectedEducationIdx].degree}
                            onChange={(e) => {
                                const newEdu = [...education.content];
                                newEdu[selectedEducationIdx].degree = e.target.value;
                                setEducation(prev => ({ ...prev, content: newEdu }));
                            }}
                            className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                            />
                        ) : (
                            <p className="text-[#00000082] font-medium">{education.content[selectedEducationIdx].degree}</p>
                        )}
                        </div>

                        {/* University */}
                        <div className="flex items-start gap-2">
                        <label className="text-sm font-semibold text-gray-700 min-w-[80px]">University:</label>
                        {activeSection === 'education' ? (
                            <input
                            type="text"
                            value={education.content[selectedEducationIdx].university}
                            onChange={(e) => {
                                const newEdu = [...education.content];
                                newEdu[selectedEducationIdx].university = e.target.value;
                                setEducation(prev => ({ ...prev, content: newEdu }));
                            }}
                            className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                            />
                        ) : (
                            <p className="text-[#00000082] font-medium">{education.content[selectedEducationIdx].university}</p>
                        )}
                        </div>

                        {/* Duration */}
                        <div className="flex items-start gap-2">
                        <label className="text-sm font-semibold text-gray-700 min-w-[80px]">Duration:</label>
                        {activeSection === 'education' ? (
                            <input
                            type="text"
                            value={education.content[selectedEducationIdx].duration}
                            onChange={(e) => {
                                const newEdu = [...education.content];
                                newEdu[selectedEducationIdx].duration = e.target.value;
                                setEducation(prev => ({ ...prev, content: newEdu }));
                            }}
                            className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                            />
                        ) : (
                            <p className="text-[#00000082] font-medium">{education.content[selectedEducationIdx].duration}</p>
                        )}
                        </div>
                    </div>
                    </div>

                {/* Projects */}
                    <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${
                        activeSection === 'projects' ? 'border-[#2c6472]' : 'border-gray-300'
                    }`}>
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{projects.title}</h2>
                            <img width="12px" className='cursor-pointer' src={edit_icon} alt="" onClick={() => setActiveSection('projects')} />
                        </div>

                        {/* Project Tabs */}
                        <div className="flex gap-2 flex-wrap mb-3">
                            {projects.content.map((proj, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedProjectIdx(idx)}
                                    className={`px-3 py-1 text-xs border rounded-full ${
                                        selectedProjectIdx === idx
                                            ? 'bg-[#2c6472] text-white border-[#2c6472]'
                                            : 'bg-white text-gray-700 border-gray-300'
                                    }`}
                                >
                                    {proj.Name}
                                </button>
                            ))}
                        </div>

                        {/* Selected Project Details */}
                        <div className="space-y-3">
                            {/* Name */}
                            <div className="flex items-start gap-2">
                                <label className="text-sm font-semibold text-gray-700 min-w-[90px]">Name:</label>
                                {activeSection === 'projects' ? (
                                    <input
                                        type="text"
                                        value={projects.content[selectedProjectIdx].Name}
                                        onChange={(e) => {
                                            const updated = [...projects.content];
                                            updated[selectedProjectIdx].Name = e.target.value;
                                            setProjects(prev => ({ ...prev, content: updated }));
                                        }}
                                        className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                                    />
                                ) : (
                                    <p className="text-[#00000082] font-medium">{projects.content[selectedProjectIdx].Name}</p>
                                )}
                            </div>

                            {/* Company */}
                            <div className="flex items-start gap-2">
                                <label className="text-sm font-semibold text-gray-700 min-w-[90px]">Company:</label>
                                {activeSection === 'projects' ? (
                                    <input
                                        type="text"
                                        value={projects.content[selectedProjectIdx].Company}
                                        onChange={(e) => {
                                            const updated = [...projects.content];
                                            updated[selectedProjectIdx].Company = e.target.value;
                                            setProjects(prev => ({ ...prev, content: updated }));
                                        }}
                                        className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                                    />
                                ) : (
                                    <p className="text-[#00000082] font-medium">{projects.content[selectedProjectIdx].Company}</p>
                                )}
                            </div>

                            {/* Duration */}
                            <div className="flex items-start gap-2">
                                <label className="text-sm font-semibold text-gray-700 min-w-[90px]">Duration:</label>
                                {activeSection === 'projects' ? (
                                    <input
                                        type="text"
                                        value={projects.content[selectedProjectIdx].Duration}
                                        onChange={(e) => {
                                            const updated = [...projects.content];
                                            updated[selectedProjectIdx].Duration = e.target.value;
                                            setProjects(prev => ({ ...prev, content: updated }));
                                        }}
                                        className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                                    />
                                ) : (
                                    <p className="text-[#00000082] font-medium">{projects.content[selectedProjectIdx].Duration}</p>
                                )}
                            </div>

                            {/* Skills */}
                            <div className="flex items-start gap-2">
                                <label className="text-sm font-semibold text-gray-700 min-w-[90px]">Skills:</label>
                                {activeSection === 'projects' ? (
                                    <input
                                        type="text"
                                        value={projects.content[selectedProjectIdx].Skills}
                                        onChange={(e) => {
                                            const updated = [...projects.content];
                                            updated[selectedProjectIdx].Skills = e.target.value;
                                            setProjects(prev => ({ ...prev, content: updated }));
                                        }}
                                        className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                                    />
                                ) : (
                                    <p className="text-[#00000082] font-medium">{projects.content[selectedProjectIdx].Skills}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Description:</label>
                                {activeSection === 'projects' ? (
                                    <textarea
                                        value={projects.content[selectedProjectIdx].Description}
                                        onChange={(e) => {
                                            const updated = [...projects.content];
                                            updated[selectedProjectIdx].Description = e.target.value;
                                            setProjects(prev => ({ ...prev, content: updated }));
                                        }}
                                        rows={4}
                                        className="w-full min-h-[120px] rounded px-2 py-1 text-[#00000082] font-medium outline-none resize-y"
                                    />
                                ) : (
                                    <p className="text-[#00000082] font-medium whitespace-pre-wrap">
                                        {projects.content[selectedProjectIdx].Description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                {/* Skills */}
                    <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${
                    activeSection === 'skills' ? 'border-[#2c6472]' : 'border-gray-300'
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="font-semibold text-gray-800">{skills.title}</h2>
                        <img width="12px" className='cursor-pointer' src={edit_icon} alt="" onClick={() => setActiveSection('skills')} />
                    </div>

                    <div className="pl-1 text-sm flex flex-col gap-2">
                        {["Advanced", "Intermediate", "Beginner"].map((level) => {
                        const filteredSkills = skills.content.filter(skill => skill.level === level);
                        if (filteredSkills.length === 0) return null;

                        return (
                            <div key={level} className="flex items-center gap-2">
                            <label className="font-semibold min-w-[100px]">{level}:</label>
                            {activeSection === 'skills' ? (
                                <input
                                type="text"
                                value={filteredSkills.map(skill => skill.name).join(', ')}
                                onChange={(e) => {
                                    const updatedNames = e.target.value.split(',').map(s => s.trim());
                                    const newSkills = skills.content
                                    .filter(skill => skill.level !== level)
                                    .concat(updatedNames.map(name => ({ name, level })))
                                    .filter(skill => skill.name); // remove blanks
                                    setSkills(prev => ({ ...prev, content: newSkills }));
                                }}
                                className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                                />
                            ) : (
                                <p className="text-[#00000082] font-medium">{filteredSkills.map(skill => skill.name).join(', ')}</p>
                            )}
                            </div>
                        );
                        })}
                    </div>
                    </div>

                {/* Languages */}
                    <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${
                    activeSection === 'languages' ? 'border-[#2c6472]' : 'border-gray-300'
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="font-semibold text-gray-800">{languages.title}</h2>
                        <img width="12px" className='cursor-pointer' src={edit_icon} alt="" onClick={() => setActiveSection('languages')} />
                    </div>

                    <div className="pl-1 text-sm space-y-1.5">
                        {Object.entries(languages.content).map(([level, langs], idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <span className="font-semibold text-sm min-w-[80px]">{level}:</span>
                            {activeSection === 'languages' ? (
                            <input
                                type="text"
                                value={langs.join(', ')}
                                onChange={(e) => {
                                const updated = { ...languages.content };
                                updated[level] = e.target.value.split(',').map(l => l.trim());
                                setLanguages(prev => ({ ...prev, content: updated }));
                                }}
                                className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                            />
                            ) : (
                            <p className="text-[#00000082] font-medium">{langs.join(', ')}</p>
                            )}
                        </div>
                        ))}
                    </div>
                    </div>

                {/* Certificates */}
                    <div className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${
                    activeSection === 'certificates' ? 'border-[#2c6472]' : 'border-gray-300'
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="font-semibold text-gray-800">{certificates.title}</h2>
                        <img width="12px" className='cursor-pointer' src={edit_icon} alt="" onClick={() => setActiveSection('certificates')} />
                    </div>

                    <div className="pl-1 text-sm space-y-3">
                        {certificates.content.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            
                            {activeSection === 'certificates' ? (
                            <input
                                type="text"
                                value={item.Name}
                                onChange={(e) => {
                                const updated = [...certificates.content];
                                updated[index].Name = e.target.value;
                                setCertificates((prev) => ({ ...prev, content: updated }));
                                }}
                                className="w-full border-b border-gray-300 outline-none text-[#00000082] font-medium px-1"
                            />
                            ) : (
                            <p className="text-[#00000082] font-medium">{item.Name}</p>
                            )}
                        </div>
                        ))}
                    </div>
                    </div>                                       
                    
                </div>

                <div className="w-[60%] flex flex-col gap-8">

                    <div ref={previewRef} className="h-[1123px] w-[794px] flex bg-white">

                        <ModernDeedy
                            personalInfo={personalInfo}
                            professionalSummary={professionalSummary}
                            workExperience={workExperience}
                            education={education}
                            projects={projects}
                            skills={skills}
                            languages={languages}
                            certificates={certificates}
                        />

                    </div>

                    <div className="flex w-[794px] justify-end">
                        <button className="bg-[#2c6472] text-white px-8 py-1.5 rounded-2xl">
                            Finish Editing
                        </button>
                    </div>

                </div>


            </div>
        </>
    )
}

export default Cv
