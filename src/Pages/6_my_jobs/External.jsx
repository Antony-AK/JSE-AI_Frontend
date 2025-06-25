import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/api';
import axios from 'axios';
import { BASE_URL } from '../../utils/api';

const External = () => {

  const handleSubmit = async (e) => {
  e.preventDefault();

  const job_id = `job_${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const payload = {
    job_id,
    company: formData.companyName,
    job_title: formData.jobTitle,
    link: formData.jobLink,
    description: formData.jobDescription,
    source: "external", // ✅ always added!
  };

      navigate('/user/document-editor');


  try {
    const token = sessionStorage.getItem('authToken');

    const response = await axios.post(
      `${BASE_URL}/external/generate`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("✅ External job generated:", response.data);

    // Store response data in sessionStorage
    sessionStorage.setItem("cv_data", JSON.stringify(response.data));

    // Navigate to document editor
    navigate('/user/document-editor');

  } catch (error) {
    console.error("❌ Failed to generate external resume:", error);
    alert("Something went wrong. Please try again.");
  }
};


  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobLink: '',
    jobDescription: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  return (
    <div className="max-w-lg mx-auto mt-10 px-4">
      <form onSubmit={handleSubmit} className="space-y-6 ">

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
  );
};

// Optional: Extract input field component
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
