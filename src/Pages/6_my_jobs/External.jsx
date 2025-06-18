import React, { useState } from 'react';

const External = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted 🚀", formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Company Name */}
        <div>
          <label className="block  font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-4 focus:outline-none focus:ring-2 focus:ring-[#2c6472]"
            placeholder="Google"
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-4 focus:outline-none focus:ring-2 focus:ring-[#2c6472]"
            placeholder="Ui deisgner"
          />
        </div>

        {/* Job Link */}
        <div>
          <label className="block  font-medium text-gray-700 mb-2">
            Job Link
          </label>
          <input
            type="text"
            name="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-4 focus:outline-none focus:ring-2 focus:ring-[#2c6472]"
            placeholder="www.eg.com"
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            name="jobDescription"
            rows="4"
            value={formData.jobDescription}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#2c6472]"
            placeholder="Job description goes here..."
          ></textarea>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#2c6472] text-white px-6 py-2 rounded-md hover:bg-[#24535f] transition flex items-center gap-2"
          >
            Generate
            <span className="">✨</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default External
