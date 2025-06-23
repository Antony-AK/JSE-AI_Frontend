import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from "../../assets/Animation - 1745282599914.json";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import google from "./../../assets/Google.png";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import frame from "./../../assets/Frame.png";
import logo from "../../assets/logo.png"
import { BASE_URL } from '../../utils/api';


const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('authToken', data.token);
        fetchEntryProgressAndRedirect(data.token);
      } else {
        alert(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };



 const fetchEntryProgressAndRedirect = async (token) => {
  try {

    const res = await fetch(`${BASE_URL}/user/entry-progress/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const progress = await res.json();

    console.log("🧠 Entry Progress Response:", progress);

    if (res.ok) {
      if (progress.completed) {
        navigate('/user/dashboard');
      } else {
        const stepToPath = {
          personal_infos: '/user/onboarding/personal-information',
          work_experiences: '/user/onboarding/work-experience',
          educations: '/user/onboarding/education',
          projects: '/user/onboarding/projects',
          languages: '/user/onboarding/languages',
          certificates: '/user/onboarding/certificates',
          preferred_job_titles: '/user/onboarding/jobtitles',
          Skills: '/user/onboarding/skills',
        };

        const nextStep = progress.next_step;

        // 👇 Check if it's the FIRST login after signup
        const isFirstLogin = localStorage.getItem('firstLogin') === 'true';

        if (isFirstLogin) {
          localStorage.removeItem('firstLogin'); // ✅ Clear after using
          navigate('/user/dataonboarding'); // 🚀 Force to onboarding method chooser
        } else if (nextStep && stepToPath[nextStep]) {
          navigate(stepToPath[nextStep]); // Go to next step
        } else {
          navigate('/user/dataonboarding'); // Fallback if no step info
        }
      }
    } else {
      navigate('/user/dashboard'); // Fallback
    }
  } catch (err) {
    console.error('💥 Error:', err);
    navigate('/user/dashboard');
  } finally {
  }
};



  return (
    <div className="flex flex-col min-h-screen ">
      <div className="flex flex-1">
        {/* Left Panel */}
        <div className="flex flex-1 justify-center items-center p-8 bg-white">
          <div className="max-w-lg w-full">
            <h2 className="text-3xl font-semibold text-center mb-2">Login now</h2><br /><br />

            {/* <button className="w-full h-[52px] flex items-center justify-center border border-gray-300 py-3 rounded-md mb-1 hover:bg-[#2c6472]/5 hover:border-[#2c6472] transition">
              <img src={google} className="mr-4 text-xl text-gray-600" />
              <span className="text-base text-gray-700">Continue with Google</span>
            </button><br />

            <div className="flex items-center my-2">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="mx-3 text-gray-400 text-sm">or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div><br /> */}

            <form onSubmit={handleSubmit} className="grid gap-y-3">
              <div className="relative -mt-5">
                <label className="mb-1 ms-3 block  text-gray-500 text-sm">

                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-[52px] px-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-[#2c6472] peer"
                  placeholder=" "
                />

              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="mb-1 ms-3 block  text-gray-500 text-sm">

                  Password
                </label>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-[52px]  ps-4 pe-3 py-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-[#2c6472] peer pr-10"
                  placeholder=" "
                />

                <span
                  className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                  onClick={() => toggleShowPassword('password')}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>
              </div>

              <div className="text-right text-sm text-[#2c6472]">
                <Link to="/forgot-password" className="hover:underline font-semibold">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="teal-button w-half h-[44px] bg-[#2c6472] text-white py-2 mt-4 rounded-[10px] font-semibold hover:bg-[#24525f] transition"
                disabled={loading}
              >
                Login
              </button><br />
            </form>

            <p className="text-center text-sm -mt-2">
              Don’t have an account?{' '}
              <Link to="/user/signup" className="text-[#2c6472] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-1 flex-col justify-center items-center bg-[#2c6472] text-white p-8">
          <div className="flex items-center mb-2">
            <img
              src={logo}
              className="h-8 w-8"
            />
            <h3 className="text-black font-medium text-xl">JSE AI</h3>
          </div>
          <h3 className="text-center text-xl ms-4 font-medium mb-6">Welcome Back!</h3>
          <div className='relative mb-5 flex justify-center items-center ms-4'>
            <img src={frame} alt="" className='relative object-cover ' />
            <DotLottieReact
              src="https://lottie.host/47dbe349-fbbc-4772-9026-56f4ed8832c8/G4VcaYQkF2.lottie"
              loop
              autoplay
              style={{ width: '70px', height: '70px' }}
              className='absolute object-cover me-2 p-2'
            />
          </div>
        </div>
      </div>



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

export default Login;
