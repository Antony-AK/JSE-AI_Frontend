import React, { useState } from 'react';
import download_icon from '../../../assets/download.svg';
import edit_icon from '../../../assets/edit-icon.svg';
import LatexPreview from './LatexPreview';
import ClPreview from './ClTemp';

const Cl = () => {
  const [activeSection, setActiveSection] = useState(null);

  const [personalInfo, setPersonalInfo] = useState({
    name: "Koushik Babu2025 now",
    title: "Software Engineer",
    mail: "Ramani.mallempuri@gmail.com",
    contact: "+49 17624931591",
    address: "34th cross street, Prenzlauer Allee 172, Berlin 10409",
  });

  const [paragraphs, setParagraphs] = useState([
    "I am writing to express my enthusiastic interest in the Software Engineer position at your esteemed organization. With a Master's degree in Computer Science Engineering, and over 5 years of hands-on experience in full-stack web development, I have honed my skills in building scalable, performant, and user-centric applications. My expertise spans across the MERN stack, RESTful API integration, cloud deployment (AWS & Azure), and agile development methodologies.",

    "Throughout my career, I have consistently delivered impactful software solutions that enhanced user experience and increased operational efficiency. In my previous role at Zidio Development, I led a team in designing a smart task scheduling system (WorkFlowIQ) using React, Node.js, MongoDB, and Express. I also integrated Redux for advanced state management and implemented drag-and-drop calendar features to boost productivity. The success of this project not only strengthened my technical foundation but also enhanced my leadership and communication skills.",

    "Beyond coding, I take immense pride in collaborating cross-functionally and ensuring project milestones are met with precision and innovation. I am passionate about clean code architecture, writing reusable components, and implementing CI/CD pipelines to streamline the development lifecycle. Joining your team excites me because I am confident I can bring fresh perspectives, dedication, and technical excellence that align with your mission to build world-class software products."

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
      <div className="flex items-center w-full px-4 mt-7">
        <div className="" />
        <div className=" w-full text-center">
          <h2 className="text-2xl mx-auto font-semibold">CL</h2>
        </div>

      </div>

      <div className="flex w-full gap-5 p-5 mt-5">
        {/* LEFT */}
        <div className="w-[600px] space-y-4 ">
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
                  <input
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    className={`text-[#00000082] w-[80%] font-medium outline-none bg-transparent ${activeSection === 'personalInfo' ? 'border-b border-[#2c6472]' : ''
                      }`}
                    disabled={activeSection !== 'personalInfo'}
                  />
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
                <textarea
                  key={index}
                  value={para}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  className={`w-full min-h-[190px] max-h-[350px] text-[#000000cc] font-medium resize-y outline-none bg-white px-2 py-1 rounded-md shadow-sm ${activeSection === 'content' ? 'border-b border-[#2c6472]' : ' '}`}
                  disabled={activeSection !== 'content'}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-start">
            <button
              className="bg-[#2c6472] text-white mt-4 px-8 py-1.5 rounded-lg"
              onClick={() => setActiveSection(null)}
            >
              Finish Editing
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className=" flex flex-col gap-5">
          <ClPreview data={{
            name: personalInfo.name,
            title: personalInfo.title,
            mail: personalInfo.mail,
            contact: personalInfo.contact,
            address: personalInfo.address,
            paragraphs
          }} />
        </div>
      </div>
    </>
  );
};

export default Cl;
