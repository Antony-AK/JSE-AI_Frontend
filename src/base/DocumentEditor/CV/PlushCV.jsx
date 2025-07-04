import React from "react";

const PlushCV = ({
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
    <div className="flex w-full flex-col font-sans text-[14px] text-black bg-white mx-5 my-2">
      {/* Left Column */}
      {/* Name + Title */}
      <div className="mx-5 flex flex-col gap-2 mb-1">
        <div className="">
          <h1 className="text-[44px] font-bold text-[#0078d4] leading-tight">
            {personalInfo.Name?.split(" ")[0]}{" "}
            <span className="text-[#0078d4] font-light">
              {personalInfo.Name?.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          {personalInfo.Title && (
            <p className="text-sm mt-2">{personalInfo.Title}</p>
          )}
        </div>

        {/* Contact */}
        <div className="flex items-center gap-4 flex-wrap text-[11px] text-[#333]">
          {personalInfo.Address && <p>📍 {personalInfo.Address}</p>}

          {personalInfo.LinkedIn && (
            <p>
              🔗{" "}
              <a
                href={
                  personalInfo.LinkedIn.startsWith("http")
                    ? personalInfo.LinkedIn
                    : `https://${personalInfo.LinkedIn}`
                }
                className="text-[#0078d4] underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {personalInfo.LinkedIn}
              </a>
            </p>
          )}

          {personalInfo.Mail && (
            <p>
              ✉️{" "}
              <a
                href={`mailto:${personalInfo.Mail}`}
                className="text-[#0078d4] underline"
              >
                {personalInfo.Mail}
              </a>
            </p>
          )}

          {personalInfo.Phone && <p>📞 +49 {personalInfo.Phone}</p>}

          {/* 🌐 External Links (Portfolio, GitHub, Blog...) */}
          {personalInfo.external_links?.length > 0 &&
            personalInfo.external_links.map((link, idx) => (
              <p key={idx}>
                🌐{" "}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0078d4] underline"
                >
                  {link.type}
                </a>
              </p>
            ))}
        </div>
      </div>

      <div className="flex w-full   gap-4">
        <div className="w-[70%] px-6 py-4 flex flex-col gap-4">
          {/* EXPERIENCE */}
          {workExperience.content.some(
            (exp) => exp.Company || exp.Role || exp.Description
          ) && (
            <div>
              <h2 className="text-[16px] font-bold text-[#0078d4] uppercase mb-1 avoid-page-break">
                Experience
              </h2>
              {workExperience.content.map((exp, idx) => (
                <div
                  key={idx}
                  className="mb-3 avoid-page-break"
                  style={{ breakInside: "avoid" }}
                >
                  <div className="flex justify-between text-[14px] font-bold">
                    <span>{exp.Company}</span>
                    {exp.Duration && (
                      <span className="text-[12px] text-gray-500">
                        {exp.Duration}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] mb-1">{exp.Role}</p>
                  {Array.isArray(exp.Description) &&
                    exp.Description.length > 0 && (
                      <ul className="list-none ml-3 mt-2 text-[12px] text-gray-700 space-y-1">
                        {exp.Description.map((line, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-600 text-sm">●</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              ))}
            </div>
          )}
          {/* PROJECTS */}
          {projects.content.length > 0 && (
            <div>
              <h2 className="text-[16px] font-bold text-[#0078d4] uppercase mb-1 avoid-page-break">
                Projects
              </h2>
              {projects.content.map((proj, idx) => (
                <div
                  key={idx}
                  className="mb-3 avoid-page-break"
                  style={{ breakInside: "avoid" }}
                >
                  <div className="flex justify-between text-[14px] font-bold">
                    <span>{proj.Name}</span>
                    {proj.Duration && (
                      <span className="text-[12px] text-gray-500">
                        {proj.Duration}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px]">{proj.Skills}</p>
                  {Array.isArray(proj.Description) &&
                    proj.Description.length > 0 && (
                      <ul className="list-none ml-3 mt-2 text-[12px] text-gray-700 space-y-1">
                        {proj.Description.map((line, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#0078d4] text-sm">●</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-[30%] bg-white px-5 py-4 flex flex-col gap-4">
          {/* Skills */}
          {skills?.content?.length > 0 && (
            <div>
              <h2 className="text-[16px] font-bold text-[#0078d4] uppercase mb-1 avoid-page-break">
                Skills
              </h2>
              <ul className="list-disc ml-4 text-[12px]">
                {skills.content.map((skill, idx) => (
                  <li
                    key={idx}
                    className="avoid-page-break"
                    style={{ breakInside: "avoid" }}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Education */}
          {education.content.length > 0 && (
            <div>
              <h2 className="text-[16px] font-bold text-[#0078d4] uppercase mb-1 avoid-page-break">
                Education
              </h2>
              {education.content.map((edu, idx) => (
                <div
                  key={idx}
                  className="mb-2 avoid-page-break"
                  style={{ breakInside: "avoid" }}
                >
                  <p className="text-[12px]">{edu.degree}</p>
                  <p className="text-[12px] text-gray-700">{edu.institution}</p>
                  <p className="text-[12px] text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages?.content?.length > 0 && (
            <div>
              <h2 className="text-[16px] font-bold text-[#0078d4] uppercase mb-1 avoid-page-break">
                Languages
              </h2>
              <ul className="list-disc ml-4 text-[12px]">
                {languages.content.map((lang, idx) => (
                  <li
                    key={idx}
                    className="avoid-page-break"
                    style={{ breakInside: "avoid" }}
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certificates */}
          {certificates.content.length > 0 && (
            <div>
              <h2 className="text-[16px] font-bold text-[#0078d4] uppercase mb-1 avoid-page-break">
                Certifications
              </h2>
              <ul className="list-disc ml-4 text-[12px]">
                {certificates.content.map((cert, idx) => (
                  <li
                    key={idx}
                    className="avoid-page-break"
                    style={{ breakInside: "avoid" }}
                  >
                    {cert.Name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlushCV;
