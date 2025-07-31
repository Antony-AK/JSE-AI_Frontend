import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/api';
import animationgif from '../../assets/Animations.gif';
import LanguageSelectModel from "../../base/LanguageModelPopup/LanguageSelectModel.jsx";
import { toast } from 'react-toastify';
import LimitReachedModal from '../6_my_jobs/MyJobsPopUp/LimitReachedModel.jsx';
import { t } from "../../utils/i18n.js";

const External = () => {

  const [infoBlock, setInfoBlock] = useState(null); // ⬅️ Store only info_block
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) return;

    const fetchDashboardInfo = async () => {
      try {
        const res = await fetch(`${BASE_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.info_block) {
          setInfoBlock(data.info_block);
        }
      } catch (err) {
        console.error("Error fetching info_block:", err);
      }
    };

    fetchDashboardInfo();
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const { companyName, jobTitle, jobLink, jobDescription } = formData;
    if (!companyName || !jobTitle || !jobLink || !jobDescription) {
      toast.error("Please fill in all the fields.");
      return;
    }

    if (!infoBlock) {
      toast.error("User info not loaded. Please try again.");
      return;
    }

    const isFreePlan = infoBlock.subscription_tier === 'free';
    const externalUsed = infoBlock.external_application_count || 0;

    if (isFreePlan && externalUsed === 0) {
      setLimitModalOpen(true);
      return;
    }

    const generatedJobId = `job_${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const payload = {
      job_id: generatedJobId,
      company: companyName,
      job_title: jobTitle,
      link: jobLink,
      description: jobDescription,
      source: "external",
    };

    setJobId(generatedJobId);
    setStoredPayload(payload);
    setShowLangModal(true);
  };



  // Step 2: Send full payload including job_language to backend
  const handleLanguageSelect = async (lang) => {
    setShowLangModal(false);
    if (!storedPayload || !jobId) return;

    const finalPayload = {
      ...storedPayload,
      job_language: lang,
      cl_format: "ExternalModernCL", // 🎯 Send the selected template format too
      cv_format: "EuropassCV"

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
            label={t("external.companyName")}
            name="companyName"
            value={formData.companyName}
            placeholder={t("external.companyNamePlaceholder")}
            onChange={handleChange}
          />
          <Input
            label={t("external.jobTitle")}
            name="jobTitle"
            value={formData.jobTitle}
            placeholder={t("external.jobTitlePlaceholder")}
            onChange={handleChange}
          />
          <Input
            label={t("external.jobLink")}
            name="jobLink"
            value={formData.jobLink}
            placeholder={t("external.jobLinkPlaceholder")}
            onChange={handleChange}
          />
          <div>
            <label className="block font-semibold text-gray-700 mb-2"> {t("external.jobDescription")}</label>
            <textarea
              name="jobDescription"
              rows="4"
              value={formData.jobDescription}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#2c6472]"
              placeholder={t("external.jobDescriptionPlaceholder")}
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#2c6472] text-white px-6 py-2 rounded-md hover:bg-[#24535f] transition flex items-center gap-2"
            >
              {t("external.generate")} <span>✨</span>
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
            <p className="text-white text-xl font-semibold">  {t("external.generating")}
            </p>
          </div>
        </div>
      )}

      <LimitReachedModal
        isOpen={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
        type="external"
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
