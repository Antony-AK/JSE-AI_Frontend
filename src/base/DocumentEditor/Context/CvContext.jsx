import { createContext, useContext, useState } from 'react';

const CvContext = createContext();

export const CvProvider = ({ children }) => {

    const [personalInfo, setPersonalInfo] = useState({
        Name: "Alex Johnson",
        Title: "Software Engineer",
        Mail: "Ramani.mallempuri@gmail.com",
        Phone: "‪+49 17624931591‬",
        LinkedIn: "www.linkedin.com/alex",
        Portfolio: "www.reallygreatsite.com",
        Address: "Prenzlauer Allee 172, Berlin 10409"
    }); 
        
    const [professionalSummary, setProfessionalSummary] = useState({
        title: "Professional Summary",
        content: "Experienced Software Engineer with expertise in Golang, React, PostgreSQL, Docker, Python, and AI/ML. Skilled in Project Management, Teamwork, and Effective Communication. Led full-stack development at TechCorp and built REST APIs at StartUpXYZ. Seeking to contribute to deployment, automation, and security at a cloud software company."
    })
    
    const [workExperience, setWorkExperience] = useState({
        title: "Work Experience",
        content: [
            {
                Role: "Software Engineer",
                Company: "TechCorp",
                Duration: "07/2019 - 06/2023",
                Description: "Led full-stack development for a SaaS platform at TechCorp, implementing Golang, React, PostgreSQL, Docker, and Python. Managed project timelines, coordinated with cross-functional teams, and ensured effective communication throughout the development process."
            },
            {
                Role: "Backend Developer",
                Company: "StartUpXYZ",
                Duration: "10/2018 - 12/2019",
                Description: "Built REST APIs and microservices at StartUpXYZ using Golang, Docker, and PostgreSQL. Collaborated with front-end developers to integrate backend functionality, ensuring smooth performance and scalability of the application."
            }
        ]
    });
    
    const [education, setEducation] = useState({
        title: "Education",
        content: [
            {
                degree: "Masters of Computer Science Engineering",
                university: "BORCELLE UNIVERSITY",
                duration: "2029 - 2030",
                idxLabel: "Masters"
            },
            {
                degree: "Bachelors of Computer Science Engineering",
                university: "BORCELLE UNIVERSITY",
                duration: "2025 - 2029",
                idxLabel: "Bachelors"
            }
        ]
    });
    
    const [projects, setProjects] = useState({
        title: "Projects",
        content: [
            {
                Name: "Automated Spear-Phisher",
                Company: "POSTECH",
                Duration: "Jun 2010 - Jun 2017",
                Skills: "Python, PySpark, Selenium, Apache, NLP, Big Data",
                Description: "Developed a security research tool at POSTECH to send targeted spam messages on social media platforms. Utilized Python, PySpark, and NLP techniques to analyze target feeds and enhance message effectiveness. Implemented Big Data tools for data processing and automation."
            },
            {
                Name: "Image Repository",
                Company: "POSTECH",
                Duration: "Sep 2010 - Oct 2011",
                Skills: "Java, PHP, React, TypeScript, Maven, GCP, MySQL",
                Description: "Created a full-stack image repository at POSTECH with CP-ABE encryption for file security. Developed a GCP cloud function for encryption implementation. Utilized Java, PHP, React, and MySQL to build a user-friendly interface for file storage."
            }
        ]
    });
    
    const [certificates, setCertificates] = useState({
        title: "Certificates",
        content: [
            { Name: "AWS Certified Developer" },
            { Name: "ML Certified Developer" }
        ]
    });
    
    const [skills, setSkills] = useState({
        title: "Skills",
        content: [
            { name: "Golang", level: "Advanced" },
            { name: "Python", level: "Advanced" },
            { name: "Docker", level: "Advanced" },
            { name: "React", level: "Intermediate" },
            { name: "PostgreSQL", level: "Intermediate" }
        ]
    });
    
    const [languages, setLanguages] = useState({
        title: "Languages",
        content: {
            Fluent: ["English", "French"],
            Basics: ["German", "Spanish"]
        }
    });

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
