import React, { useState, useRef, useEffect } from 'react';
import download_icon from '../../../assets/download.svg';
import save_icon from '../../../assets/tick.svg'
import edit_icon from '../../../assets/edit-icon.svg';
import ClPreview from './ClTemp';
import { useCl } from '../Context/ClContext';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const Cl = () => {

  const previewRef = useRef(null);

  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState(null);
  const { personalInfo, setPersonalInfo, paragraphs, setParagraphs } = useCl();

  const handleFieldChange = (key, value) => {
    setPersonalInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleParagraphChange = (index, value) => {
    const updated = [...paragraphs];
    updated[index] = value;
    setParagraphs(updated);
  };

const handleDownload = () => {
    if (!personalInfo.name || !personalInfo.title || paragraphs.length === 0) {
      alert("Please fill in all fields before downloading.");
      return;
    }

    const opt = {
      margin: 0,
      filename: 'cover_letter.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2.5,
        useCORS: true,
        scrollY: 0,
      },
      jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
    };

    html2pdf().set(opt).from(previewRef.current).save();
  };  

  useEffect(() => {
    const storedData = sessionStorage.getItem("generatedCL");

    if (storedData) {
      const parsed = JSON.parse(storedData);

      setPersonalInfo({
        name: parsed.name || "",
        title: parsed.title || "",
        mail: parsed.mail || "",
        contact: parsed.contact || "",
        address: parsed.address || "[ address ]"
      });

      setParagraphs(parsed.paragraphs || []);
    }
  }, []);

  return (
    <div className='flex flex-col justify-center items-center mx-auto'>
      <div className="flex items-center w-full px-4 mt-7">
        <div className="w-full text-center">
          <h2 className="text-2xl font-semibold">CL</h2>
        </div>
      </div>

      <div className="flex gap-5 p-5 mt-5">
        {/* LEFT */}
        <div className="w-[600px] space-y-4">
          {/* Personal Info */}
          <div className={`rounded-md px-4 py-3 bg-white text-sm border 
          ${activeSection === 'personalInfo' ? 'border-[#2c6472]' : 'border-gray-300'}`}>
          <div className="flex justify-between mb-2">
            <h2 className="font-semibold">Personal Information</h2>
            <img
              width="30px"
              className={`cursor-pointer p-2 rounded-full transition hover:bg-gray-300`}
              src={activeSection === 'personalInfo' ? save_icon : edit_icon}
              alt=""
              onClick={() => {
                if (activeSection === 'personalInfo') {
                  setActiveSection(null);
                } else {
                  setActiveSection('personalInfo');
                }
              }}
            />
          </div>

          <div className="pl-1 space-y-2">
            {Object.entries(personalInfo).map(([key, value]) => {
              const isEditable = !['name', 'mail', 'contact'].includes(key);

              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="font-semibold capitalize">{key}:</span>
                  <input
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    className={`w-[80%] outline-none bg-transparent 
                      ${activeSection === 'personalInfo' && isEditable ? 'border-b border-[#2c6472]' : ''}
                      ${!isEditable ? 'text-gray-600 cursor-not-allowed' : ''}`}
                    disabled={!isEditable || activeSection !== 'personalInfo'}
                  />
                </div>
              );
            })}
          </div>
        </div>

          {/* Paragraphs */}
          <div className={`rounded-md px-4 py-3 bg-white text-sm border 
            ${activeSection === 'content' ? 'border-[#2c6472]' : 'border-gray-300'}`}>
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Content</h2>
              <img
                width="30px"
                className={`cursor-pointer p-2 rounded-full transition ${
                activeSection === 'content' ? 'hover:bg-gray-300' : 'hover:bg-gray-300'
                }`}
                src={activeSection === 'content' ? save_icon : edit_icon}
                alt=""
                onClick={() => {
                if (activeSection === 'content') {
                setActiveSection(null);
                } else {
                setActiveSection('content');
                }
                }}
              />   
            </div>
            <div className="pl-1 space-y-3">
              {paragraphs.map((para, index) => (
                <textarea
                  key={index}
                  value={para}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  className={`w-full min-h-[190px] max-h-[350px] text-[#000000cc] font-medium resize-y outline-none bg-white px-2 py-1 rounded-md shadow-sm ${activeSection === 'content' ? 'border-b border-[#2c6472]' : ''}`}
                  disabled={activeSection !== 'content'}
                />
              ))}
            </div>
          </div>

          <button
            className="bg-[#2c6472] text-white mt-4 px-8 py-1.5 rounded-lg"
            onClick={() => {
              handleDownload();               // Trigger download first
              setActiveSection(null);         // Optional: cleanup UI
              navigate(-1); // Navigate back after delay
            }}
          >
            Download & Finish Editing
        </button>
        </div>

        {/* RIGHT */}
        <div ref={previewRef} className="w-[794px] h-[1123px] flex flex-col gap-5">
          <ClPreview />
        </div>
      </div>
    </div>
  );
};

export default Cl;
