import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/api';
import animationgif from '../../assets/Animations.gif';
import LanguageSelectModel from "../../base/LanguageModelPopup/LanguageSelectModel.jsx";

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
      console.error("❌ Error sending to backend:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen mx-auto px-4">
      {loading ? (
        <div className="flex flex-col justify-center mt-32 items-center h-[300px]">
          <img
            src={animationgif}
            alt="Generating..."
            className="w-52 h-52"
          />
          <p className="ml-4 text-gray-600 text-lg">Generating your documents...</p>
        </div>
      ) : (
        <div className="max-w-lg mx-auto mt-10 px-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              placeholder="Google"
              onChange={handleChange}
            />
            <Input
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              placeholder="UI Designer"
              onChange={handleChange}
            />
            <Input
              label="Job Link"
              name="jobLink"
              value={formData.jobLink}
              placeholder="https://example.com"
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
      )}

      <LanguageSelectModel
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
        onSelect={handleLanguageSelect}
      />
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
