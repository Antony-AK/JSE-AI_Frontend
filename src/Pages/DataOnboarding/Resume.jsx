import React, { useState, useRef } from 'react';
import logo from '../../assets/jsenewlogo.png'
import resume_upload from '../../assets/resume_upload.png'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import animationgif from '../../assets/extraction.gif';
import { BASE_URL } from '../../utils/api';

const Resume = () => {
  const navigate = useNavigate();
  const [certificateFile, setCertificateFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 4 * 1024 * 1024;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "text/plain"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("❌ Unsupported file type. Please upload a PDF or TXT.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("❌ File too large. Max size allowed is 4MB.");
        return;
      }

      setCertificateFile(file);
    }
  };

  const handleResumeUpload = async () => {
    if (!certificateFile) {
      toast.warning("⚠ Please upload a valid resume file.");
      return;
    }

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      toast.error("❌ You're not logged in. Please login.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", certificateFile);

      const response = await fetch(`${BASE_URL}/data-extraction/resume` , {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🧨 Resume API Error:", errorText);
        throw new Error(errorText || "Resume upload failed");
      }

      const extractedData = await response.json();
      console.log("📥 Extracted Resume Data:", extractedData);

      const isEmpty = Object.values(extractedData?.data || {}).every(
        val => (Array.isArray(val) ? val.length === 0 : val === "")
      );

      if (isEmpty) {
        toast.warning("⚠ Resume uploaded, but no data was extracted. Try another file.");
        return;
      }

      sessionStorage.setItem("extractedResume", JSON.stringify(extractedData));

      toast.success(" Resume uploaded and data extracted!");
      navigate("/user/onboarding/personal-information");

    } catch (error) {
      console.error("Error uploading resume:", error);
      if (error.message.includes("413") || error.message.includes("Entity Too Large")) {
        toast.error(" File too large. Please upload a resume under 4MB.");
      } else {
        toast.error(" Failed to upload resume or extract data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "text/plain"];
      const MAX_FILE_SIZE = 4 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        toast.error("❌ Unsupported file type. Please upload a PDF or TXT.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("❌ File too large. Max size allowed is 4MB.");
        return;
      }

      setCertificateFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-screen p-5 bg-white">
      {/* Left Sidebar */}
      <div className="w-[30%] h-[99.5%] p-5 pl-7 bg-gradient-to-b from-[#2E8095] to-[#2C6472] text-white">
        <div className="flex items-center mb-10">
          <img className='w-24 h-10 object-fill' src={logo} alt="JobFusion Logo" />
        </div>
        <div className=" items-center mt-40">
          <p className='font-semibold text-3xl'>Just a few steps away from landing your dream job</p>
          <p className='text-lg mt-5 text-white/90'>Start building your profile and unlock new career opportunities.</p>
        </div>
      </div>

      <div className="ms-[27%] fixed top-10 flex flex-col items-center h-full w-[73%] text-black p-10">
        <div><h1 className='text-2xl font-semibold'>Upload your resume</h1></div>

        <div className="w-full flex mx-auto items-center flex-col mt-10">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-[#2c6472] border-dotted rounded-lg w-[70%] h-[350px] p-6 text-center bg-gray-100"
          >
            <input
              type="file"
              accept=".pdf,.txt"
              id="certificateUpload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="certificateUpload" className="cursor-pointer flex mt-5 flex-col items-center justify-center">
              <img
                src={resume_upload}
                className="w-16 h-16 mt-14 object-cover hover:scale-95 transition-transform ease-linear duration-200"
                alt=""
              />
              <p className="text-[#2c6472] font-medium text-lg mt-5">Click to Upload or drag and drop</p>
              <p className='text-gray-500 text-sm mt-5 font-medium'>PDF, TXT - Max file size 4MB</p>
              <p className="text-sm font-medium text-gray-500 mt-5 h-[40px] text-center">
                {certificateFile ? certificateFile.name : ''}
              </p>
            </label>
          </div>
        </div><br />

        {/* Buttons */}
        <div className="flex w-[50%] justify-between items-center gap-4 mt-10 ">
          <button
            type="button"
            className=" teal-button px-6 py-2 bg-[#2c6472] text-white w-[130px] h-[44px]  rounded-full focus:outline-none transition-transform duration-200 ease-in-out"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="button"
            className=" teal-button px-6 py-2 bg-[#2c6472] text-white w-[130px] h-[44px]  rounded-full focus:outline-none transition-transform duration-200 ease-in-out"
            onClick={handleResumeUpload}
          >
            Allow
          </button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <img
              src={animationgif}
              alt="Loading..."
              className="w-52 h-52 mb-4"
            />
            <p className="text-white text-xl font-semibold">Extracting, please wait...</p>
          </div>
        </div>
      )}



    </div>
  )
}

export default Resume