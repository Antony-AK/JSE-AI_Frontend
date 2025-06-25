import { createContext, useContext, useState, useEffect } from 'react';
import { BASE_URL } from '../../../utils/api';

const CvContext = createContext();

export const CvProvider = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState({
    Name: "", Title: "", Mail: "", Phone: "", LinkedIn: "", Website: ""
  });

  const [professionalSummary, setProfessionalSummary] = useState({
    title: "Professional Summary", content: ""
  });

  const [workExperience, setWorkExperience] = useState({
    title: "Work Experience", content: []
  });

  const [education, setEducation] = useState({
    title: "Education", content: []
  });

  const [projects, setProjects] = useState({
    title: "Projects", content: []
  });

  const [certificates, setCertificates] = useState({
    title: "Certificates", content: []
  });

  const [skills, setSkills] = useState({
    title: "Skills", content: []
  });

  const [languages, setLanguages] = useState({
    title: "Languages", content: []
  });

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        const stored = sessionStorage.getItem("generatedCV");
        const parsed = JSON.parse(stored || "{}");
        const jobId = parsed.job_id;
        const token = sessionStorage.getItem("authToken"); // 🔐 Fetch Bearer token

        if (!jobId) {
          console.warn("No job_id found in sessionStorage.");
          return;
        }

        const response = await fetch(
          `${BASE_URL}/internal/generate-resume?job_id=${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 🔐 Add Bearer token here
              "Content-Type": "application/json"
            }
          }
        );

        const result = await response.json();
        const rawData = result.cv_data;

        setPersonalInfo({
          Name: rawData.personal_info?.name || "",
          Title: rawData.personal_info?.title || "",
          Mail: rawData.personal_info?.mail || "",
          Phone: rawData.personal_info?.phone || "",
          LinkedIn: rawData.personal_info?.linkedin || "",
          Website: rawData.personal_info?.portfolio || "",
        });

        setProfessionalSummary({
          title: "Professional Summary",
          content: rawData.profile_summary || ""
        });

        setWorkExperience({
          title: "Work Experience",
          content: (rawData.work_experience || []).map(item => ({
            Role: item.position || "",
            Company: item.company_name || "",
            Duration: item.period || "",
            Description: item.description || ""
          }))
        });

        setEducation({
          title: "Education",
          content: (rawData.education || []).map(entry => ({
            degree: entry || ""
          }))
        });

        setProjects({
          title: "Projects",
          content: (rawData.projects || []).map(item => ({
            Name: item.project_name || "",
            Company: item.company_name || "",
            Duration: item.period || "",
            Skills: item.skills_used || "",
            Description: item.description || ""
          }))
        });

        setCertificates({
          title: "Certificates",
          content: (rawData.certifications || []).map(name => ({
            Name: name || ""
          }))
        });

        setSkills({
          title: "Skills",
          content: rawData.skills || []
        });

        setLanguages({
          title: "Languages",
          content: rawData.languages || []
        });

      } catch (error) {
        console.error("Error fetching CV data from backend:", error);
      }
    };

    fetchCVData();
  }, []);

  return (
    <CvContext.Provider value={{
      personalInfo, setPersonalInfo,
      professionalSummary, setProfessionalSummary,
      workExperience, setWorkExperience,
      education, setEducation,
      projects, setProjects,
      certificates, setCertificates,
      skills, setSkills,
      languages, setLanguages
    }}>
      {children}
    </CvContext.Provider>
  );
};

export const useCv = () => useContext(CvContext);