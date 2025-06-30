import React from 'react';

const PlushCV = ({
  personalInfo,
  professionalSummary,
  workExperience,
  education,
  projects,
  skills,
  languages,
  certificates
}) => {
  return (
    <div className="flex w-full h-full font-sans text-[13px] text-gray-800">
      {/* Sidebar */}
      <div className="w-[30%] bg-[#f2f2f2] px-5 py-6 flex flex-col gap-4">
        {/* Name + Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#2c6472]">{personalInfo.Name}</h1>
          {personalInfo.Title && <p className="text-sm mt-1">{personalInfo.Title}</p>}
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-[13px] font-semibold text-[#2c6472] mb-1">CONTACT</h3>
          <div className="text-[12px] flex flex-col gap-1">
            {personalInfo.Phone && <p>{personalInfo.Phone}</p>}
            {personalInfo.Mail && <p>{personalInfo.Mail}</p>}
            {personalInfo.LinkedIn && <p>{personalInfo.LinkedIn}</p>}
            {personalInfo.Website && <p>{personalInfo.Website}</p>}
          </div>
        </div>

        {/* Skills */}
        {skills.content.length > 0 && (
          <div>
            <h3 className="text-[13px] font-semibold text-[#2c6472] mb-1">SKILLS</h3>
            <ul className="list-disc ml-5 text-[12px]">
              {skills.content.filter(skill => skill.trim()).map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages.content.length > 0 && (
          <div>
            <h3 className="text-[13px] font-semibold text-[#2c6472] mb-1">LANGUAGES</h3>
            <ul className="list-disc ml-5 text-[12px]">
              {languages.content.map((lang, idx) => <li key={idx}>{lang}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[70%] px-6 py-6 flex flex-col gap-4">
        {/* Summary */}
        {professionalSummary.content && (
          <div>
            <h2 className="text-[14px] font-semibold text-[#2c6472] mb-1">SUMMARY</h2>
            <p className="text-[12px]">{professionalSummary.content}</p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.content.some(exp => exp.Company || exp.Role || exp.Description) && (
          <div>
            <h2 className="text-[14px] font-semibold text-[#2c6472] mb-1">WORK EXPERIENCE</h2>
            <div className="flex flex-col gap-2">
              {workExperience.content.map((exp, idx) => {
                if (!exp.Company && !exp.Role && !exp.Description) return null;
                return (
                  <div key={idx}>
                    <p className="text-[13px] font-bold">{exp.Company} {exp.Role && `| ${exp.Role}`}</p>
                    {exp.Duration && <p className="text-[11px] text-gray-500">{exp.Duration}</p>}
                    {exp.Description && <p className="text-[12px] mt-1">{exp.Description}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Education */}
        {education?.content?.length > 0 && education.content.some(entry => entry.degree?.trim()) && (
          <div>
            <h2 className="text-[14px] font-semibold text-[#2c6472] mb-1">EDUCATION</h2>
            {education.content.map((entry, idx) =>
              entry.degree?.trim() && (
                <p key={idx} className="text-[12px]">{entry.degree}</p>
              )
            )}
          </div>
        )}

        {/* Projects */}
        {projects.content.some(proj => proj.Name || proj.Description) && (
          <div>
            <h2 className="text-[14px] font-semibold text-[#2c6472] mb-1">PROJECTS</h2>
            {projects.content.map((proj, idx) => (
              <div key={idx} className="mb-2">
                <p className="text-[13px] font-bold">
                  {proj.Name}
                  {proj.Company && ` | ${proj.Company}`}
                </p>
                {proj.Duration && <p className="text-[11px] text-gray-500">{proj.Duration}</p>}
                {proj.Skills && <p className="text-[12px] italic">Skills: {proj.Skills}</p>}
                {proj.Description && <p className="text-[12px]">{proj.Description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certificates */}
        {certificates.content.filter(cert => cert.Name?.trim() !== '').length > 0 && (
          <div>
            <h2 className="text-[14px] font-semibold text-[#2c6472] mb-1">CERTIFICATES</h2>
            <ul className="list-disc ml-5 text-[12px]">
              {certificates.content
                .filter(cert => cert.Name?.trim() !== '')
                .map((cert, idx) => (
                  <li key={idx}>{cert.Name}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlushCV;
