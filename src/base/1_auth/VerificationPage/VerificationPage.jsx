import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import '../../../App.css'; // Importing global styles

const VerificationPage = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    // Handle verification code submission
    navigate('/personal-info'); // Redirect after verification
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md text-center">
          <h2 className="text-lg font-medium text-gray-900 mt-8">Choose Where to Send <br/>Verification Code</h2><br/>

          <div className="mt-14 mb-8 flex items-center justify-center gap-4">
            <input
              type="radio"
              id="email-option"
              name="verification"
              checked={selectedOption === 'email'}
              onChange={() => handleOptionSelect('email')}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <label htmlFor="email-option" className="text-base font-semibold text-gray-700">
              Send code to Email (ajay***@gmail.com)
            </label>
          </div><br/>

          <div className="mt-14 mb-8 flex items-center justify-center gap-4">
            <input
              type="radio"
              id="phone-option"
              name="verification"
              checked={selectedOption === 'phone'}
              onChange={() => handleOptionSelect('phone')}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <label htmlFor="phone-option" className="text-base font-semibold text-gray-700">
              Send code to Phone (+91 *****6720)
            </label>
          </div><br/><br/>

          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`w-full h-[45px] py-3 px-4 rounded-[10px] text-white font-medium transition 
            ${selectedOption ? 'bg-[#2c6472] ' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Send
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#2c6472] px-4">
        <h1 className="text-white text-2xl text-center mb-2">Welcome to</h1>
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="src/assets/joblogo.png" alt="JobFusion Logo" className="h-6 w-6" />
          <h3 className="text-[#ff9a67] text-lg font-semibold">JobFusion</h3>
        </div>
        <DotLottieReact
          src="https://lottie.host/7b32db8d-1f68-40f4-b99b-093d24d59b0a/dZdALaSGEc.lottie"
          loop
          autoplay
          style={{ width: '45%', height: '45%', marginTop: '2rem' }}
        />
        <p className="text-white text-center mt-6 max-w-xs text-sm">
          "Unlock your next opportunity — your dream job is just a click away."
        </p>
      </div>
    </div>
  );
};

export default VerificationPage;
