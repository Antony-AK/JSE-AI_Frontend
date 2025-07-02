import React from 'react'

const ModernDeedy = ({ personalInfo, professionalSummary, workExperience, education, projects, skills, languages, certificates }) => {

  return (
    <div className='flex flex-col gap-2 px-6 pt-5 w-full h-full'>

        {/* Header */}
        <div className="text-center">
            {/* Name */}
            <h1 className="text-3xl font-bold tracking-wide text-purple-500">{personalInfo.Name}</h1>

            {personalInfo.Title && (
                <p className='text-[#2c6474] mt-2 font-medium'>{personalInfo.Title}</p>
            )}

            {/* Contact Info */}
            <div className="mt-2 flex flex-wrap justify-center text-sm text-gray-600 gap-x-2 gap-y-1">
                {[
                    personalInfo.Mail,
                    personalInfo.Phone,
                    personalInfo.LinkedIn,
                    personalInfo.Website
                ]
                    .filter(Boolean) // remove empty values
                    .map((item, idx, arr) => (
                    <p key={idx} className='text-blue-600'>
                        {idx !== 0 && '|'} {item}
                    </p>
                    ))}
            </div>
        </div>

        {/* Summary */}
        {professionalSummary.content && (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
            <h2 className='font-semibold text-lg text-purple-500 whitespace-nowrap'>SUMMARY</h2>
            <div className="w-full border border-t-gray-400"></div>
            </div>
            <p className='ml-2 text-[13px] text-gray-600'>{professionalSummary.content}</p>
        </div>
        )}

        {/* Work Experience */}
        {workExperience.content.some(exp =>
          exp.Company || exp.Role || exp.Duration || exp.Description
        ) && (
          <div className="flex flex-col gap-1.5 avoid-page-break ">
            <div className="flex items-center gap-3">
              <h2 className='font-semibold text-lg text-purple-500 whitespace-nowrap'>WORK EXPERIENCE</h2>
              <div className="w-full border border-t-gray-400"></div>
            </div>

            {workExperience.content.map((exp, idx) => {
              const hasContent = exp.Company || exp.Role || exp.Duration || exp.Description;
              if (!hasContent) return null;

              return (
                <div key={idx} className='flex flex-col gap-1'>
                  {(exp.Company || exp.Role || exp.Duration) && (
                    <div className="ml-2 flex justify-between w-full">
                      <p className='text-sm font-bold text-[#2c6472]'>
                        {exp.Company}
                        {exp.Role && <> | <span className='font-medium text-gray-600'>{exp.Role}</span></>}
                      </p>
                      {exp.Duration && (
                        <p className='text-xs text-gray-600'>{exp.Duration}</p>
                      )}
                    </div>
                  )}
                  {Array.isArray(exp.Description) && exp.Description.length > 0 && (
                    <ul className="list-none ml-3 text-[13px] text-gray-800 space-y-1">
                      {exp.Description.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-sm text-purple-500">●</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Education */}
        {education?.content?.length > 0 && education.content.some(entry => entry.degree?.trim()) && (
          <div className="flex flex-col gap-1 avoid-page-break ">
            <div className="flex items-center gap-3">
              <h2 className='font-semibold text-lg text-purple-500 whitespace-nowrap'>EDUCATION</h2>
              <div className="w-full border border-t-gray-400"></div>
            </div>
            {education.content.map((entry, idx) => (
              entry.degree?.trim() && (
                <p key={idx} className="text-sm ml-2 text-gray-700">{entry.degree}</p>
              )
            ))}
          </div>
        )}         

        {/* Projects */}
        {projects.content.some(
            proj => proj.Name || proj.Company || proj.Duration || proj.Skills || proj.Description
            ) && (
        <div className="flex flex-col gap-1.5 avoid-page-break ">
            <div className="flex items-center gap-3">
            <h2 className='font-semibold text-lg text-purple-500 whitespace-nowrap'>PROJECTS</h2>
            <div className="w-full border border-t-gray-400"></div>
            </div>

            {projects.content.map((proj, idx) => (
            <div key={idx} className="mb-1 flex flex-col gap-1">
                <div className="ml-2 flex justify-between w-full">
                    <p className='text-sm font-bold text-[#2c6472]'>
                        {proj.Name}
                        {proj.Company && <> | <span className='font-medium text-gray-600'>{proj.Company}</span></>}
                    </p>
                    {proj.Duration && (
                        <p className='text-xs text-gray-600'>{proj.Duration}</p>
                    )}
                </div>

                {proj.Skills && (
                    <p className='text-sm italic text-gray-500 ml-2'>Skills: {proj.Skills}</p>
                )}
                
                {Array.isArray(proj.Description) && proj.Description.length > 0 && (
                  <ul className="list-none ml-3 text-[13px] text-gray-800 space-y-1">
                    {proj.Description.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-600 text-sm">●</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
            ))}
        </div>
        )}

        {/* Skills */}
        {skills.content.filter(skill => skill.trim() !== '').length > 0 && (
          <div className="flex flex-col gap-1 avoid-page-break ">
            <div className="flex items-center gap-3">
              <h2 className='font-semibold text-lg text-purple-500 whitespace-nowrap'>SKILLS</h2>
              <div className="w-full border border-t-gray-400"></div>
            </div>
            <div className="text-[13px] ml-2 text-gray-800">
              {skills.content
                .filter(skill => skill.trim() !== '')
                .map((skill, idx, arr) => (
                  <span key={idx}>
                    {skill}
                    {idx !== arr.length - 1 ? ', ' : ''}
                  </span>
                ))}
            </div>
          </div>
        )}        

        {/* Languages */}
        {languages.content.length > 0 && (
        <div className="flex flex-col gap-1 avoid-page-break ">
            <div className="flex items-center gap-3">
            <h2 className='font-semibold text-lg whitespace-nowrap text-purple-500'>LANGUAGES</h2>
            <div className="w-full border border-t-gray-400"></div>
            </div>
            <div className="text-[13px] ml-2 text-gray-800">
            {languages.content.map((lang, idx) => (
                <p key={idx}>{lang}</p>
            ))}
            </div>
        </div>
        )}

        {/* Certificates */}
        {certificates.content.filter(cert => cert.Name?.trim() !== '').length > 0 && (
          <div className="flex flex-col gap-1 avoid-page-break ">
            <div className="flex items-center gap-3">
              <h2 className='font-semibold text-lg whitespace-nowrap text-purple-500'>CERTIFICATES</h2>
              <div className="w-full border border-t-gray-400"></div>
            </div>
            <div className="text-[13px] ml-2 text-gray-800">
              {certificates.content
                .filter(cert => cert.Name?.trim() !== '')
                .map((cert, idx) => (
                  <p key={idx}>{cert.Name}</p>
                ))}
            </div>
          </div>
        )}
        
    </div>
  )
}

export default ModernDeedy