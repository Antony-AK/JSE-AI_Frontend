import React from "react";

const EuropassCV = ({
  personalInfo,
  professionalSummary,
  workExperience,
  education,
  projects,
  skills,
  languages,
  certificates,
}) => {
  return (
    <div className="flex flex-col gap-2 px-6 pt-5 w-full h-full">
      {/* Header */}
      <div className="bg-[#def6fc] h-40 flex flex-col justify-center px-10">
        <h2 className="text-[#2c6472] font-bold text-4xl">
          {personalInfo.Name}
        </h2>
        <p className="text-[#2c6472] font-semibold text-lg">
          {personalInfo.Title}
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-col">
        {/* Contact */}
        <div className="w-full px-4 pt-6">
          <div className="flex justify-start items-start gap-12">
            <div className="min-w-[130px]">
              <h2 className="text-[13px] text-[#2c6472] font-bold tracking-widest uppercase">
                Contact
                <br />
                Information
              </h2>
            </div>

            <div className="text-[13px] text-[#2c6472] space-y-1 leading-5">
              <h2 className="font-bold">
                Email:{" "}
                <span className="text-black font-normal">
                  {personalInfo.Mail}
                </span>
              </h2>
              <h2 className="font-bold">
                Phone:{" "}
                <span className="text-black font-normal">
                  {personalInfo.Phone}
                </span>
              </h2>
              {personalInfo.LinkedIn && personalInfo.LinkedIn.trim() !== "" && (
                <h2 className="font-bold">
                  LinkedIn:{" "}
                  <span className="text-black font-normal">
                    {personalInfo.LinkedIn}
                  </span>
                </h2>
              )}
              {personalInfo.Website && personalInfo.Website.trim() !== "" && (
                <h2 className="font-bold">
                  Website:{" "}
                  <span className="text-black font-normal">
                    {personalInfo.Website}
                  </span>
                </h2>
              )}
            </div>
          </div>

          <div className="mt-3 border-b border-gray-300 w-full"></div>
        </div>

        {/* Summary */}
        {professionalSummary.content &&
          professionalSummary.content.trim() !== "" && (
            <div className="w-full px-4 pt-6">
              <div className="flex justify-start items-start gap-12">
                <div className="min-w-[130px]">
                  <h2 className="text-[13px] text-[#2c6472] font-bold tracking-widest uppercase">
                    Summary
                  </h2>
                </div>

                <div className="text-[13px] space-y-1 leading-5">
                  <p className="text-black font-normal">
                    {professionalSummary.content}
                  </p>
                </div>
              </div>

              <div className="mt-3 border-b border-gray-300 w-full"></div>
            </div>
          )}

        {/* Education */}
        {education.content &&
          education.content.filter((entry) => entry.degree?.trim() !== "")
            .length > 0 && (
            <div className="w-full px-4 pt-6">
              <div className="flex justify-start items-start gap-12">
                <div className="min-w-[130px]">
                  <h2 className="text-[13px] text-[#2c6472] font-bold tracking-widest uppercase">
                    Education
                  </h2>
                </div>

                <div className="text-[13px] space-y-1 leading-5">
                  {education.content.map(
                    (entry, idx) =>
                      entry.degree?.trim() && (
                        <p key={idx} className="text-sm text-black">
                          {entry.degree}
                        </p>
                      )
                  )}
                </div>
              </div>

              <div className="mt-3 border-b border-gray-300 w-full"></div>
            </div>
          )}

        {/* Work Experience */}
        {workExperience.content.some(
          (exp) => exp.Company || exp.Role || exp.Duration || exp.Description
        ) && (
          <div className="w-full px-4 pt-6">
            <div className="flex gap-12 mb-5">
              <div className="min-w-[130px]">
                <h2 className="text-[13px] text-[#2c6472] font-bold tracking-widest uppercase">
                  Experience
                </h2>
              </div>
            </div>

            {/* Experience Entries */}
            {workExperience.content.map((exp, idx) => {
              const hasContent =
                exp.Company || exp.Role || exp.Duration || exp.Description;
              if (!hasContent) return null;

              return (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-[180px] flex flex-col gap-0.5">
                    {exp.Company && (
                      <p className="text-sm font-bold text-[#2c6472]">
                        {exp.Company}
                      </p>
                    )}
                    {exp.Role && (
                      <p className="text-xs text-[#497d8a]">{exp.Role}</p>
                    )}
                    {exp.Duration && (
                      <p className="text-xs text-[#497d8a]">{exp.Duration}</p>
                    )}
                  </div>

                  <div className="flex-1 text-[13px] text-gray-800">
                    {Array.isArray(exp.Description) ? (
                      <ul className="list-disc space-y-1">
                        {exp.Description.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{exp.Description}</p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="mt-3 border-b border-gray-300 w-full"></div>
          </div>
        )}
      </div>

      {/* Projects Section */}
      {projects.content &&
        projects.content.filter(
          (proj) =>
            proj.Name?.trim() ||
            proj.Description?.length > 0 ||
            proj.Company?.trim() ||
            proj.Duration?.trim()
        ).length > 0 && (
          <div className="w-full px-4 pt-6">
            {/* Section Title */}
            <div className="flex gap-12 mb-5">
              <div className="">
                <h2 className="text-[13px] text-[#2c6472] font-bold tracking-widest uppercase">
                  Projects
                </h2>
              </div>
            </div>

            {/* Each Project Entry */}
            {projects.content.map((proj, idx) => {
              const hasContent =
                proj.Name?.trim() ||
                proj.Description?.length > 0 ||
                proj.Company?.trim() ||
                proj.Duration?.trim();

              if (!hasContent) return null;

              return (
                <div key={idx} className="flex mb-6 min-w-[130px] items-start">
                  {/* Left Column */}
                  <div className="w-[180px] flex flex-col gap-0.5">
                    {proj.Name && (
                      <p className="text-sm font-bold text-[#2c6472]">
                        {proj.Name}
                      </p>
                    )}
                    {proj.Company && (
                      <p className="text-xs text-gray-700 max-w-[180px]">
                        {proj.Company}
                      </p>
                    )}
                    {proj.Duration && (
                      <p className="text-xs text-gray-500 min-w-[130px]">
                        {proj.Duration}
                      </p>
                    )}
                  </div>

                  {/* Right Column: Descriptions */}
                  <div className="flex-1 text-[13px] text-gray-800">
                    {proj.Skills && (
                      <p className="text-xs text-gray-600 mb-2 italic">
                        <span className="font-semibold text-sm">Skills:</span>{" "}
                        {proj.Skills}
                      </p>
                    )}

                    {Array.isArray(proj.Description) ? (
                      <ul className="list-disc ml-4 mt-2 space-y-1">
                        {proj.Description.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      proj.Description && <p>{proj.Description}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Bottom Border */}
            <div className="mt-3 border-b border-gray-300 w-full"></div>
          </div>
        )}

      {/* Certificates */}
      {certificates.content &&
        certificates.content.filter((cert) => cert.Name?.trim()).length > 0 && (
          <div className="">
            <div className="w-full px-4 pt-6">
              <h2 className="text-[13px] mb-3 text-[#2c6472] font-bold tracking-widest uppercase">
                {certificates.title || "Certificates"}
              </h2>
              <ul className="list-disc text-sm ml-5 text-gray-700 space-y-0.5">
                {certificates.content.map((cert, index) =>
                  cert.Name?.trim() ? <li key={index}>{cert.Name}</li> : null
                )}
              </ul>
            </div>

            <div className="mt-3 border-b border-gray-300 w-full"></div>
          </div>
        )}

      <div className="flex gap-10 text-sm px-4 pt-6">
        {/* Languages - Left Side */}
        {languages.content &&
          languages.content.filter((lang) => lang?.trim()).length > 0 && (
            <div className="min-w-[130px]">
              <h2 className="text-[13px] mb-3 text-[#2c6472] font-bold tracking-widest uppercase">
                {languages.title || "Languages"}
              </h2>
              <ul className="list-disc ml-5 text-gray-700 text-[13px] space-y-0.5">
                {languages.content.map(
                  (lang, idx) => lang?.trim() && <li key={idx}>{lang}</li>
                )}
              </ul>
            </div>
          )}

        {/* Skills - Right Side */}
        {skills.content && skills.content.length > 0 && (
          <div className="pb-5">
            <h2 className="text-[13px] mb-3 text-[#2c6472] font-bold tracking-widest uppercase">
              {skills.title || "Skills"}
            </h2>
            <ul className="list-disc ml-5 text-gray-700 space-y-0.5 text-[13px]">
              {skills.content.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EuropassCV;
