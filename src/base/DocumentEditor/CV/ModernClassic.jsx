import React from "react";

const ModernClassic = ({
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
    <div className="flex flex-col gap-2 w-full h-full pb-5">
      {/* Header */}
      <div className="bg-[#4F6D61] h-48 flex flex-col gap-2 justify-center px-10">
        {/* <p className="text-white font-semibold text-lg">{personalInfo.Title}</p> */}
        <h2 className="text-white font-bold text-[45px]">{personalInfo.Name}</h2>
        <div className="flex flex-col gap-2 text-white text-[13px] font-light">
          <p>
            {personalInfo.Mail} | {personalInfo.Phone}
          </p>
          <p>
            {personalInfo.LinkedIn}{" "}
            {personalInfo.LinkedIn && personalInfo.Website && ` | `}{" "}
            {personalInfo.Website}
          </p>
        </div>
      </div>

      {/* Summary */}
      {professionalSummary.content &&
        professionalSummary.content.trim() !== "" && (
          <div className="w-full px-10 pt-5 avoid-page-break">
            <div className="flex justify-start items-start gap-12">
              <div className="min-w-[130px]">
                <h2 className="text-[#4F6D61] font-bold text-lg">Summary</h2>
              </div>

              <div className="text-sm space-y-2 leading-6">
                <p className="text-gray-700 font-normal">
                  {professionalSummary.content}
                </p>
              </div>
            </div>

            <div className="mt-5 border-b border-gray-300 w-full"></div>
          </div>
        )}

      {/* Skills */}
      {skills.content && skills.content.length > 0 && (
        <div className="w-full px-10 avoid-page-break">
          <div className="flex justify-start items-start gap-12">
            <div className="min-w-[130px]">
              <h2 className="text-[#4F6D61] font-bold text-lg">Skills</h2>
            </div>

            <div className="text-sm">
              <div className="text-gray-700 text-sm flex flex-wrap gap-x-2 leading-6">
                {skills.content.map((skill, index) => (
                  <span key={index}>
                    {skill}
                    {index !== skills.content.length - 1 && (
                      <span className="mx-1">|</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 border-b border-gray-300 w-full"></div>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.content.some(
        (exp) => exp.Company || exp.Role || exp.Duration || exp.Description
      ) && (
        <div className="w-full px-10">
          <div className="flex gap-12 items-start">
            {/* Left Side: Experience Label */}
            <div className="min-w-[130px]">
              <h2 className="text-[#4F6D61] font-bold text-lg">Experience</h2>
            </div>

            {/* Right Side: Experience Entries */}
            <div className="flex-1 flex flex-col gap-5 mt-1.5">
              {workExperience.content.map((exp, idx) => {
                const hasContent =
                  exp.Company || exp.Role || exp.Duration || exp.Description;
                if (!hasContent) return null;

                return (
                  <div
                    key={idx}
                    className="avoid-page-break"
                    style={{ breakInside: "avoid" }}
                  >
                    {(exp.Company || exp.Role) && (
                      <div className="flex flex-wrap items-center gap-2 text-sm text-[#4F6D61]">
                        {exp.Company && (
                          <span className="font-bold text-[15px]">{exp.Company}</span>
                        )}
                        {exp.Role && (
                          <span className="font-medium">| {exp.Role}</span>
                        )}
                      </div>
                    )}
                    {exp.Duration && (
                      <p className="text-[13px] text-[#4F6D61] mt-2">{exp.Duration}</p>
                    )}
                    {exp.Description && (
                    <div className="text-sm text-gray-800 mt-2 leading-6">
                      {Array.isArray(exp.Description) ? (
                        <ul className="list-disc ml-5 space-y-2">
                          {exp.Description.filter(desc => desc?.trim()).map((desc, i) => (
                            <li
                              key={i}
                              className="avoid-page-break"
                              style={{ breakInside: "avoid" }}
                            >
                              • {desc.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{exp.Description}</p>
                      )}
                    </div>
                  )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 border-b border-gray-300 w-full"></div>
        </div>
      )}

      {/* Education */}
      {education.content &&
        education.content.filter((entry) => entry.degree?.trim() !== "").length > 0 && (
          <div className="w-full px-10 avoid-page-break">
            <div className="flex justify-start items-start gap-12">
              <div className="min-w-[130px]">
                <h2 className="text-[#4F6D61] font-bold text-lg">Education</h2>
              </div>

              <div className="text-[13px] space-y-2.5 leading-6">
                {education.content
                  .filter((entry) => entry.degree?.trim())
                  .map((entry, idx) => (
                    <div key={idx} className="text-[#4F6D61] mt-1 space-y-0.5">
                      <p className="font-semibold text-[15px]">
                        {entry.degree}
                        {entry.field_of_study && ` - ${entry.field_of_study}`}
                      </p>
                      {(entry.school || entry.city) && (
                        <p className="ml-2 italic text-gray-600">
                          {entry.school}
                          {entry.city && `${entry.city}`}
                        </p>
                      )}
                      {entry.end_date && (
                        <p className="ml-2 text-gray-500">{entry.end_date}</p>
                      )}
                      {entry.achievements?.trim() && (
                        <p className="text-[13px] ml-2 text-gray-700">
                          {entry.achievements}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-5 border-b border-gray-300 w-full"></div>
          </div>
        )}

      {/* Projects Section */}
      {projects.content &&
        projects.content.filter(
          (proj) =>
            proj.Name?.trim() ||
            proj.Description?.length > 0 ||
            proj.Company?.trim() ||
            proj.Duration?.trim()
        ).length > 0 && (
          <div className="w-full px-10">
            <div className="flex gap-12 items-start">
              {/* Left Side: Section Title */}
              <div className="min-w-[130px]">
                <h2 className="text-[#4F6D61] font-bold text-lg">Projects</h2>
              </div>

              {/* Right Side: Project Entries */}
              <div className="flex-1 flex flex-col gap-6">
                {projects.content.map((proj, idx) => {
                  const hasContent =
                    proj.Name?.trim() ||
                    proj.Description?.length > 0 ||
                    proj.Company?.trim() ||
                    proj.Duration?.trim();

                  if (!hasContent) return null;

                  return (
                    <div
                      key={idx}
                      className="avoid-page-break"
                      style={{ breakInside: "avoid" }}
                    >
                      {/* Title Line: Name + Company */}
                      {(proj.Name || proj.Company) && (
                        <div className="flex flex-wrap items-center gap-2 text-sm text-[#4F6D61] font-bold mt-1">
                          {proj.Name && <span className="text-[15px]">{proj.Name}</span>}
                          {proj.Company && (
                            <span className="font-normal text-[#4F6D61]">
                              | {proj.Company}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Duration */}
                      {proj.Duration && (
                        <p className="text-xs text-[#4F6D61] my-2">
                          {proj.Duration}
                        </p>
                      )}

                      {/* Skills */}
                      {proj.Skills && (
                        <p className="text-xs text-gray-600 mt-1 italic">
                          <span className="font-semibold text-sm">Skills:</span>{" "}
                          {proj.Skills}
                        </p>
                      )}

                      {/* Description */}
                      {proj.Description && (
                        <div className="text-sm text-gray-800 mt-2">
                          {Array.isArray(proj.Description) ? (
                            <ul className="list-disc ml-5 space-y-2">
                              {proj.Description.map((point, i) => (
                                <li
                                  key={i}
                                  className="avoid-page-break"
                                  style={{ breakInside: "avoid" }}
                                >
                                  • {point}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>{proj.Description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Border */}
            <div className="mt-5 border-b border-gray-300 w-full"></div>
          </div>
        )}

      {/* 🔹 Languages */}
      {languages.content &&
        languages.content.filter((lang) => lang.language?.trim()).length > 0 && (
          <div className="w-full px-10">
            <div className="flex gap-12 items-start">
              {/* Left Side: Title */}
              <div className="w-[130px]">
                <h2 className="text-[#4F6D61] font-bold text-lg">Languages</h2>
              </div>

              {/* Right Side: Language List */}
              <div className="flex-1">
                <ul className="list-disc font-medium text-gray-700 text-[15px] space-y-1.5 mt-1">
                  {languages.content
                    .filter((lang) => lang.language?.trim())
                    .map((lang, idx) => (
                      <li
                        key={idx}
                        className="avoid-page-break"
                        style={{ breakInside: "avoid" }}
                      >
                        {lang.language}
                        {lang.proficiency && (
                          <span className="italic font-normal text-gray-500">
                            {" - " + lang.proficiency}
                          </span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 border-b border-gray-300 w-full"></div>
          </div>
        )}

      {/* 🔹 Certificates */}
      {certificates.content &&
        certificates.content.filter((cert) => cert.certificate_name?.trim()).length > 0 && (
          <div className="w-full px-10 avoid-page-break" style={{ breakInside: "avoid" }}>
            <div className="flex gap-12 items-start">
              <div className="w-[130px]">
                <h2 className="text-[#4F6D61] font-bold text-lg">Certificates</h2>
              </div>

              <div className="flex-1">
                <ul className="list-disc text-[15px] font-medium text-gray-700 space-y-1.5">
                  {certificates.content
                    .filter((cert) => cert.certificate_name?.trim())
                    .map((cert, index) => (
                      <li key={index} className="avoid-page-break">
                        {cert.certificate_name}
                        {cert.provider && (
                          <span className="italic font-normal text-gray-700">
                            {" - " + cert.provider}
                          </span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ModernClassic;
