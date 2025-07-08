import React from "react";

const t = (key, lang = "en") => {
  const map = {
    contact: { en: "Contact", de: "Kontakt" },
    information: { en: "Information", de: "Informationen" },
    summary: { en: "Summary", de: "Zusammenfassung" },
    education: { en: "Education", de: "Ausbildung" },
    experience: { en: "Experience", de: "Berufserfahrung" },
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

const EuropassCV = ({
  personalInfo,
  professionalSummary,
  workExperience,
  education,
  projects,
  skills,
  languages,
  certificates,
  language,

}) => {

  console.log("📢 CV Language:", language);


  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {/* Header */}
      <div className="bg-[#F1F6FC] h-44 flex flex-col justify-center px-10">
        <h2 className="text-[#2c6472] font-bold text-4xl">
          {personalInfo.Name}
        </h2>
        {/* <p className="text-[#2c6472] font-semibold text-lg">
          {personalInfo.Title}
        </p> */}
      </div>

      {/* Body */}
      <div className="flex flex-col">
        {/* Contact */}
        <div className="w-full px-10 pt-6">
          <div className="flex justify-start items-start gap-12">
            <div className="w-[130px]">
              <h2 className="text-sm text-[#2c6472] font-bold tracking-widest uppercase">
                {t("contact", language)}
                <br />
                {t("information", language)}

              </h2>
            </div>

            <div className="flex flex-col gap-1 text-sm text-[#2c6472] space-y-1 leading-5">
              <h2 className="font-bold text-[13px]">
                {t("email", language)}:{" "}
                <span className="text-black font-normal text-[13px]">
                  {personalInfo.Mail}
                </span>
              </h2>
              <h2 className="font-bold text-[13px]">
                {t("phone", language)}:{" "}
                <span className="text-black font-normal">{personalInfo.Phone}</span>
              </h2>

              {personalInfo.LinkedIn && personalInfo.LinkedIn.trim() !== "" && (
                <h2 className="font-bold text-[13px]">
                  {t("linkedin", language)}:{" "}
                  <span className="text-black font-normal">
                    <a
                      href={
                        personalInfo.LinkedIn.startsWith("http")
                          ? personalInfo.LinkedIn
                          : `https://www.linkedin.com/in/${personalInfo.LinkedIn}`
                      }
                      className="underline text-[#2c6472]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {personalInfo.LinkedIn}
                    </a>
                  </span>
                </h2>
              )}

              {personalInfo.Website && personalInfo.Website.trim() !== "" && (
                <h2 className="font-bold">
                  {t("website", language)}:{" "}
                  <span className="text-black font-normal">
                    <a
                      href={
                        personalInfo.Website.startsWith("http")
                          ? personalInfo.Website
                          : `https://${personalInfo.Website}`
                      }
                      className="underline text-[#2c6472]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {personalInfo.Website}
                    </a>
                  </span>
                </h2>
              )}
            </div>

          </div>

          <div className="mt-5 border-b border-gray-300 w-full"></div>
        </div>

        {/* Summary */}
        {professionalSummary.content &&
          professionalSummary.content.trim() !== "" && (
            <div className="w-full px-10 pt-6">
              <div className="flex justify-start items-start gap-12">
                <div className="min-w-[130px]">
                  <h2 className="text-sm text-[#2c6472] font-bold tracking-widest uppercase">
                    {t("summary", language)}
                  </h2>
                </div>

                <div className="text-[13px] space-y-1 leading-6">
                  <p className="text-black font-normal">
                    {professionalSummary.content}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-b border-gray-300 w-full"></div>
            </div>
          )}

        {/* Education */}
        {education.content &&
          education.content.filter((entry) => entry.degree?.trim() !== "").length > 0 && (
            <div className="w-full px-10 pt-6">
              <div className="flex justify-start items-start gap-12">
                <div className="min-w-[130px]">
                  <h2 className="text-sm text-[#2c6472] font-bold tracking-widest uppercase">
                    {t("education", language)}
                  </h2>
                </div>

                <div className="text-[13px] space-y-2.5 leading-5">
                  {education.content
                    .filter((entry) => entry.degree?.trim())
                    .map((entry, idx) => (
                      <div key={idx} className="text-[#2c6472] space-y-0.5">
                        <p className="font-semibold  text-sm">
                          {entry.degree}
                          {entry.field_of_study && ` - ${entry.field_of_study}`}
                        </p>
                        {(entry.school || entry.city) && (
                          <p className="text-gray-700 italic">
                            {entry.school}
                            {entry.city && `${entry.city}`}
                          </p>
                        )}
                        {entry.end_date && (
                          <p className="text-gray-500">{entry.end_date}</p>
                        )}
                        {entry.achievements?.trim() && (
                          <p className="text-[12px] text-black">{entry.achievements}</p>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-5 border-b border-gray-300 w-full"></div>
            </div>
          )}

        {workExperience.content.some(
          (exp) => exp.Company || exp.Role || exp.Duration || exp.Description
        ) && (
            <div className="w-full px-10 pt-6">
              {/* Section Title */}
              <div className="flex gap-12 mb-5">
                <div className="min-w-[130px]">
                  <h2 className="text-sm text-[#2c6472]  font-bold tracking-widest uppercase">
                    {t("experience", language)}
                  </h2>
                </div>
              </div>

              {/* Experience Entries */}
              {workExperience.content.map((exp, idx) => {
                const hasContent =
                  exp.Company || exp.Role || exp.Duration || exp.Description;
                if (!hasContent) return null;

                return (
                  <div
                    key={idx}
                    className="flex gap-4 items-start  pt-1"
                    style={{
                      breakInside: "avoid",
                    }}
                  >
                    {/* Left: Company Info */}
                    <div className="w-[180px] flex flex-col gap-0.5">
                      {exp.Company && (
                        <p className="text-[15px] font-bold text-[#2c6472]">
                          {exp.Company}
                        </p>
                      )}
                      {exp.Role && (
                        <p className="text-sm text-[#497d8a]">{exp.Role}</p>
                      )}
                      {exp.Duration && (
                        <p className="text-xs text-[#497d8a]">{exp.Duration}</p>
                      )}
                    </div>

                    {/* Right: Description */}
                    <div className="flex-1 text-[13px] text-black mb-5">
                      {Array.isArray(exp.Description) ? (
                        <ul className="list-disc space-y-2.5">
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

              {/* Bottom border */}
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
          <div className="w-full px-10 pt-6">
            {/* Section Title */}
            <div className="flex gap-12 mb-5">
              <div className="">
                <h2 className="text-sm text-[#2c6472] font-bold tracking-widest uppercase">
                  {t("projects", language)}

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
                <div
                  key={idx}
                  className="flex mb-6 min-w-[130px] items-start "
                  style={{ breakInside: "avoid" }}
                >
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
                      <ul className="list-disc ml-4 mt-2 space-y-2.5">
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
        certificates.content.filter((cert) => cert.certificate_name?.trim()).length > 0 && (
          <div className="px-10 pt-6">
            <div className="w-full flex">
              <h2 className="text-sm w-[160px] mb-3 text-[#2c6472] font-bold tracking-widest uppercase">
                {t("certificates", language)}
              </h2>

              {/* Certificate list */}
              <ul className="list-disc text-sm font-medium ml-5 text-gray-700 space-y-0.5">
                {certificates.content.map((cert, index) =>
                  cert.certificate_name?.trim() ? (
                    <li
                      key={index}
                      className="avoid-page-break"
                      style={{ breakInside: "avoid" }}
                    >
                      {cert.certificate_name}
                      {cert.provider && (
                        <span className=" font-normal text-gray-700"> - {cert.provider}</span>
                      )}
                    </li>
                  ) : null
                )}
              </ul>
            </div>

            {/* Bottom border */}
            <div className="mt-5 border-b border-gray-300 w-full"></div>
          </div>
        )}

      <div className="flex gap-5 text-sm px-10 pt-6 pb-5 flex-col">
        {/* Languages - Left Side */}
        {languages.content &&
          languages.content.filter((lang) => lang.language?.trim()).length > 0 && (
            <div className="w-full flex" style={{ breakInside: "avoid" }}>
              <h2 className="text-sm mb-3 w-[160px]  text-[#2c6472] font-bold tracking-widest uppercase">
                {t("languages", language)}
              </h2>

              <ul className="list-disc ml-5 text-gray-700 font-medium text-sm space-y-0.5">
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
                        <span className=" text-gray-500"> - {lang.proficiency}</span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          )}

        <div className="border-b border-gray-300 w-full"></div>

        {/* Skills - Right Side */}
        {skills.content && skills.content.length > 0 && (
          <div
            className="pb-5 w-full flex"
            style={{ breakInside: "avoid" }}
          >
            <h2 className="text-sm min-w-[180px]   mb-3 text-[#2c6472] font-bold tracking-widest uppercase">
              {t("skills", language)}
            </h2>
            <div className="text-black text-[13px] leading-6">
              {skills.content
                .filter((skill) => skill.trim() !== "")
                .map((skill, index) => (
                  <span key={index}>
                    {skill}
                    {index < skills.content.length - 1 && "  |  "}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EuropassCV;
