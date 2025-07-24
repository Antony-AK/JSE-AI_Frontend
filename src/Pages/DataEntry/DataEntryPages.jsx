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
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-black">
      {/* Sidebar on the left */}
      <div className="w-full md:w-[30%] bottom-0 p-5 z-10">
        <DataEntrySidebar />
      </div>

      {/* Main content on the right */}
      <div className="w-full md:w-[70%] p-5">
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
  );
};

export default DataEntryPages;
