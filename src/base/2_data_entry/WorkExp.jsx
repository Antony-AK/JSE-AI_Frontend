import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import axios from "axios";
import frame from "./../../assets/Frame.png";
import logo from "./../../assets/logo.png";


const WorkExp = () => {
  const navigate = useNavigate();
  const apiUrl = "https://jse.arshan.digital/b1/work-experience";
  const sessionKey = "token"; // Assuming this is the key used to store the token

  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    employment_type: "",
    start_date: "",
    end_date: "",
    key_responsibilities: "",
  });

  const [loading, setLoading] = useState(false);

  const formatForDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];  // Get only the date part (YYYY-MM-DD)
  };

  const isFormValid = () => {
    return formData.job_title && formData.company_name && formData.start_date && formData.key_responsibilities;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendData = async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error("Error: No token found in session storage.");
      return;
    }

    const formatDateForAPI = (dateString) => {
      const date = new Date(dateString);
      // Format to YYYY-MM-DD, or adjust to the format your backend expects
      return date.toISOString().split('T')[0];
    };

    // Build requestData dynamically
    const requestData = {
      ...formData,
      start_date: formatDateForAPI(formData.start_date),
    };

    // Only add end_date if it has a value
    if (formData.end_date) {
      requestData.end_date = formatDateForAPI(formData.end_date);
    }


    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert(`✅ Work Experience uploaded successfully`);
    } catch (error) {
      console.error("Error uploading data:", error);
      if (error.response) {
        console.error("API Response:", error.response.data); // Log the actual response from API
      }
    }
  };


  const handleAddExperience = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Please fill all required fields!");
      return;
    }
    setLoading(true);
    await sendData();
    setFormData({
      job_title: "",
      company_name: "",
      employment_type: "",
      start_date: "",
      end_date: "",
      key_responsibilities: "",
    });
    setLoading(false);
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setLoading(true);
    navigate("/user/onboarding/education");  // Only navigate, no data posting here
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-[87vh] w-[85%] mx-auto bg-white border mt-2 border-gray-300 rounded-xl shadow-lg shadow-gray-300/60">
      <div style={{ display: "flex", flex: 1 }} className="rounded-xl shadow-md shadow-slate-300 ">
        {/* Left Panel */}
        <div className="flex flex-1 justify-center items-center p-8 bg-white rounded-xl">
          <div className="max-w-md w-full">
            <form className="grid gap-y-8">
              {/* Job Title */}
              <div className="relative">
                <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                  Job Title    <span className="text-red-500">*</span>
                </label>
                <input
                  id="job_title"
                  type="text"
                  name="job_title"
                  placeholder=" "
                  value={formData.job_title}
                  onChange={handleChange}
                  className="peer w-full p-4 border border-gray-300 h-[41px] text-gray-500 text-sm  focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                />

              </div>


              {/* Company Name and Employee Type */}
              <div className="flex gap-5">
                <div className="relative flex-1">
                  <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                    Company Name      <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="company_name"
                    type="text"
                    name="company_name"
                    placeholder=" "
                    value={formData.company_name}
                    onChange={handleChange}
                    className="peer w-full p-4 border border-gray-300 h-[41px]  text-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                  />

                </div>

                <div className="relative flex-1">
                  <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                    Employer Type     <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="employment_type"
                    type="text"
                    name="employment_type"
                    placeholder=" "
                    value={formData.employment_type}
                    onChange={handleChange}
                    className="peer w-full p-4 border border-gray-300 h-[41px] text-gray-500  text-sm focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                  />

                </div>
              </div>

              {/* Date Inputs */}
              <div className="flex gap-5">
                <div className="flex-1 relative">
                  <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                    Start Date     <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="start_date"
                    type="date"
                    name="start_date"
                    value={formatForDateTimeLocal(formData.start_date)}
                    onChange={handleChange}
                    className="peer w-full p-3 px-4 border border-gray-300 text-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                    placeholder=" "
                  />

                </div>

                <div className="flex-1 relative">
                  <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                    End Date
                  </label>
                  <input
                    id="end_date"
                    type="date"
                    name="end_date"
                    value={formatForDateTimeLocal(formData.end_date)}
                    onChange={handleChange}
                    className="peer w-full p-3 px-4 border border-gray-300 text-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                    placeholder=" "
                  />

                </div>
              </div>


              {/* Key Responsibilities */}
              <div className="relative">
                <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                  Key Responsibilities  <span className="text-red-500">*</span>

                </label>
                <textarea
                  id="key_responsibilities"
                  name="key_responsibilities"
                  placeholder=" "
                  value={formData.key_responsibilities}
                  onChange={handleChange}
                  className="peer w-full p-4 border border-gray-300 h-28 text-gray-500  text-sm min-h-[100px] focus:outline-none focus:ring-1 focus:ring-[#2c6472]"
                />

              </div>

              {/* Buttons */}
              <div className="flex justify-center items-center gap-4">
                <button
                  type="button"
                  className="teal-button px-6 py-2 bg-[#2c6472] text-white w-[100px] h-[41px] rounded-full text-sm "
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className=" px-6 py-2 bg-white text-[#2c6472] border border-[#2c6472] h-[43px] rounded-full text-sm font-semibold cursor-pointer mt-1 hover:scale-95 transition-transform duration-200"
                  onClick={handleAddExperience}
                >
                  +Add Work Experience
                </button>
                <button
                  type="button"
                  className="teal-button px-6 py-2 bg-[#2c6472] text-white w-[100px] text-sm h-[41px] mt-1 rounded-full focus:outline-none"
                  onClick={handleNext}
                >
                  {loading ? "Saving..." : "Next"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-[#2c6472] flex flex-col justify-center items-center p-8 text-white rounded-e-xl">
          <div className="flex items-center mb-2">
            <img
              src={logo}
              className="h-8 w-8"
            />
            <h3 className="text-black text-xl font-medium">JSE AI</h3>
          </div>
          <div className="text-center">
            <h3 className="text-white text-lg font-medium mb-4 ms-2">Work Experience</h3>
          </div>
          <div className='relative mb-5 flex justify-center items-center ms-4'>
            <img src={frame} alt="" className='relative object-cover ' />
            <DotLottieReact
              src="https://lottie.host/72d38dc2-d827-4840-aa4b-e45bd40fcc7a/bpxhRARUmj.lottie"
              loop
              autoplay
              style={{ width: '250px', height: '250px' }}
              className="absolute object-cover me-2 p-2"
            />
          </div>
        </div>
      </div>


    </div>
  );
};



export default WorkExp;
