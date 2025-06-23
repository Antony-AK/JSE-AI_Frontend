import React from 'react'

const ModernDeedy = ({ personalInfo, professionalSummary, workExperience, education, projects, skills, languages, certificates }) => {

  return (
    <div className='flex flex-col gap-2 px-6 pt-5 w-full h-full'>

        {/* Header */}
        <div className="text-center mb-3">
            {/* Name */}
            <h1 className="text-3xl font-bold tracking-wide">{personalInfo.Name}</h1>

            <p>{personalInfo.Title}</p>

            {/* Contact Info */}
            <div className="mt-2 flex flex-wrap justify-center text-sm text-gray-600 gap-x-2 gap-y-1">
                <p>{personalInfo.Mail} |</p>
                <p>{personalInfo.Phone} |</p>
                <p>{personalInfo.LinkedIn} |</p>
                <p>{personalInfo.Portfolio}</p>
            </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-1">
            <h2 className='text-lg text-gray-600'>SUMMARY</h2>
            <p className='text-[13px] text-gray-600'>{professionalSummary.content}</p>
        </div>

        {/* Work Experience */}
        <div className="flex flex-col gap-1.5">
            <h2 className='text-lg text-gray-600'>WORK EXPERIENCE</h2>
            {workExperience.content.map((exp, idx) => (
            <div key={idx}>
                <div className="flex justify-between w-full">
                <p className='text-sm font-bold text-gray-600'>{exp.Company} | <span className='font-medium'>{exp.Role}</span></p>
                <p className='text-xs text-gray-600'>{exp.Duration}</p>
                </div>
                <p className='text-[13px] ml-2 text-gray-800'>{exp.Description}</p>
            </div>
            ))}
        </div>

        {/* Education */}
        <div className="flex flex-col gap-1">
            <h2 className='text-lg text-gray-600'>EDUCATION</h2>
            {education.content.map((edu, idx) => (
            <div key={idx}>
                <div className="flex justify-between w-full">
                <p className='text-sm font-bold text-gray-600'>{edu.degree}</p>
                <p className='text-xs text-gray-600'>{edu.duration}</p>
                </div>
                <p className='text-xs text-gray-800'>{edu.university}</p>
            </div>
            ))}
        </div>

        {/* Projects */}
        <div className="flex flex-col gap-1">
            <h2 className='text-lg text-gray-600'>PROJECTS</h2>
            {projects.content.map((project, idx) => (
            <div key={idx}>
                <div className="flex justify-between w-full">
                <p className='text-sm font-bold text-gray-600'>{project.Company} | <span className='font-medium'>{project.Name}</span></p>
                <p className='text-xs text-gray-600'>{project.Duration}</p>
                </div>
                <p className='text-[13px] text-gray-950'>{project.Skills}</p>
                <p className='text-[13px] ml-2 text-gray-800'>{project.Description}</p>
            </div>
            ))}
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-1">
            <h2 className='text-lg text-gray-600'>SKILLS</h2>
            <div className="text-[13px] ml-2 text-gray-800">
            {skills.content.map((skill, idx) => (
                <span key={idx}>{skill.name}{idx !== skills.content.length - 1 ? ', ' : ''}</span>
            ))}
            </div>
        </div>

        {/* Languages */}
        <div className="flex flex-col gap-1">
            <h2 className='text-lg text-gray-600'>LANGUAGES</h2>
            <div className="text-[13px] ml-2 text-gray-800">
            <p className='font-semibold'>Fluent: <span className='font-normal'>{languages.content.Fluent.join(', ')}</span></p>
            <p className='font-semibold'>Basics: <span className='font-normal'>{languages.content.Basics.join(', ')}</span></p>
            </div>
        </div>

        {/* Certificates */}
        <div className="flex flex-col gap-1">
            <h2 className='text-lg text-gray-600'>CERTIFICATES</h2>
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