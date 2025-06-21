import React from 'react'

const Cv = () => {

    const dummyCVData = {
        personalInfo: {
            title: "Personal Information",
            content: {
                Name: "Steve",
                "Date of Birth": "05 May 1998",
                Email: "steve@email.com",
                LinkedIn: "linkedin.com/in/steve-uiux"
            }
        },
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
            highlight: true
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
        dummyCVData.personalInfo,
        dummyCVData.professionalSummary,
        dummyCVData.workExperience,
        dummyCVData.education,
        dummyCVData.projects,
        dummyCVData.skills,
        dummyCVData.languages,
        dummyCVData.certificates
    ];



    return (
        <div className='w-full flex gap-5 p-5'>
            <div className='w-[50%]'>
            {sections.map((section, index) => (
                <div
                    key={index}
                    className={`border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 relative ${section.highlight ? 'border-2 border-[#2c6472]' : ''
                        }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="font-semibold text-gray-800">{section.title}</h2>
                        <button className="text-[#2c6472] text-sm font-medium">✎</button>
                    </div>

                    <div className="pl-1 text-sm space-y-1.5">
                        {Array.isArray(section.content)
                            ? section.content.map((line, i) =>
                                typeof line === "string" ? (
                                    <p key={i}>{line}</p>
                                ) : (
                                    <p key={i}>
                                        {line.Name}<br />{line.Duration}
                                    </p>
                                )
                            )
                            : typeof section.content === "string"
                                ? <p>{section.content}</p>
                                : Object.entries(section.content).map(([key, value]) => (
                                    <p key={key}>
                                        {key}: {value}
                                    </p>
                                ))
                        }
                    </div>
                </div>
            ))}
            </div>

            <div className="w-[50%] h-[842px] flex bg-white">

            </div>


        </div>
    )
}

export default Cv
