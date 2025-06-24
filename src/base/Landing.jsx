import React, { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import animationData from '../assets/Animation - 1745282599914.json';
import { useNavigate, Link } from 'react-router-dom';
import joblogo from '../assets/joblogo.png';
import frame from '../assets/Frame.png';
import logo from "../assets/logo.png"


const Landing = ({ footerLinks = [] }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fade, setFade] = useState(false);

  const handleNavigation = (path) => {
    setLoading(true);
    setFade(true);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} >
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left Panel */}
        <div className="flex flex-1 justify-center items-center p-8 bg-white">
          <div className="max-w-lg w-full text-center flex flex-col justify-center items-center ">
            <div className="logo w-28 h-28  -mt-4 ">
              <img src={logo} alt="" />
            </div>

            <h1 className="text-4xl font-bold text-[#2c6472] ">Welcome to JSE AI</h1><br />
            <p className="text-gray-600 mb-7 text-lg">
              Your personalized job search assistant. Create your profile, track your applications, and land your dream job.
            </p><br />
            <div className="flex justify-center gap-3  me-5 ">
              <button
                onClick={() => handleNavigation('/user/login')}
                className="teal-button px-6 py-3 bg-[#2c6472] text-white w-[100px] rounded-full focus:outline-none"
                disabled={loading}
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation('/user/signup')}
                className="teal-button px-6 py-3 h-[50px] bg-[#2c6472] text-white w-[120px] rounded-full focus:outline-none"
                disabled={loading}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-[#2c6472] flex flex-col justify-center items-center p-4 text-white">
          <div className="flex justify-center items-center ms-1">
            <img src={logo} className="h-8 w-8 "  />
            <h3 className="text-black  font-medium text-xl m-0">JSE AI</h3>
          </div>
          <div className="text-center mt-2 ml-4">
            <h3 className="text-white text-xl font-medium mb-5">Welcome</h3>
          </div>
          <div className='relative mb-5 flex justify-center items-center ms-4'>
            <img src={frame} alt="" className='relative object-cover ' />
            <DotLottieReact
            src="https://lottie.host/72d38dc2-d827-4840-aa4b-e45bd40fcc7a/bpxhRARUmj.lottie"
            loop
            autoplay
            style={{ width: '250px', height: '250px' }}
            className='absolute m-auto object-cover me-2'
          />
          </div>
          
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white text-center  text-sm">
        {footerLinks.map((link, index) => (
          <React.Fragment key={index}>
            <Link to={link.path} className="text-[#2c6472] hover:underline font-semibold mx-2">
              {link.label}
            </Link>
            {index < footerLinks.length - 1 && <span>|</span>}
          </React.Fragment>
        ))}
      </div>
      {/* Fullscreen Overlay with Animation */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 transition-opacity duration-1000">
          <Player
            autoplay
            loop
            src={animationData}
            style={{ width: 150, height: 150 }}
          />
        </div>
      )}
    </div>
  );
};

export default Landing;