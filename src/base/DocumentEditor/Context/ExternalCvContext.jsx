import { createContext, useContext, useEffect, useState } from 'react';
import { BASE_URL } from '../../../utils/api';

const ExternalCvContext = createContext();

export const ExternalCvProvider = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState({});
  const [professionalSummary, setProfessionalSummary] = useState({});
  const [workExperience, setWorkExperience] = useState({ title: "", content: [] });
const [projects, setProjects] = useState({ title: "", content: [] });
const [education, setEducation] = useState({ title: "", content: [] });
const [skills, setSkills] = useState({ title: "", content: [] });
const [languages, setLanguages] = useState({ title: "", content: [] });
const [certificates, setCertificates] = useState({ title: "", content: [] });


  useEffect(() => {
    const fetchCVData = async () => {
      try {
           const jobId = sessionStorage.getItem("externalJobId"); // ✅ Make sure this is stored earlier

        const token = sessionStorage.getItem("authToken");

        if (!jobId || !token) {
          console.warn("Missing job ID or auth token.");
          return;
        }

        const response = await fetch(`${BASE_URL}/external/generate?job_id=${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch CV data");
        }

        const { cv_data: rawData = {} } = await response.json();

        // Map and set all CV sections
        setPersonalInfo({
          Name: rawData.personal_info?.name || "",
          Title: rawData.personal_info?.title || "",
          Mail: rawData.personal_info?.mail || "",
          Phone: rawData.personal_info?.phone || "",
          LinkedIn: rawData.personal_info?.linkedin || "",
          Website: rawData.personal_info?.portfolio || "[ your website ]"
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
            degree: entry.degree || "",
            city: entry.city || "",
            field_of_study: entry.field_of_study || "",
            end_date: entry.end_date || "",
            achievements: entry.achievements || ""
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
          content: (rawData.certifications || []).map(cert => ({
            certificate_name: cert.certificate_name || "",
            provider: cert.provider || ""
          }))
        });

        setSkills({
          title: "Skills",
          content: rawData.skills || []
        });

        setLanguages({
          title: "Languages",
          content: (rawData.languages || []).map(entry => ({
            language: entry.language || "",
            proficiency: entry.proficiency || ""
          }))
        });

      } catch (error) {
        console.error("❌ Error fetching CV data:", error.message);
      }
    };

    fetchCVData();
  }, []);

  return (
    <ExternalCvContext.Provider value={{
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
    </ExternalCvContext.Provider>
  );
};

export const useExternalCv = () => useContext(ExternalCvContext);