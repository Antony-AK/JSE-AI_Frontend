import React, { useEffect, useState } from "react";


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
}) => {
  

  return (
    <div className="w-full max-w-[794px] mx-auto bg-white text-black font-sans text-[13px] leading-normal px-12 py-6">
      {/* 🔹 Header */}
      <div className="flex items-start gap-5">
        {imageToUse && (
          <img
            src={imageToUse}
            alt="Profile"
            className="w-[130px] h-[130px] rounded-full object-cover border"
          />
        )}
        <div className="text-[13px] flex flex-col gap-3">
          <h1 className="text-[40px] font-bold text-[#444]">
            {personalInfo?.Name}
          </h1>
          {personalInfo?.address && (
            <p><strong>📍Address: </strong> {personalInfo.Address}</p>
          )}

          <p>
            <strong>✉️ Email: </strong> {personalInfo?.Mail} &nbsp;&nbsp;
            <strong>📞 Phone: </strong> (+49) {personalInfo?.Phone}
          </p>
          {personalInfo?.Website && (
            <p>
              <strong>🌐 Portfolio: </strong>{" "}
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
              <strong>🔗 LinkedIn: </strong>{" "}
              <a
                href={personalInfo?.LinkedIn}
                className="text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
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
            <h2 className="text-[14px] justify-end flex font-bold text-blue-700 uppercase mb-2">ABOUT MYSELF</h2><hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
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
            <h2 className="text-[14px] font-bold text-blue-700  uppercase mb-2">WORK EXPERIENCE</h2><hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
          </div>
          {workExperience.content.map((job, idx) => (
            <div key={idx} className="flex gap-3 mb-5 mt-2">
              <div className="w-[20%] text-gray-600  text-[11.7px]">[ {job.Duration} ]</div>
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
            <h2 className="text-[14px] w-1/6 flex justify-end  font-bold text-blue-700  uppercase mb-2">PROJECTS</h2><hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
          </div>
          {projects.content.map((proj, idx) => (
            <div key={idx} className="flex gap-3 mb-5">
              <div className="w-1/5 text-gray-600  text-[12px]">[ {proj.Duration} ]</div>
              <div className="w-3/4">
                <div className="text-blue-700 font-bold">{proj.Name}</div>
                <div className="font-medium italic my-1">{proj.Company}</div>
                {proj.Skills && (
                  <p>
                    <strong>Skills Used:</strong> {proj.Skills}
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
              <h2 className="text-[14px] flex justify-end font-bold text-blue-700 uppercase mb-2">
                EDUCATION
              </h2>
              <hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
            </div>

            {education.content
              .filter((edu) => edu.degree?.trim())
              .map((edu, idx) => (
                <div key={idx} className="flex gap-3 mb-4">
                  <div className="w-1/5 text-gray-600 italic text-[12px]">
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

      {/* 🔸 Skills */}
      {skills?.content?.length > 0 && (
        <div className="flex flex-col pt-4 mt-3">
          <div className="w-full h-5 gap-5 flex items-center">
            <h2 className="text-[14px] flex justify-end font-bold text-blue-700 uppercase mb-2">
              SKILLS
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
              <h2 className="text-[14px] flex justify-end font-bold text-blue-700 uppercase mb-2">
                Languages
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
                      <span className="italic text-gray-500 text-[13px]">
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
              <h2 className="text-[14px] flex justify-end font-bold text-blue-700 uppercase mb-2">
                Certificates
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
                      <span className="italic text-gray-500 text-[13px]">
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
