import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/api';
import animationgif from '../../assets/Animations.gif';
import LanguageSelectModel from "../../base/LanguageModelPopup/LanguageSelectModel.jsx";
import { toast } from 'react-toastify';


const External = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");

  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobLink: '',
    jobDescription: ''
  });

  const [loading, setLoading] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [storedPayload, setStoredPayload] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Step 1: Generate job ID and show language modal
  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedJobId = `job_${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const payload = {
      job_id: generatedJobId,
      company: formData.companyName,
      job_title: formData.jobTitle,
      link: formData.jobLink,
      description: formData.jobDescription,
      source: "external",
    };

    setJobId(generatedJobId);
    setStoredPayload(payload); // Store for use after language is chosen
    setShowLangModal(true);   // Now ask for language
  };

  // Step 2: Send full payload including job_language to backend
  const handleLanguageSelect = async (lang) => {
    setShowLangModal(false);
    if (!storedPayload || !jobId) return;

    const finalPayload = {
      ...storedPayload,
      job_language: lang
    };

    try {
      setLoading(true);

          sessionStorage.setItem("selectedLanguage", lang);

      const response = await axios.post(`${BASE_URL}/external/generate`, finalPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("✅ Successfully generated:", response.data);
      sessionStorage.setItem("externalJobId", jobId);
      sessionStorage.setItem("generatedCV", JSON.stringify({ job_id: jobId }));
      sessionStorage.setItem("generatedCL", JSON.stringify({ job_id: jobId }));

      setTimeout(() => {
        navigate("/user/document-editor");
      }, 2000);
    } catch (error) {
      console.error("❌ Backend error:", error);

      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(`🚨 ${errMsg}`);
    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen mx-auto px-4">

      <div className="max-w-lg mx-auto mt-10 px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            placeholder="eg: Google"
            onChange={handleChange}
          />
          <Input
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            placeholder="eg: UI Designer"
            onChange={handleChange}
          />
          <Input
            label="Job Link"
            name="jobLink"
            value={formData.jobLink}
            placeholder="eg: https://example.com"
            onChange={handleChange}
          />
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Job Description</label>
            <textarea
              name="jobDescription"
              rows="4"
              value={formData.jobDescription}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#2c6472]"
              placeholder="Job description goes here..."
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#2c6472] text-white px-6 py-2 rounded-md hover:bg-[#24535f] transition flex items-center gap-2"
            >
              Generate <span>✨</span>
            </button>
          </div>
        </form>
      </div>

      <LanguageSelectModel
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
        onSelect={handleLanguageSelect}
      />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <img
              src={animationgif}
              alt="Loading..."
              className="w-52 h-52 mb-4"
            />
            <p className="text-white text-xl font-semibold">Generating, please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable input component
const Input = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block font-semibold text-gray-700 mb-2">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md px-3 py-4 focus:outline-none focus:ring-2 focus:ring-[#2c6472]"
      placeholder={placeholder}
    />
  </div>
);

export default External;
