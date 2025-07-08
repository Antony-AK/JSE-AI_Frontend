import React, { useEffect, useState } from "react";
import { useProfileImage } from '../../../base/ProfileEditor/ProfileImageContext';


const t = (key, lang = "en") => {
  const map = {
    contact: { en: "Contact", de: "Kontakt" },
    information: { en: "Information", de: "Informationen" },
    summary: { en: "Summary", de: "Zusammenfassung" },
    about: { en: "About Myself", de: "Über mich" },
    education: { en: "Education", de: "Ausbildung" },
    experience: { en: "Work Experience", de: "Berufserfahrung" },
    projects: { en: "Projects", de: "Projekte" },
    certificates: { en: "Certificates", de: "Zertifikate" },
    languages: { en: "Languages", de: "Sprachen" },
    skills: { en: "Skills", de: "Fähigkeiten" },
    address: { en: "Address", de: "Adresse" },
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

const ThirdCV = ({
  imageToUse,
  personalInfo,
  professionalSummary,
  workExperience,
  education,
  skills,
  languages,
  certificates,
  projects,
  language,

}) => {

  const { profileImage } = useProfileImage(); // 👈 use context




  return (
    <div className="w-full max-w-[794px] mx-auto bg-white text-black font-sans text-[13px] leading-normal px-12 py-6">
      {/* 🔹 Header */}
      <div className="flex items-start gap-5">
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="w-[130px] h-[130px] rounded-full object-cover border"
          />
        )}
        <div className="text-[13px] flex flex-col gap-3">
          <h1 className="text-[40px] font-bold text-[#444]">
            {personalInfo?.Name}
          </h1>
          {personalInfo?.address && (
            <p><strong>📍{t("address", language)}:
            </strong> {personalInfo.Address}</p>
          )}

          <p>
            <strong>✉️  {t("email", language)}: </strong> {personalInfo?.Mail} &nbsp;&nbsp;
            <strong>📞 {t("phone", language)}: </strong> (+49) {personalInfo?.Phone}
          </p>
          {personalInfo?.Website && (
            <p>
              <strong>🌐 {t("website", language)}: </strong>{" "}
              <a
                href={personalInfo?.Website}
                className="text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                {personalInfo?.Website}
              </a>
            </p>
          )}
          {personalInfo?.LinkedIn && (
            <p>
              <strong>🔗 {t("linkedin", language)}: </strong>{" "}
              <a
                href={
                  personalInfo.LinkedIn.startsWith("http")
                    ? personalInfo.LinkedIn
                    : `https://www.linkedin.com/in/${personalInfo?.LinkedIn}`
                }
                className="underline text-[#2c6472]"
                target="_blank"
                rel="noopener noreferrer"
              >
                {personalInfo?.LinkedIn}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* 🔸 About Myself */}
      {professionalSummary?.content && (
        <div className=" flex flex-col pt-4 mt-6">
          <div className="w-full h-5 gap-5 flex items-center">
            <h2 className="text-[14px] w-1/6 justify-start flex font-bold text-blue-700 uppercase mb-2">{t("about", language)}</h2><hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
          </div>
          <div className="ms-[140px] w-3/4 mt-3 flex items-center justify-end ">
            <p className="text-gray-800 ms-3 leading-relaxed">{professionalSummary.content}</p>
          </div>
        </div>
      )}

      {/* 🔸 Work Experience */}
      {workExperience?.content?.length > 0 && (
        <div className="flex flex-col pt-4 mt-3">
          <div className="w-full h-5 gap-5 flex items-center">
            <h2 className="text-[14px] w-1/6 font-bold text-blue-700  uppercase mb-2">{t("experience", language)}</h2><hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
          </div>
          {workExperience.content.map((job, idx) => (
            <div key={idx} className="flex gap-3 mb-5 mt-2">
              <div className="w-[20%] text-gray-600  text-[11.6px]">[ {job.Duration} ]</div>
              <div className="w-3/4">
                <div className="text-blue-700 font-bold">{job.Role}</div>
                <div className="font-medium my-1 italic">{job.Company}</div>
                {job.Description && (
                  <div className="text-[13px] text-gray-800 mt-1">
                    <strong>Description:</strong>
                    {Array.isArray(job.Description) ? (
                      <ul className="list-disc ml-5 mt-1 space-y-1">
                        {job.Description.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1">{job.Description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔸 Projects */}
      {projects?.content?.length > 0 && (
        <div className=" pt-4 mt-3">
          <div className="w-full h-5 gap-5 flex items-center">
            <h2 className="text-[14px] w-1/6 flex justify-start  font-bold text-blue-700  uppercase mb-2">{t("projects", language)}</h2><hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
          </div>
          {projects.content.map((proj, idx) => (
            <div key={idx} className="flex gap-3 mb-5">
              <div className="w-1/5 text-gray-600  text-[12px]">[ {proj.Duration} ]</div>
              <div className="w-3/4">
                <div className="text-blue-700 font-bold">{proj.Name}</div>
                <div className="font-medium italic my-1">{proj.Company}</div>
                {proj.Skills && (
                  <p>
                    <strong>{t("skills", language)}
                      :</strong> {proj.Skills}
                  </p>
                )}
                {proj.Description && (
                  <div className="text-[13px] text-gray-800 mt-1">
                    {Array.isArray(proj.Description) ? (
                      <ul className="list-disc ml-5 mt-1 space-y-1">
                        {proj.Description.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{proj.Description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔸 Education */}
      {education?.content?.length > 0 &&
        education.content.some((edu) => edu.degree?.trim()) && (
          <div className="pt-4 mt-3">
            <div className="w-full h-5 gap-5 flex items-center">
              <h2 className="text-[14px] w-1/6 flex justify-start font-bold text-blue-700 uppercase mb-2">
                {t("education", language)}
              </h2>
              <hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
            </div>

            {education.content
              .filter((edu) => edu.degree?.trim())
              .map((edu, idx) => (
                <div key={idx} className="flex gap-3 mb-4">
                  <div className="w-1/5   text-gray-600 italic text-[12px]">
                    {edu.end_date || "—"}
                  </div>
                  <div className="w-3/4">
                    <div className="text-gray-700 font-medium">
                      {edu.degree}
                      {edu.field_of_study && ` - ${edu.field_of_study}`}
                    </div>
                    <div className="italic text-[12px] text-gray-600">
                      {edu.school}
                      {edu.city && `${edu.city}`}
                    </div>
                    {edu.achievements?.trim() && (
                      <div className="text-[12px] text-gray-500 mt-1">
                        {edu.achievements}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

      {/*🔸Skills */}
      {skills?.content?.length > 0 && (
        <div className="flex flex-col pt-4 mt-3">
          <div className="w-full h-5 gap-5 flex items-center">
            <h2 className="text-[14px] w-1/6 flex justify-start font-bold text-blue-700 uppercase mb-2">
              {t("skills", language)}
            </h2>
            <hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
          </div>

          <div className="ms-[150px] flex flex-wrap gap-1 w-3/4">
            {skills.content.map((skill, idx) => (
              <p key={idx} className="flex items-center gap-1">
                {skill}
                {idx !== skills.content.length - 1 && (
                  <span className="text-gray-500 text-lg">|</span>
                )}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 🔸 Languages */}
      {languages?.content?.length > 0 &&
        languages.content.some((lang) => lang.language?.trim()) && (
          <div className="flex flex-col pt-4 mt-3">
            <div className="w-full h-5 gap-5 flex items-center">
              <h2 className="text-[14px] w-1/6 flex justify-start font-bold text-blue-700 uppercase mb-2">
                {t("languages", language)}
              </h2>
              <hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
            </div>

            <div className="ms-[150px] flex flex-wrap w-3/4 gap-1 text-[12px] text-gray-800">
              {languages.content
                .filter((lang) => lang.language?.trim())
                .map((lang, idx, arr) => (
                  <p key={idx} className="flex items-center gap-1 font-medium text-sm">
                    {lang.language}
                    {lang.proficiency && (
                      <span className=" text-gray-500 text-[13px]">
                        ({lang.proficiency})
                      </span>
                    )}
                    {idx !== arr.length - 1 && (
                      <span className="text-gray-500 text-lg">|</span>
                    )}
                  </p>
                ))}
            </div>
          </div>
        )}

      {/* 🔸 Certificates */}
      {certificates?.content?.length > 0 &&
        certificates.content.some((cert) => cert.certificate_name?.trim()) && (
          <div className="flex flex-col pt-4 mt-3">
            <div className="w-full h-5 gap-5 flex items-center">
              <h2 className="text-[14px] w-1/6 flex justify-start font-bold text-blue-700 uppercase mb-2">
                {t("certificates", language)}

              </h2>
              <hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
            </div>

            <div className="ms-[150px] flex flex-wrap w-3/4 gap-1 text-[12px] text-gray-800">
              {certificates.content
                .filter((cert) => cert.certificate_name?.trim())
                .map((cert, idx, arr) => (
                  <p key={idx} className="flex items-center gap-1 font-medium text-sm">
                    {cert.certificate_name}
                    {cert.provider && (
                      <span className=" text-gray-500 text-[13px]">
                        ({cert.provider})
                      </span>
                    )}
                    {idx !== arr.length - 1 && (
                      <span className="text-gray-500 text-lg">|</span>
                    )}
                  </p>
                ))}
            </div>
          </div>
        )}


    </div>
  );
};

export default ThirdCV;
