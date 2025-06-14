import React from 'react';
import tick from '../../assets/tick.svg';
import logo from '../../assets/logo.png';
import personal_icon from '../../assets/personal-info-img.svg';
import work_exp from '../../assets/work-exp-icon.svg';
import work_exp_active from '../../assets/work-exp-icon-active.svg';
import education from '../../assets/education-icon.svg';
import education_active from '../../assets/education-icon-active.svg';
import project from '../../assets/project-icon.svg';
import project_active from '../../assets/project-icon-active.svg';
import languages from '../../assets/languages-icon.svg';
import languages_active from '../../assets/languages-icon-active.svg';
import certificates from '../../assets/certificates-icon.svg';
import certificates_active from '../../assets/certificates-icon-active.svg';
import designation from '../../assets/designation-icon.svg';
import designation_active from '../../assets/designation-icon-active.svg';
import skills from '../../assets/skills-icon.svg';
import skills_active from '../../assets/skills-icon-active.svg';

const currentSlug = 'Skills'; // Example slug, should be passed as a prop ideally

const sidebarItems = [
  { label: 'Personal Information', icon: personal_icon, activeIcon: personal_icon },
  { label: 'Work Experience', icon: work_exp, activeIcon: work_exp_active },
  { label: 'Education', icon: education, activeIcon: education_active },
  { label: 'Projects', icon: project, activeIcon: project_active },
  { label: 'Languages', icon: languages, activeIcon: languages_active },
  { label: 'Certificates / Awards', icon: certificates, activeIcon: certificates_active },
  { label: 'Designation', icon: designation, activeIcon: designation_active },
  { label: 'Skills', icon: skills, activeIcon: skills_active },
];

const DataEntrySidebar = () => {
  const currentIndex = sidebarItems.findIndex(item => item.label === currentSlug);

  return (
    <div className="w-[27%] min-h-[94vh] p-5 pl-10 bg-gradient-to-b from-[#2E8095] to-[#2C6472]">
      <div className="flex items-center mb-10">
        <img className='w-10 h-10 object-fill' src={logo} alt="JobFusion Logo" />
        <p className="text-white ml-2 text-lg font-semibold">JSE AI</p>
      </div>

      <div className="flex flex-col gap-7">
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
            <div key={index} className="flex items-center text-white gap-4">
              <div className="w-10 h-10 flex justify-center items-center rounded-full bg-white">
                <img width="15px" src={iconToUse} alt={`${item.label} Icon`} />
              </div>
              <p>{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataEntrySidebar;