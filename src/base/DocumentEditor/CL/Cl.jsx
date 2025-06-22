import React, { useState } from 'react';
import download_icon from '../../../assets/download.svg';
import edit_icon from '../../../assets/edit-icon.svg';

const Cl = () => {
    const [activeSection, setActiveSection] = useState(null);

  const [personalInfo, setPersonalInfo] = useState({
    Name: "Koushik Babu2025 now",
    Title: "Software Engineer",
    Email: "Ramani.mallempuri@gmail.com",
    Contact: "+49 17624931591",
    Address: "34th cross street, Prenzlauer Allee 172, Berlin 10409",
  });

  const [paragraphs, setParagraphs] = useState([
    "I am writing to express my interest in the Software Engineer position at your company. With a Master's degree in Computer Science Engineering and extensive experience in software development...",
    "In addition to my technical skills, I have a strong background in project management, teamwork, and effective communication...",
    "I am excited about the opportunity to contribute to your team and help improve the CI/CD tools and processes..."
  ]);

  const handleFieldChange = (key, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleParagraphChange = (index, value) => {
    const updated = [...paragraphs];
    updated[index] = value;
    setParagraphs(updated);
  };

  return (
    <>
      <div className="flex items-center w-full px-4 mt-5">
        <div className="flex-1" />
        <div className="flex-1 text-center">
          <h2 className="text-xl font-semibold">CL</h2>
        </div>
        <div className="flex-1 flex justify-end">
          <button className="flex items-center gap-4 bg-[#2c6472] px-8 py-1.5 rounded-lg">
            <img width="12px" src={download_icon} alt=" " />
            <p className="text-white text-sm">Download</p>
          </button>
        </div>
      </div>

      <div className="flex w-full gap-5 p-5">
        {/* LEFT */}
        <div className="w-1/2 space-y-4">
          {/* Personal Info */}
          <div className={`rounded-md px-4 py-3 bg-white text-sm text-gray-700 border 
        ${activeSection === 'personalInfo' ? 'border-[#2c6472]' : 'border-gray-300'}`}>
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-gray-800">Personal Information</h2>
              <img
                width="12px"
                src={edit_icon}
                alt="Edit"
                className="cursor-pointer"
                onClick={() => setActiveSection('personalInfo')}
              />
            </div>
            <div className="pl-1 space-y-2">
              {Object.entries(personalInfo).map(([key, value]) => (
                <div key={key} className='flex items-center gap-3'>
                  <span className="text-sm font-semibold text-gray-700">{key}:</span>
                  <p
                    contentEditable={activeSection === 'personalInfo'}
                    suppressContentEditableWarning
                    onBlur={(e) => handleFieldChange(key, e.target.innerText.trim())}
                    className="text-[#00000082] font-medium cursor-text outline-none"
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className={`rounded-md px-4 py-3 bg-white text-sm text-gray-700 border 
        ${activeSection === 'content' ? 'border-[#2c6472]' : 'border-gray-300'}`}>
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-gray-800">Content</h2>
              <img
                width="12px"
                src={edit_icon}
                alt="Edit"
                className="cursor-pointer"
                onClick={() => setActiveSection('content')}
              />
            </div>
            <div className="pl-1 space-y-3">
              {paragraphs.map((para, index) => (
                <p
                  key={index}
                  contentEditable={activeSection === 'content'}
                  suppressContentEditableWarning
                  onBlur={(e) => handleParagraphChange(index, e.target.innerText.trim())}
                  className="text-[#00000082]  font-medium cursor-text outline-none"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div className="flex justify-start">
            <button
              className="bg-[#2c6472] text-white px-8 py-1.5 rounded-2xl"
               onClick={() => setActiveSection(null)}
            >
              Finish Editing
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-[50%] flex flex-col gap-5">
          <div className="h-[842px] flex bg-white"></div>
          
        </div>
      </div>
    </>
  );
};

export default Cl;
