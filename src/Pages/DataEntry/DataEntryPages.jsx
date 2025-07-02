import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DataEntrySidebar from '../../base/DataEntrySIdebar/DataEntrySidebar';
import Languages from '../../base/new-data-entry/Languages';
import warning from '../../assets/carbon_warning.png';
import Certificates from '../../base/new-data-entry/Certificates';
import JobTitles from '../../base/new-data-entry/JobTitles';
import Skills from '../../base/new-data-entry/Skills';
import PersonalInfo from '../../base/new-data-entry/PersonalInfo';
import WorkExperience from '../../base/new-data-entry/WorkExperience';
import Education from '../../base/new-data-entry/Education';
import Projects from '../../base/new-data-entry/Projects';

const DataEntryPages = () => {
  return (
    <div className="flex min-h-screen bg-white text-white">
      {/* Sidebar on the left */}
      <div className="w-[30%]  fixed top-0 left-0 bottom-0 p-5 z-10">
        <DataEntrySidebar />
      </div>

      {/* Main content on the right */}
      <div className="ml-[30%] flex flex-col bg-white p-5 w-[73%] text-black relative z-0">
        <div className="flex-grow">
          <Routes>
            <Route path="languages" element={<Languages />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="jobtitles" element={<JobTitles />} />
            <Route path="skills" element={<Skills />} />
            <Route path="personal-information" element={<PersonalInfo />} />
            <Route path="work-experience" element={<WorkExperience />} />
            <Route path="education" element={<Education />} />
            <Route path="projects" element={<Projects />} />
          </Routes>
        </div>

      
      </div>
    </div>
  );
};

export default DataEntryPages;
