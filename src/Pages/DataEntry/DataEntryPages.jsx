import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DataEntrySidebar from '../../base/DataEntrySIdebar/DataEntrySidebar';
import Languages from '../../base/new-data-entry/Languages';
import warning from '../../assets/carbon_warning.png';
import PersonalInfo from '../../base/new-data-entry/PersonalInfo';

const DataEntryPages = () => {
  return (
    <div className='relative p-5 min-h-screen bg-white text-white'>
      <DataEntrySidebar />
      <div style={{ width: "calc(100% - 27%)" }} className='ms-[27%] fixed top-5 flex h-full text-black'>
        <Routes>
          <Route path="/languages" element={<Languages />} />
          <Route path="/personal-information" element={<PersonalInfo />} />
        </Routes>

      </div>
      <div className='flex absolute text-gray-500 text-sm ms-[32%] bottom-5'> <img src={warning} className='w-5 me-2 h-5 object-cover' alt="" />AI helps, but it’s not perfect. Make sure your data is accurate before saving.</div>

    </div>


  );
};

export default DataEntryPages;
