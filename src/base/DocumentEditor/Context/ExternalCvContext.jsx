import { createContext, useContext, useState } from 'react';

const ExternalCvContext = createContext();

export const ExternalCvProvider = ({ children }) => {
  // Fetch from sessionStorage
  const stored = JSON.parse(sessionStorage.getItem("cv_data")) || {};
  const rawData = stored.cv_data || {};

  // Transform rawData to match internal structure
  const cvData = {
    personalInfo: {
      Name: rawData.personal_info?.name || "",
      Title: rawData.personal_info?.title || "",
      Mail: rawData.personal_info?.mail || "",
      Phone: rawData.personal_info?.phone || "",
      LinkedIn: rawData.personal_info?.linkedin || "",
      Website: rawData.personal_info?.portfolio || "[ your website ]",
    },
    professionalSummary: {
      title: "Professional Summary",
      content: rawData.profile_summary || ""
    },
    workExperience: {
      title: "Work Experience",
      content: (rawData.work_experience || []).map(item => ({
        Role: item.position || "",
        Company: item.company_name || "",
        Duration: item.period || "",
        Description: item.description || ""
      }))
    },
    education: {
      title: "Education",
      content: (rawData.education || []).map(entry => ({
        degree: entry || ""
      }))
    },
    projects: {
      title: "Projects",
      content: (rawData.projects || []).map(item => ({
        Name: item.project_name || "",
        Company: item.company_name || "",
        Duration: item.period || "",
        Skills: item.skills_used || "",
        Description: item.description || ""
      }))
    },
    certificates: {
      title: "Certificates",
      content: (rawData.certifications || []).map(name => ({
        Name: name || ""
      }))
    },
    skills: {
      title: "Skills",
      content: rawData.skills || []
    },
    languages: {
      title: "Languages",
      content: rawData.languages || []
    }
  };

  // Initialize state
  const [personalInfo, setPersonalInfo] = useState(cvData.personalInfo);
  const [professionalSummary, setProfessionalSummary] = useState(cvData.professionalSummary);
  const [workExperience, setWorkExperience] = useState(cvData.workExperience);
  const [education, setEducation] = useState(cvData.education);
  const [projects, setProjects] = useState(cvData.projects);
  const [certificates, setCertificates] = useState(cvData.certificates);
  const [skills, setSkills] = useState(cvData.skills);
  const [languages, setLanguages] = useState(cvData.languages);

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