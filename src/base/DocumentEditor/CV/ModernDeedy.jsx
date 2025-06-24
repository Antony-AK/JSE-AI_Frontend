import React from 'react'

const ModernDeedy = ({ personalInfo, professionalSummary, workExperience, education, projects, skills, languages, certificates }) => {

  return (
    <div className='flex flex-col gap-2 px-6 pt-5 w-full h-full'>

        {/* Header */}
        <div className="text-center">
            {/* Name */}
            <h1 className="text-3xl font-bold tracking-wide text-purple-500">{personalInfo.Name}</h1>

            <p className='text-[#2c6474] font-medium'>{personalInfo.Title}</p>

            {/* Contact Info */}
            <div className="mt-2 flex flex-wrap justify-center text-sm text-gray-600 gap-x-2 gap-y-1">
                <p className='text-blue-600'>{personalInfo.Mail} |</p>
                <p className='text-blue-600'>{personalInfo.Phone} |</p>
                <p className='text-blue-600'>{personalInfo.LinkedIn} |</p>
                <p className='text-blue-600'>{personalInfo.Portfolio}</p>
            </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
                <h2 className='font-semibold text-lg text-purple-500 whitespace-nowrap'>SUMMARY</h2>
                <div className="w-full border border-t-gray-400"></div>
            </div>
            <p className='text-[13px] text-gray-600'>{professionalSummary.content}</p>
        </div>

        {/* Work Experience */}
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
                <h2 className='font-semibold text-lg text-purple-500 whitespace-nowrap'>WORK EXPERIENCE</h2>
                <div className="w-full border border-t-gray-400"></div>
            </div>
            {workExperience.content.map((exp, idx) => (
            <div key={idx}>
                <div className="flex justify-between w-full">
                <p className='text-sm font-bold text-[#2c6472]'>{exp.Company} | <span className='font-medium text-gray-600'>{exp.Role}</span></p>
                <p className='text-xs text-gray-600'>{exp.Duration}</p>
                </div>
                <p className='text-[13px] ml-2 text-gray-800'>{exp.Description}</p>
            </div>
            ))}
        </div>

        {/* Education */}
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
                <h2 className='font-semibold text-lg text-purple-500 whitespace-nowrap'>EDUCATION</h2>
                <div className="w-full border border-t-gray-400"></div>
            </div>
            {education.content.map((edu, idx) => (
            <div key={idx}>
                <div className="flex justify-between w-full">
                <p className='text-sm font-bold text-[#2c6472]'>{edu.degree}</p>
                <p className='text-xs text-gray-600'>{edu.duration}</p>
                </div>
                <p className='text-xs text-gray-800'>{edu.university}</p>
            </div>
            ))}
        </div>

        {/* Projects */}
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
                <h2 className='font-semibold text-lg text-purple-500 whitespace-nowrap'>PROJECTS</h2>
                <div className="w-full border border-t-gray-400"></div>
            </div>
            {projects.content.map((project, idx) => (
            <div key={idx}>
                <div className="flex justify-between w-full">
                <p className='text-sm font-bold text-[#2c6472]'>{project.Company} | <span className=' text-gray-600 font-medium'>{project.Name}</span></p>
                <p className='text-xs text-gray-600'>{project.Duration}</p>
                </div>
                <p className='text-[13px] text-gray-950'>{project.Skills}</p>
                <p className='text-[13px] ml-2 text-gray-800'>{project.Description}</p>
            </div>
            ))}
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
                <h2 className='font-semibold text-lg text-purple-500 whitespace-nowrap'>SKILLS</h2>
                <div className="w-full border border-t-gray-400"></div>
            </div>
            <div className="text-[13px] ml-2 text-gray-800">
            {skills.content.map((skill, idx) => (
                <span key={idx}>{skill.name}{idx !== skills.content.length - 1 ? ', ' : ''}</span>
            ))}
            </div>
        </div>

        {/* Languages */}
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
                <h2 className='font-semibold text-lg whitespace-nowrap text-purple-500'>LANGUAGES</h2>
                <div className="w-full border border-t-gray-400"></div>
            </div>
            <div className="text-[13px] ml-2 text-gray-800">
            <p className='font-semibold text-[#2c6472]'>Fluent: <span className='font-normal'>{languages.content.Fluent.join(', ')}</span></p>
            <p className='font-semibold text-[#2c6472]'>Basics: <span className='font-normal'>{languages.content.Basics.join(', ')}</span></p>
            </div>
        </div>

        {/* Certificates */}
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
                <h2 className='font-semibold text-lg whitespace-nowrap text-purple-500'>CERTIFICATES</h2>
                <div className="w-full border border-t-gray-400"></div>
            </div>
            <div className="text-[13px] ml-2 text-gray-800">
            {certificates.content.map((cert, idx) => (
                <p key={idx}>{cert.Name}</p>
            ))}
            </div>
        </div>
        
    </div>
  )
}

export default ModernDeedy