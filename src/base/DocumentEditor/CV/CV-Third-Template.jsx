import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../utils/api";

const ThirdCV = ({
  personalInfo,
  professionalSummary,
  workExperience,
  education,
  skills,
  languages,
  certificates,
  projects,
}) => {
  const [profileImage, setProfileImage] = useState(null);

  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${BASE_URL}/photo`, {
          headers,
          responseType: "blob",
        });

        const imageUrl = URL.createObjectURL(res.data);
        setProfileImage(imageUrl);
        console.log("✅ Profile image loaded:", imageUrl);
      } catch (error) {
        console.error("❌ Failed to fetch profile image:", error);
      }
    };

    if (token) fetchProfileImage();
  }, [token]);

  // Use fetched image if available
  const imageToUse = profileImage || personalInfo?.profileImage;

  return (
    <div className="w-full max-w-[794px] mx-auto bg-white text-black font-sans text-[13px] leading-normal px-8 py-6">
      {/* Header */}
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
          {/* <p><strong>📍 Address:</strong> {personalInfo?.Address}</p> */}
          <p>
            <strong>✉️ Email:</strong> {personalInfo?.Mail} &nbsp;&nbsp;
            <strong>📞 Phone:</strong> (+49) {personalInfo?.Phone}
          </p>
          {personalInfo?.Website && (
            <p>
              <strong>🌐 Portfolio:</strong>{" "}
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
              <strong>🔗 LinkedIn:</strong>{" "}
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

      {/* About Myself */}
      {professionalSummary?.content && (
        <TwoColumnSection title="ABOUT MYSELF">
          <p className="text-gray-800">{professionalSummary.content}</p>
        </TwoColumnSection>
      )}

      {workExperience?.content?.length > 0 && (
        <TwoColumnSection className="avoid-page-break " title="WORK EXPERIENCE">
          {workExperience.content.map((job, idx) => (
            <div
              key={idx}
              className="avoid-page-break"
              style={{ breakInside: "avoid" }}
            >
              <p className="text-gray-600 italic text-[12px]">{job.Duration}</p>
              <p className="text-blue-700 font-bold">{job.Role}</p>
              <p className="font-semibold italic">{job.Company}</p>
              {job.Description && (
                <div className="text-[13px] text-gray-800 mt-1">
                  <strong>Description:</strong>
                  {Array.isArray(job.Description) ? (
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                      {job.Description.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1">{job.Description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </TwoColumnSection>
      )}

      {projects?.content?.length > 0 && (
        <TwoColumnSection className="avoid-page-break" title="PROJECTS">
          {projects.content.map((proj, idx) => (
            <div
              key={idx}
              className="avoid-page-break"
              style={{ breakInside: "avoid" }}
            >
              <p className="text-gray-600 italic text-[12px]">
                {proj.Duration}
              </p>
              <p className="text-blue-700 font-bold">{proj.Name}</p>
              <p className="italic">{proj.Company}</p>
              {proj.Skills && (
                <p>
                  <strong>Skills Used:</strong> {proj.Skills}
                </p>
              )}
              {proj.Description && (
                <div className="text-[13px] text-gray-800 mt-1">
                  {Array.isArray(proj.Description) ? (
                    <ul className="list-disc ml-5 space-y-1">
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
          ))}
        </TwoColumnSection>
      )}

      {education?.content?.length > 0 && (
        <TwoColumnSection className="avoid-page-break" title="EDUCATION">
          {education.content.map((edu, idx) => (
            <p
              key={idx}
              className="mb-2 avoid-page-break"
              style={{ breakInside: "avoid" }}
            >
              {edu.degree}
            </p>
          ))}
        </TwoColumnSection>
      )}

      {skills?.content?.length > 0 && (
        <TwoColumnSection className="avoid-page-break" title="SKILLS">
          {skills.content.map((skill, idx) => (
            <p
              key={idx}
              className="flex items-center gap-1 avoid-page-break"
              style={{ breakInside: "avoid" }}
            >
              <span className="text-blue-600 text-2xl">•</span> {skill}
            </p>
          ))}
        </TwoColumnSection>
      )}

      {languages?.content?.length > 0 && (
        <TwoColumnSection className="avoid-page-break" title="LANGUAGES">
          {languages.content.map((lang, idx) => (
            <p
              key={idx}
              className="flex items-center gap-1 avoid-page-break"
              style={{ breakInside: "avoid" }}
            >
              <span className="text-blue-600 text-2xl">•</span> {lang}
            </p>
          ))}
        </TwoColumnSection>
      )}

      {certificates?.content?.length > 0 && (
        <TwoColumnSection className="avoid-page-break" title="CERTIFICATES">
          {certificates.content.map((cert, idx) => (
            <p
              key={idx}
              className="flex items-center gap-1 avoid-page-break"
              style={{ breakInside: "avoid" }}
            >
              <span className="text-blue-600 text-2xl">•</span>{" "}
              {cert?.Name || cert}
            </p>
          ))}
        </TwoColumnSection>
      )}
    </div>
  );
};

const TwoColumnSection = ({ title, children }) => (
  <div className="grid grid-cols-5 gap-4 border-t border-gray-200 pt-4 mt-6">
    <div className="col-span-1">
      <h2 className="text-[13px] font-bold text-blue-700 uppercase">{title}</h2>
    </div>
    <div className="col-span-4">{children}</div>
  </div>
);

export default ThirdCV;
