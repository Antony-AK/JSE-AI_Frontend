import React, { useState, useRef } from 'react';import logo from '../../assets/logo.png'
import resume_upload from '../../assets/resume_upload.png'
import { useNavigate } from 'react-router-dom'



const Resume = () => {
    const navigate = useNavigate();
    const [certificateFile, setCertificateFile] = useState(null);
    const [loading, setLoading] = useState(false);

      const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificateFile(file); // ✅ Save raw file directly
    }
  };

   const handleAddCertificate = async (e) => {
    e.preventDefault();

    if (!certificateFile) {
      alert('Please upload a certificate file.');
      return;
    }

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert("You are not authenticated. Please login.");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", certificateFile); // ✅ Raw file here

      const response = await fetch("https://jse.arshan.digital/b1/certificates", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // ✅ No need to set Content-Type for FormData
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      alert(`✅ Certificates uploaded successfully`);

    
      setCertificateFile(null);

    } catch (error) {
      console.error("Error uploading certificate:", error);
      alert("Failed to upload certificate.");
    } finally {
      setLoading(false);
    }};
  return (
    <div className="flex h-screen p-5 bg-white">
      {/* Left Sidebar */}
      <div className="w-[30%] h-[99.5%] p-5 pl-7 bg-gradient-to-b from-[#2E8095] to-[#2C6472] text-white">
        <div className="flex items-center mb-10">
          <img className='w-10 h-10 object-fill' src={logo} alt="JobFusion Logo" />
          <p className="text-white ml-2 text-lg font-semibold">JSE AI</p>
        </div>
        <div className=" items-center mt-40">
          <p className='font-semibold text-3xl'>Just a few steps away from landing your dream job</p>
          <p className='text-lg mt-5 text-white/90'>Start building your profile and unlock new career opportunities.</p>
        </div>
      </div>

      <div className="ms-[27%] fixed top-10 flex flex-col items-center h-full w-[73%] text-black p-10">
        <div><h1 className='text-2xl font-semibold'>Upload your resume</h1></div>

        <div className="w-full flex mx-auto items-center flex-col mt-10">
          <div className="border-2 border-[#2c6472] border-dotted rounded-lg w-[70%] h-[350px] p-6 text-center bg-gray-100">
            <input
              type="file"
              id="certificateUpload"
              onChange={handleFileChange}
              className="hidden "
            />
            <label htmlFor="certificateUpload" className="cursor-pointer flex mt-5 flex-col items-center justify-center">
              <img src={resume_upload} className='w-16 h-16 mt-14 object-cover hover:scale-95 transition-transform ease-linear duration-200' alt="" />
              <p className="text-[#2c6472] font-medium text-lg mt-5">Click to Upload or drag and drop</p>
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
          //   onClick={handleNext}
          >
            Allow
          </button>
        </div>
      </div>


    </div>
  )
}

export default Resume
