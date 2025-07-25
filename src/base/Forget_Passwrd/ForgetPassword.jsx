import React, { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from "../../assets/Animation - 1745282599914.json";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import frame from "./../../assets/Frame.png";
import logo from "../../assets/jsenewlogo.png";
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from "../../utils/api";
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/auth/request-password-reset`, {
        email: email.trim(),
      });

      toast.success("Verification mail sent! 📧");
      console.log("✅ Success:", response.data);
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row-reverse h-screen">
      {/* Right Panel (Blue) - Shows on Top for Mobile */}
      <div className="flex w-full md:w-1/2 flex-col justify-center items-center bg-[#2c6472] text-white p-6 md:p-8">
        <div className="flex flex-col items-center mb-4">
          <h3 className="text-center text-xl md:text-2xl font-medium">Welcome Back!</h3>
          <img src={logo} className="h-10 w-24 mt-2" alt="Logo" />
        </div>
        <div className="hidden md:flex relative mb-6 justify-center items-center">
          <img src={frame} alt="" className="relative object-cover" />
          <DotLottieReact
            src="https://lottie.host/ea3cb741-1e89-48d0-89de-a5ad795a6cff/Ok1556eeUy.lottie"
            loop
            autoplay
            style={{ width: '100px', height: '100px' }}
            className="absolute object-cover p-1"
          />
        </div>
        <p className=" hidden md:block text-center text-sm mt-4">
          Unlock your next opportunity <br />
          Your dream job is just a click away
        </p>
      </div>

      {/* Left Panel (Form) */}
      <div className="flex w-full md:w-1/2 h-full justify-center pt-32 md:pt-0 md:items-center p-6 md:p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 md:mb-4">Forget Password</h2>
          <h4 className="text-center text-sm md:text-base mb-10 md:mb-8">
            We’ll send a verification code to this email if it matches an existing{" "}
            <span className="text-[#2c6472] font-semibold text-lg">JSE AI</span>{" "}
            <span className="text-black text-base font-medium">account</span>
          </h4>

          {/* Email Input */}
          <div className="flex flex-col justify-center items-center gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 px-4  text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 ring-[#2c6472] transition-all"
              placeholder="Enter your registered email"
            />
          </div>

          {/* Buttons */}
          <div className="mt-10 flex justify-evenly gap-3 w-full  mx-auto">
            <button
              onClick={() => navigate('/user/login')}
              className="w-1/3 py-2 bg-white text-[#2c6472] rounded-2xl border-2 border-[#2c6472] font-semibold hover:bg-[#1f4d59]/5 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="w-1/3 py-2 bg-[#2c6472] text-white rounded-2xl font-semibold hover:bg-[#1f4d59] transition-all"
            >
              {loading ? "Sending..." : "Verify"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <Player autoplay loop src={animationData} style={{ width: 150, height: 150 }} />
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
