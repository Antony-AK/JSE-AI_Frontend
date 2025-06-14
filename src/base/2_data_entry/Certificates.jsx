import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import frame from './../../assets/Frame.png';
import logo from './../../assets/logo.png';

const Certificate = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [formData, setFormData] = useState({
    certificate_name: '',
    certificate_number: '',
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificateFile(file); // ✅ Save raw file directly
    }
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();

    if (!formData.certificate_name || !certificateFile) {
      alert('Please fill all fields and upload a certificate file.');
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
      formDataToSend.append("certificate_name", formData.certificate_name);
      formDataToSend.append("certificate_number", formData.certificate_number || "N/A");
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

      setFormData({
        certificate_name: '',
        certificate_number: '',
      });
      setCertificateFile(null);

    } catch (error) {
      console.error("Error uploading certificate:", error);
      alert("Failed to upload certificate.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setLoading(true);
    navigate("/user/onboarding/languages");  // Only navigate, no data posting here
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-[87vh] w-[85%] mx-auto bg-white border mt-2 border-gray-300 rounded-xl shadow-lg shadow-gray-300/60">
      <div className="flex flex-1 rounded-xl shadow-md shadow-slate-300">
        {/* Left Panel */}
        <div className="flex-1 flex justify-center items-center p-8 bg-white rounded-s-xl">
          <form className="max-w-md w-full" onSubmit={handleAddCertificate}>
            <div className="relative ">
              <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                Certificate/Course Name  <span className="text-red-500">*</span>
              </label>
              <input
                id='certificate_name'
                type="text"
                name="certificate_name"
                placeholder=" "
                value={formData.certificate_name}
                onChange={handleChange}
                className="w-full h-[52px] px-4 py-4 border text-gray-500 border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#2c6472] peer"
              />

            </div><br />

            <div className="">
              <p className="mb-1 text-sm ms-3 text-gray-500">Completion Certificate <span className="text-red-500">*</span></p>
              <div className="border-2 border-gray-300  p-6 text-center bg-gray-100">
                <input
                  type="file"
                  id="certificateUpload"
                  onChange={handleFileChange}
                  className="hidden "
                />
                <label htmlFor="certificateUpload" className="cursor-pointer flex mt-5 flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#2c6472"
                    viewBox="0 0 24 24"
                    width="40"
                    height="40"
                    className="mb-2"
                  >
                    <path d="M16 16h-2v-4h-4v4H8l4 4 4-4z" />
                    <path d="M18.944 10.112a6.5 6.5 0 00-12.671-1.098A5.502 5.502 0 007 20h11a5 5 0 00.944-9.888zM18 18H7a3.5 3.5 0 010-7h.5l.1-.4a4.5 4.5 0 018.7 1.2l.2.9H18a3 3 0 010 6z" />
                  </svg>
                  <p className="text-gray-600">Upload Certificate</p>
                  <p className="text-xs text-gray-500 mt-3 h-[40px] text-center">
                    {certificateFile ? certificateFile.name : ''}
                  </p>
                </label>
              </div>
            </div><br />

            <div className="relative mb-6">
              <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                Certificate Number
              </label>
              <input
                id='certificate_number'
                type="text"
                name="certificate_number"
                placeholder=" "
                value={formData.certificate_number}
                onChange={handleChange}
                className="w-full h-[52px] px-4 py-4 border text-gray-500 border-gray-300  text-sm focus:outline-none focus:ring-1 focus:ring-[#2c6472] peer"
              />

            </div><br />

            <div className="flex justify-between items-center gap-4">
              <button
                type="button"
                className="teal-button px-6 py-2 bg-[#2c6472] text-white w-[100px] h-[41px] rounded-full"
                onClick={() => navigate(-1)}
              >
                Back
              </button>


              <button
                type="submit"
                className=" px-6  py-2 bg-white text-[#2c6472] border border-[#2c6472] h-[43px] rounded-full text-sm font-semibold cursor-pointer mt-1 hover:scale-95 transition-transform duration-200"
              >
                +Add Certificates
              </button>

              <button
                type="button"
                className="teal-button px-6 py-2 bg-[#2c6472] text-white w-[100px] h-[41px] rounded-full"
                onClick={handleNext}
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-[#2c6472] flex flex-col justify-center items-center p-2 text-white rounded-e-xl">
          <div className="flex items-center mb-2">
            <img
              src={logo}
              className="h-8 w-8"
            />
            <h3 className="text-black text-xl font-medium">JSE AI</h3>
          </div>
          <div className="text-center">
            <h3 className="text-white text-lg ms-4 font-medium mb-4">Certifications & Courses</h3>
          </div>
          <div className='relative mb-5 flex justify-center items-center ms-4'>
            <img src={frame} alt="" className='relative object-cover ' />
            <DotLottieReact
              src="https://lottie.host/718ff815-af40-4d09-908c-8329ccff8238/z1D0Pu9bab.lottie"
              loop
              autoplay
              style={{ width: "350px", height: "350px" }}
              className='absolute object-cover me-2 p-2'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
