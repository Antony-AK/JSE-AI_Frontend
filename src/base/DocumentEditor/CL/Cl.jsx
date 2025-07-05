import React, { useState, useRef, useEffect } from 'react';
import download_icon from '../../../assets/download.svg';
import save_icon from '../../../assets/tick.svg'
import edit_icon from '../../../assets/edit-icon.svg';
import ClPreview from './ClTemp';
import axios from 'axios';
import { BASE_URL } from '../../../utils/api';
import { useCl } from '../Context/ClContext';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import CoverLetterPlush from './CoverLetterPlush';
import CoverLetterModern from './CL-Third-Temp';

const Cl = () => {

  const previewRef = useRef(null);

  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClTemplate, setSelectedClTemplate] = useState("ModernCL");

  const clTemplates = {
    "ModernCL": CoverLetterModern,
    "PlushCL": CoverLetterPlush,
    "ClassisCL": ClPreview,
  };




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

  const ActiveCLTemplate = clTemplates[selectedClTemplate];
  <ActiveCLTemplate personalInfo={personalInfo} paragraphs={paragraphs} />;



  useEffect(() => {
    // Wait until context data is populated
    if (personalInfo.name && paragraphs.length > 0) {
      setIsLoading(false);
    }
  }, [personalInfo, paragraphs]);


  const handleUpdateCoverLetter = async () => {
    const token = sessionStorage.getItem("authToken");
    const stored = sessionStorage.getItem("generatedCL");

    if (!token || !stored) {
      console.warn("⚠️ Missing auth token or cover letter data.");
      return;
    }

    const parsed = JSON.parse(stored);
    const jobId = parsed.job_id; // ✅ Get job_id from session data

    if (!jobId) {
      console.warn("⚠️ job_id is missing in generatedCL.");
      return;
    }

    try {
      const payload = {
        job_id: jobId,
        cl_data: {
          name: personalInfo.name,
          title: personalInfo.title,
          mail: personalInfo.mail,
          contact: personalInfo.contact,
          address: personalInfo.address,
          paragraphs: paragraphs
        }
      };

      console.log("📦 Final PUT Payload:", payload);

      const response = await axios.put(
        `${BASE_URL}/internal/generate-cover-letter`, // ✅ Use correct endpoint
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Cover letter updated successfully:", response.data);
    } catch (error) {
      console.error("❌ Failed to update cover letter:", error.response?.data || error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600 animate-pulse">Loading your cover letter...</p>
      </div>
    );
  }



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
                className={`cursor-pointer p-2 rounded-full transition ${activeSection === 'content' ? 'hover:bg-gray-300' : 'hover:bg-gray-300'
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

          {/* 🔄 CL Template Switcher */}
          <div className='bg-white rounded p-5 border border-gray-300'>
            <h1 className='text-lg font-medium'>Templates</h1>


            <h3 className="text-lg font-semibold mt-6 mb-2 text-center">Choose a Cover Letter Template</h3>
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {Object.entries(clTemplates).map(([name, Template]) => {
                if (name === selectedClTemplate) return null;

                return (
                  <div
                    key={name}
                    className="cursor-pointer border rounded hover:shadow-lg hover:border-[#2C6472] transition duration-200 bg-white w-[200px] overflow-hidden"
                    onClick={() => setSelectedClTemplate(name)}
                  >
                    <div className="w-full h-[280px] overflow-hidden relative bg-white">
                      <div
                        className="absolute top-0 left-0"
                        style={{
                          transform: "scale(0.25)",
                          transformOrigin: "top left",
                          width: "794px",
                          height: "1123px",
                        }}
                      >
                        <div className="bg-white w-[794px] h-[1123px] shadow">
                          <Template personalInfo={personalInfo} paragraphs={paragraphs} />
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-sm py-2 bg-[#3f6068] text-white font-semibold">
                      {name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>



        </div>


        {/* RIGHT */}
        <div ref={previewRef} className="w-[794px] h-[1123px] flex flex-col gap-14 bg-white">
          <div> <ActiveCLTemplate personalInfo={personalInfo} paragraphs={paragraphs} />
          </div>
          <div className='flex  justify-end items-end'>
            <button
              className="bg-[#2c6472] text-white mt-4 flex justify-end items-end px-8  py-1.5 rounded-lg"
              onClick={async () => {
                await handleUpdateCoverLetter();   // ✨ First update the data in DB
                handleDownload();                  // 🧾 Then download PDF
                setActiveSection(null);            // 🎨 Optional cleanup
                navigate(-1);                      // ⬅️ Go back
              }}
            >
              Download & Finish Editing
            </button>
          </div>
        </div>



      </div>
    </div>
  );
};

export default Cl;
