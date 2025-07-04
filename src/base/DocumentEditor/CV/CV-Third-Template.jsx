import React, { useEffect, useState } from "react";
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
      } catch (error) {
        console.error("❌ Failed to fetch profile image:", error);
      }
    };

    if (token) fetchProfileImage();
  }, [token]);

  console.log("💡 personalInfo =>", personalInfo);


  const imageToUse = profileImage || personalInfo?.profileImage;

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
            <h2 className="text-[14px] w-1/6  justify-end flex font-bold text-blue-700 uppercase mb-2">ABOUT MYSELF</h2><hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
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
            <h2 className="text-[14px] -ml-5  font-bold text-blue-700  uppercase mb-2">WORK EXPERIENCE</h2><hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
          </div>
          {workExperience.content.map((job, idx) => (
            <div key={idx} className="flex gap-3 mb-5">
              <div className="w-1/5 text-gray-600  text-[12px]">[ {job.Duration} ]</div>
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
      {education?.content?.length > 0 && (
        <div className=" pt-4 mt-3">
 <div className="w-full h-5 gap-5 flex items-center">
            <h2 className="text-[14px] w-1/6 flex justify-end  font-bold text-blue-700  uppercase mb-2">EDUCATION</h2><hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
          </div>
                    {education.content.map((edu, idx) => (
            <div key={idx} className="flex gap-3 mb-4">
              <div className="w-1/5 text-gray-600 italic text-[12px]">{edu.Duration}</div>
              <div className="w-3/4">
                <div className="text-gray-700 font-medium">{edu.degree}</div>
                <div className="italic">{edu.institution}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔸 Skills */}
      {skills?.content?.length > 0 && (
        <div className="flex flex-col pt-4 mt-3">
           <div className="w-full h-5 gap-5 flex items-center">
            <h2 className="text-[14px] w-1/6 flex justify-end  font-bold text-blue-700  uppercase mb-2">SKILls</h2><hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
          </div>
          <div className="ms-[150px] flex flex-wrap gap-1 w-3/4 ">
            {skills.content.map((skill, idx) => (
              <p key={idx} className="flex items-center gap-1">{skill}
                <span className="text-gray-500 text-lg">|</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 🔸 Languages */}
      {languages?.content?.length > 0 && (
        <div className="flex flex-col pt-4 mt-3">
         <div className="w-full h-5 gap-5 flex items-center">
            <h2 className="text-[14px] w-1/6 flex justify-end  font-bold text-blue-700  uppercase mb-2">Languages</h2><hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
          </div>
          <div className=" ms-[150px] flex flex-wrap w-3/4 gap-1">
            {languages.content.map((lang, idx) => (
              <p key={idx} className="flex items-center gap-1">{lang}
                <span className="text-gray-500 text-lg">|</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 🔸 Certificates */}
      {certificates?.content?.length > 0 && (
        <div className="flex flex-col pt-4 mt-3">
         <div className="w-full h-5 gap-5 flex items-center">
            <h2 className="text-[14px] w-1/6 flex justify-end  font-bold text-blue-700  uppercase mb-2">Certificates</h2><hr className="w-full flex flex-1 items-center h-0.5 bg-gray-200" />
          </div>
          <div className="ms-[150px] flex flex-wrap w-3/4 gap-1">
            {certificates.content.map((cert, idx) => (
              <p key={idx} className="flex items-center gap-1">{cert?.Name || cert}
                <span className="text-gray-500 text-lg">|</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThirdCV;
