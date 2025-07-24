import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import tick from "../../assets/tick.svg";
import logo from "../../assets/jsenewlogo.png";
import personal_icon from "../../assets/personal-info-img.svg";
import work_exp from "../../assets/work-exp-icon.svg";
import work_exp_active from "../../assets/work-exp-icon-active.svg";
import education from "../../assets/education-icon.svg";
import education_active from "../../assets/education-icon-active.svg";
import project from "../../assets/project-icon.svg";
import project_active from "../../assets/project-icon-active.svg";
import languages from "../../assets/languages-icon.svg";
import languages_active from "../../assets/languages-icon-active.svg";
import certificates from "../../assets/certificates-icon.svg";
import certificates_active from "../../assets/certificates-icon-active.svg";
import designation from "../../assets/designation-icon.svg";
import designation_active from "../../assets/designation-icon-active.svg";
import skills from "../../assets/skills-icon.svg";
import skills_active from "../../assets/skills-icon-active.svg";

const sidebarItems = [
  { slug: "personal-information", label: "Personal Information", icon: personal_icon, activeIcon: personal_icon },
  { slug: "work-experience", label: "Work Experience", icon: work_exp, activeIcon: work_exp_active },
  { slug: "education", label: "Education", icon: education, activeIcon: education_active },
  { slug: "projects", label: "Projects", icon: project, activeIcon: project_active },
  { slug: "languages", label: "Languages", icon: languages, activeIcon: languages_active },
  { slug: "certificates", label: "Certificates / Awards", icon: certificates, activeIcon: certificates_active },
  { slug: "jobtitles", label: "Designation", icon: designation, activeIcon: designation_active },
  { slug: "skills", label: "Skills", icon: skills, activeIcon: skills_active },
];

const DataEntrySidebar = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const slug = pathParts[pathParts.length - 1];

  const currentIndex = sidebarItems.findIndex((item) => item.slug === slug);

  const itemRefs = useRef([]);

  // Scroll to active item in mobile view
  useEffect(() => {
    if (itemRefs.current[currentIndex]) {
      itemRefs.current[currentIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex]);

  return (
    <div className="w-full p-5 md:pl-10 bg-gradient-to-b from-[#2E8095] to-[#2C6472] md:min-h-[94vh]">
      <div className="flex items-center mb-10">
        <img className="w-24 h-10 object-fill" src={logo} alt="JobFusion Logo" />
      </div>

      <div className="flex md:flex-col flex-row md:gap-7 overflow-x-hidden md:overflow-x-visible mb-5 scroll-smooth">
        {sidebarItems.map((item, index) => {
          let iconToUse;
          if (index < currentIndex) {
            iconToUse = tick;
          } else if (index === currentIndex) {
            iconToUse = item.activeIcon;
          } else {
            iconToUse = item.icon;
          }

          return (
            <div
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`flex items-center justify-center md:justify-start text-white gap-2 md:gap-4 px-2 md:px-0`}
            >
              <div className="w-10 h-10 flex justify-center items-center rounded-full bg-white">
                <img width="15px" src={iconToUse} alt={`${item.label} Icon`} />
              </div>
              <p className="hidden md:block">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataEntrySidebar;
