import React from 'react'

const t = (key, lang = "en") => {
  const map = {
    contact: { en: "Contact", de: "Kontakt" },
    information: { en: "Information", de: "Informationen" },
    summary: { en: "Summary", de: "Zusammenfassung" },
    education: { en: "Education", de: "Ausbildung" },
    experience: { en: "Work Experience", de: "Berufserfahrung" },
    projects: { en: "Projects", de: "Projekte" },
    certificates: { en: "Certificates", de: "Zertifikate" },
    languages: { en: "Languages", de: "Sprachen" },
    skills: { en: "Skills", de: "Fähigkeiten" },
    email: { en: "Email", de: "E-Mail" },
    phone: { en: "Phone", de: "Telefon" },
    linkedin: { en: "LinkedIn", de: "LinkedIn" },
    website: { en: "Website", de: "Webseite" },
  };

  const normalized = lang.toLowerCase();
  const langCodeMap = {
    english: "en",
    german: "de",
    en: "en",
    de: "de",
  };

  const langCode = langCodeMap[normalized] || "en";

  return map[key]?.[langCode] || key;
};

const ExternalModernDeedy = ({ personalInfo, professionalSummary, workExperience, education, projects, skills, languages, certificates, language }) => {
  return (
    <div className="flex flex-col gap-2 px-8 py-3 w-full h-full">
      {/* Header */}
      <div className="text-center">
        {/* Name */}
        <h1 className="text-3xl font-bold tracking-wide text-blue-500">
          {personalInfo.Name}
        </h1>

        {personalInfo.Title && (
          <p className="text-[#2c6474] mt-2 font-medium">
            {personalInfo.Title}
          </p>
        )}

        {/* Contact Info */}
        <div className="mt-2 flex flex-wrap justify-center text-sm text-gray-600 gap-x-2 gap-y-1">
          {[
            personalInfo.Mail,
            personalInfo.Phone,
            personalInfo.LinkedIn,
            personalInfo.Website,
          ]
            .filter(Boolean) // remove empty values
            .map((item, idx, arr) => (
              <p key={idx} className="text-blue-600">
                {idx !== 0 && "|"} {item}
              </p>
            ))}
        </div>
      </div>

      {/* Summary */}
      {professionalSummary.content && (
        <div className="flex flex-col gap-1 mt-5">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-lg text-blue-500 whitespace-nowrap">
              {t("summary", language)}
            </h2>
            <div className="w-full border border-t-gray-400"></div>
          </div>
          <p className="ml-2 text-sm text-gray-600 leading-6">
            {professionalSummary.content}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.content.some(
        (exp) => exp.Company || exp.Role || exp.Duration || exp.Description
      ) && (
          <div className="flex flex-col gap-1.5 avoid-page-break mt-5">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-lg text-blue-500 whitespace-nowrap">
                {t("experience", language)}
              </h2>
              <div className="w-full border border-t-gray-400"></div>
            </div>

            {workExperience.content.map((exp, idx) => {
              const hasContent =
                exp.Company || exp.Role || exp.Duration || exp.Description;
              if (!hasContent) return null;

              return (
                <div
                  key={idx}
                  className="flex flex-col gap-2.5 avoid-page-break mt-4"
                  style={{ breakInside: "avoid" }}
                >
                  {(exp.Company || exp.Role || exp.Duration) && (
                    <div className="ml-3 flex justify-between w-full">
                      <p className="text-base font-bold text-[#2c6472]">
                        {exp.Company}
                        {exp.Role && (
                          <>
                            {" "}
                            |{" "}
                            <span className="font-medium text-gray-600">
                              {exp.Role}
                            </span>
                          </>
                        )}
                      </p>
                      {exp.Duration && (
                        <p className="text-sm text-gray-600">{exp.Duration}</p>
                      )}
                    </div>
                  )}
                  {Array.isArray(exp.Description) &&
                    exp.Description.length > 0 && (
                      <ul className="list-none ml-3 mt-3 text-sm text-gray-800 space-y-1">
                        {exp.Description.map((point, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 leading-6"
                            style={{ breakInside: "avoid" }}
                          >
                            <span className="text-sm text-blue-500">●</span>
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
      {education?.content?.length > 0 &&
        education.content.some((entry) => entry.degree?.trim()) && (
          <div className="flex flex-col gap-1 avoid-page-break mt-5">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-lg text-blue-500 whitespace-nowrap">
                {t("education", language)}
              </h2>
              <div className="w-full border border-t-gray-400"></div>
            </div>
            {education.content
              .filter((entry) => entry.degree?.trim())
              .map((entry, idx) => (
                <div
                  key={idx}
                  className="text-sm ml-2 text-gray-700 mt-3 space-y-0.5 leading-relaxed"
                  style={{ breakInside: "avoid" }}
                >
                  <p className="font-semibold text-base text-[#2c6472]">
                    {entry.degree}
                    {entry.field_of_study && ` - ${entry.field_of_study}`}
                  </p>
                  {entry.school && (
                    <p>
                      {entry.school}
                      {entry.city && `, ${entry.city}`}
                    </p>
                  )}
                  {entry.end_date && <p className="italic text-gray-500">{entry.end_date}</p>}
                  {entry.achievements?.trim() && (
                    <p className="text-[13px] text-gray-600">{entry.achievements}</p>
                  )}
                </div>
              ))}
          </div>
        )}

      {projects.content.some(
        (proj) =>
          proj.Name ||
          proj.Company ||
          proj.Duration ||
          proj.Skills ||
          proj.Description
      ) && (
          <div
            className="flex flex-col gap-3 mt-5 avoid-page-break"
          >
            {/* Header + line */}
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-lg text-blue-500 whitespace-nowrap">
                {t("projects", language)}
              </h2>
              <div className="w-full border border-t-gray-400"></div>
            </div>

            {/* Projects list */}
            {projects.content.map((proj, idx) => (
              <div
                key={idx}
                className="mb-2"
                style={{
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                  WebkitColumnBreakInside: "avoid",
                }}
              >
                {/* Project details */}
                <div className="ml-2 mt-5 flex justify-between w-full">
                  <p className="text-sm font-bold text-[#2c6472]">
                    {proj.Name}
                    {proj.Company && (
                      <>
                        {" "}
                        |{" "}
                        <span className="font-medium text-gray-600">
                          {proj.Company}
                        </span>
                      </>
                    )}
                  </p>
                  {proj.Duration && (
                    <p className="text-xs text-gray-600">{proj.Duration}</p>
                  )}
                </div>

                {proj.Skills && (
                  <p className="text-sm italic text-gray-500 ml-2 mt-1.5">
                    Skills: {proj.Skills}
                  </p>
                )}

                {Array.isArray(proj.Description) &&
                  proj.Description.length > 0 && (
                    <ul className="list-none ml-3 mt-3 text-[13px] text-gray-800 space-y-1 leading-6">
                      {proj.Description.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-600 text-sm">●</span>
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
      {skills.content.filter((skill) => skill.trim() !== "").length > 0 && (
        <div className="flex flex-col gap-1 avoid-page-break mt-5">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-lg text-blue-500 whitespace-nowrap">
              {t("skills", language)}
            </h2>
            <div className="w-full border border-t-gray-400"></div>
          </div>
          <div
            className="text-[15px] leading-6 ml-2 mt-2 text-gray-800"
            style={{ breakInside: "avoid" }}
          >
            {skills.content
              .filter((skill) => skill.trim() !== "")
              .map((skill, idx, arr) => (
                <span key={idx}>
                  {skill}
                  {idx !== arr.length - 1 ? " | " : ""}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.content.filter(lang => lang.language?.trim() !== "").length > 0 && (
        <div className="flex flex-col gap-1 avoid-page-break mt-5">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-lg whitespace-nowrap text-blue-500">
              {t("languages", language)}
            </h2>
            <div className="w-full border border-t-gray-400"></div>
          </div>
          <div
            className="text-[15px] font-medium ml-2 mt-2 text-gray-800 leading-6"
            style={{ breakInside: "avoid" }}
          >
            {languages.content
              .filter(lang => lang.language?.trim() !== "")
              .map((lang, idx) => (
                <p key={idx}>
                  {lang.language}
                  {lang.proficiency && (
                    <span className=" font-normal text-gray-500">
                      {" - " + lang.proficiency}
                    </span>
                  )}
                </p>
              ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      {certificates.content.filter(
        (cert) => cert.certificate_name?.trim() !== ""
      ).length > 0 && (
          <div className="flex flex-col gap-1 avoid-page-break mt-5">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-lg whitespace-nowrap text-blue-500">
                {t("certificates", language)}
              </h2>
              <div className="w-full border border-t-gray-400"></div>
            </div>
            <div
              className="text-[15px] font-medium ml-2 mt-2 text-gray-800 leading-6"
              style={{ breakInside: "avoid" }}
            >
              {certificates.content
                .filter((cert) => cert.certificate_name?.trim() !== "")
                .map((cert, idx) => (
                  <p key={idx}>
                    {cert.certificate_name}
                    {cert.provider && (
                      <span className=" font-normal text-gray-500"> - {cert.provider}</span>
                    )}
                  </p>
                ))}
            </div>
          </div>
        )}
    </div>
  )
}

export default ExternalModernDeedy