import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { BASE_URL } from '../../../utils/api'
import download_icon from '../../../assets/download.svg'
import edit_icon from '../../../assets/edit-icon.svg'
import PersonalnfoUpdateForm from './PersonalnfoUpdateForm';

const Cv = () => {

    const apiUrl = `${BASE_URL}/personal-info`;
    
    const token = sessionStorage.getItem('authToken');

    const [personalInfoData, setPersonalInfoData] = useState({
        first_name: '',
        second_name: '',
        email: '',
        phone: '',
        linkedin_profile: ''
    });
    
    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Safely extract data
                let info = {};

                if (Array.isArray(response.data)) {
                    info = response.data[0] || {};
                } else if (Array.isArray(response.data?.personal_info)) {
                    info = response.data.personal_info[0] || {};
                } else if (typeof response.data?.personal_info === 'object') {
                    info = response.data.personal_info;
                } else if (typeof response.data === 'object') {
                    info = response.data;
                }

                setPersonalInfoData({
                    first_name: info.first_name || '',
                    second_name: info.second_name || '',
                    email: info.email || '',
                    phone: info.phone || '',
                    linkedin_profile: info.linkedin_profile || ''
                });

            } catch (error) {
                console.error('❌ Error fetching personal info:', error);
            }
        };

        fetchPersonalInfo();
    }, []);

    const dummyCVData = {
        professionalSummary: {
            title: "Professional Summary",
            content: `Creative UI/UX Designer with 5+ years of experience crafting intuitive and user-friendly digital experiences, skilled in Figma, Adobe XD, and responsive design.`
        },
        workExperience: {
            title: "Work Experience",
            content: {
                Role: "UI/UX Designer",
                Company: "Accenture",
                Duration: "2 June 2024 - 18 September 2025"
            }
        },
        education: {
            title: "Education",
            content: {
                "Degree Title": "Bachelor of Engineering",
                "Institution Name": "Francis Xavier Engineering College",
                "Field of Study": "Computer Science",
                Duration: "22 June 2022 - 18 May 2026"
            },

        },
        projects: {
            title: "Projects",
            content: {
                Name: "Job Portal",
                Company: "Accenture",
                Duration: "2 June 2024 - 18 September 2025"
            }
        },
        skills: {
            title: "Skills",
            content: ["Photoshop", "Figma", "Canva"]
        },
        languages: {
            title: "Languages",
            content: ["Germany"]
        },
        certificates: {
            title: "Certificates & Awards",
            content: [
                {
                    Name: "Product Designer Course Zoho",
                    Duration: "2 June 2024 - 18 September 2025"
                },
                {
                    Name: "TCS Web Development Course",
                    Duration: "2 June 2024 - 18 September 2025"
                }
            ]
        }
    };

    const sections = [
        dummyCVData.professionalSummary,
        dummyCVData.workExperience,
        dummyCVData.education,
        dummyCVData.projects,
        dummyCVData.skills,
        dummyCVData.languages,
        dummyCVData.certificates
    ];

    const { professionalSummary } = dummyCVData;
    const { workExperience } = dummyCVData;
    const { education } = dummyCVData;
    const { projects } = dummyCVData;
    const { skills } = dummyCVData;
    const { languages } = dummyCVData;
    const { certificates } = dummyCVData;

    const [personalinfoPopup, setPersonalInfoPopup] = useState(false);

    const handlePersonalInfoPopup = () => setPersonalInfoPopup(true);

    const handleClose = () => {
        setPersonalInfoPopup(false);
    };

    return (
        <>
            <div className="flex items-center w-full px-4 mt-5">
                {/* Empty left space */}
                <div className="flex-1" />

                <div className="flex-1 text-center">
                    <h2 className="text-xl font-semibold">CV</h2>
                </div>

                <div className="flex-1 flex justify-end">
                    <button className="flex items-center gap-4 bg-[#2c6472] px-8 py-1.5 rounded-lg">
                        <img width="12px" src={download_icon} alt=" " />
                        <p className="text-white text-sm">Download</p>
                    </button>
                </div>
            </div>

            <div className='w-full flex gap-5 p-5'>

                <div className='w-[50%]'>

                    {/* Personal Info */}
                    <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative border-2 border-[#2c6472]">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">Personal Information</h2>
                            <img width="12px" onClick={handlePersonalInfoPopup} src={edit_icon} alt="" />
                        </div>

                        <div className="pl-1 text-sm space-y-1.5">
                            <p className="text-[#00000082] font-medium">Name: {personalInfoData.first_name} {personalInfoData.second_name}</p>
                            <p className="text-[#00000082] font-medium">Email: {personalInfoData.email}</p>
                            <p className="text-[#00000082] font-medium">Phone: {personalInfoData.phone}</p>
                            <p className="text-[#00000082] font-medium">LinkedIn: {personalInfoData.linkedin_profile}</p>
                        </div>
                    </div>
                    
                    {/* Professional Summary */}
                    <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{professionalSummary.title}</h2>
                            <img width="12px" src={edit_icon} alt="" />
                        </div>

                        <div className="pl-1 text-sm space-y-1.5">
                            <p className="text-[#00000082] font-medium">
                                {professionalSummary.content}
                            </p>
                        </div>
                    </div>

                    {/* Work Experience */}
                    <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{workExperience.title}</h2>
                            <img width="12px" src={edit_icon} alt="" />
                        </div>

                        <div className="pl-1 text-sm space-y-1.5">
                            {Object.entries(workExperience.content).map(([key, value], index) => (
                            <p key={index} className="text-[#00000082] font-medium">
                                {key}: {value}
                            </p>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{education.title}</h2>
                            <img width="12px" src={edit_icon} alt="" />
                        </div>

                        <div className="pl-1 text-sm space-y-1.5">
                            {Object.entries(education.content).map(([key, value], index) => (
                            <p key={index} className="text-[#00000082] font-medium">
                                {key}: {value}
                            </p>
                            ))}
                        </div>
                    </div>

                    {/* Projects */}
                    <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{projects.title}</h2>
                            <img width="12px" src={edit_icon} alt="" />
                        </div>

                        <div className="pl-1 text-sm space-y-1.5">
                            {Object.entries(projects.content).map(([key, value], index) => (
                            <p key={index} className="text-[#00000082] font-medium">
                                {key}: {value}
                            </p>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{skills.title}</h2>
                            <img width="12px" src={edit_icon} alt="" />
                        </div>

                        <div className="pl-1 text-sm space-y-1.5">
                            {skills.content.map((skill, index) => (
                            <p key={index} className="text-[#00000082] font-medium">{skill}</p>
                            ))}
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{languages.title}</h2>
                            <img width="12px" src={edit_icon} alt="" />
                        </div>

                        <div className="pl-1 text-sm space-y-1.5">
                            {languages.content.map((skill, index) => (
                            <p key={index} className="text-[#00000082] font-medium">{skill}</p>
                            ))}
                        </div>
                    </div>

                    {/* Certificates */}
                    <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="font-semibold text-gray-800">{certificates.title}</h2>
                            <img width="12px" src={edit_icon} alt="" />
                        </div>

                        <div className="pl-1 text-sm space-y-3">
                            {certificates.content.map((item, index) => (
                            <div key={index} className="space-y-1">
                                {Object.entries(item).map(([key, value], subIndex) => (
                                <p key={subIndex} className="text-[#00000082] font-medium flex">
                                    {key}:{value}
                                </p>
                                ))}
                            </div>
                            ))}
                        </div> 
                    </div>
                                       
                    
                </div>

                <div className="w-[50%] flex flex-col gap-5">

                    <div className="h-[842px] flex bg-white">

                    </div>

                    <div className="flex justify-end">
                        <button className="bg-[#2c6472] text-white px-8 py-1.5 rounded-2xl">
                            Done
                        </button>
                    </div>

                </div>


            </div>

            {personalinfoPopup && <PersonalnfoUpdateForm onclose={handleClose} />}
        </>
    )
}

export default Cv
