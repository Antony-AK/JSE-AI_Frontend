import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from "../../assets/Animation - 1745282599914.json";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import google from "./../../assets/Google.png";
import frame from "./../../assets/Frame.png";
import logo from "../../assets/logo.png"
import { BASE_URL } from "../../utils/api"

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [shakePassword, setShakePassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time password validation
    if (name === 'password') {
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const hasNumber = /\d/.test(value);
      const isLongEnough = value.length >= 8;

      if (!isLongEnough || !hasSpecialChar || !hasNumber) {
        setPasswordError('(Min 8 chars, with number & symbol.)');
      } else {
        setPasswordError('');
      }
    }

  };


  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (!formData.password || passwordError) {
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 400);
      return;
    }

    const signupData = {
      email: formData.email,
      number: formData.phoneNumber, // <-- Ensure it matches the backend field
      password: formData.password
    };

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/auth/signup`,
        signupData, // Request body as the second argument
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log('Signup successful:', response.data);


        // 👉 Set first login flag so we know it was a new signup
        localStorage.setItem('firstLogin', 'true');


        setShowVerificationPopup(true); // Show popup first!

        setTimeout(() => {
          setShowVerificationPopup(false);
          navigate('/user/login', {
            state: {
              email: formData.email,
              phoneNumber: formData.phoneNumber
            }
          });
          setLoading(false);
        }, 2500); // Wait 2.5 seconds and THEN navigate

      } else {
        console.error('Signup failed');
        setLoading(false);
        toast.error("Signup failed, please try again.");
      }
    } catch (error) {
      console.error('Error during signup:', error.response?.data || error.message);
      setLoading(false);
      toast.error(error.response?.data?.issue || 'Signup failed, please try again.');
    }
  };
  return (
    <div className="flex min-h-screen ">
      {/* Left Panel */}
      <div className="flex flex-1 justify-center items-center p-8 bg-white ">
        <div className="max-w-lg w-full">
          <h2 className="text-3xl font-semibold text-center ">Create account</h2><br /><br />

          {/* Google Auth Button */}
          {/* <button className="w-full h-[52px] flex items-center justify-center border cursor-not-allowed bg-gray-300 relative border-gray-300 -mb-2 rounded-md  hover:shadow transition">
            <img src={google} className="mr-4 text-xl text-green-600 opacity-20" />
            <span className="text-base text-gray-700/20 ">Continue with Google</span>
          </button><br /> */}
          {/* <span className="absolute text-lg text-gray-300 cursor-wait top-48 left-80  font-semibold">Coming Soon</span> */}


          {/* <div className="flex items-center  ">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div><br /> */}

          {/* Signup Form */}
          <form onSubmit={handleSignUp} className='space-y-1'>
            {/* email Field */}
            <div className="relative -mt-5">
              <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                Email
              </label>
              <input
                id='email'
                type="email"
                name="email"
                placeholder=" "
                className="w-full h-[52px] px-4 py-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#2c6472] peer"
                value={formData.email}
                onChange={handleChange}

              />

            </div><br />

            {/* Phone Number Field */}
            <div className="relative  ">
              <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                Phone Number
              </label>
              <span className="absolute left-3 top-[64%] transform -translate-y-1/2 text-base">+49</span>
              <input
                id='phoneNumber'
                type="tel"
                name="phoneNumber"
                placeholder=" "
                className="w-full pl-14 h-[52px]   px-4 py-3.5 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#2c6472] peer"
                value={formData.phoneNumber}
                onChange={handleChange}
              />


            </div>
            {formData.phoneNumber && (formData.phoneNumber.length < 10 || formData.phoneNumber.length > 11) && (
              <p className="text-[10px] text-red-500 mt-1 ">(Phone number must be 10 to 11 digits)</p>
            )}

            {/* Password Fields */}
            <div className="flex space-x-2">
              {/* Create Password */}
              <div className="relative w-1/2">
                <label className="mb-1 ms-3 mt-3 block text-gray-500 text-sm">
                  Create Password
                </label>
                <input
                  id='password'
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  placeholder=" "
                  className={`w-full h-[52px] px-4 py-4 border ${passwordError ? '' : 'border-gray-300'
                    } rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#2c6472] peer ${shakePassword ? 'shake' : ''
                    }`}
                  value={formData.password}
                  onChange={handleChange}

                />
                <span
                  className="absolute right-3 top-[56%] text-gray-600 cursor-pointer"
                  onClick={() => toggleShowPassword('password')}
                >
                  {showPassword.password ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>

               
              </div> 

            

              {/* Confirm Password */}
              <div className="relative w-1/2">
                <label className="mb-1 ms-3 mt-3 block  text-gray-500 text-sm">
                  Confirm Password
                </label>
                <input
                  id='confirmPassword'
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder=" "
                  className="w-full h-[52px] px-4 py-4 border  border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#2c6472] peer"
                  value={formData.confirmPassword}
                  onChange={handleChange}

                />

                <span
                  className="absolute right-3 top-[56%] text-gray-600 cursor-pointer"
                  onClick={() => toggleShowPassword('confirmPassword')}
                >
                  {showPassword.confirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>
              </div><br />
            </div> 
             {passwordError && (
                  <p className="text-[10px] text-red-500 ">{passwordError}</p>
                )}<br/>

            {/* Submit Button */}
            
            <button
              type="submit"
              className="teal-button w-full h-[50px] bg-[#2c6472]  hover:bg-[#24525f] text-white py-3  rounded-md"
            >
              Sign Up
            </button>
          </form><br />

          {/* Switch to Login */}
          <div className=" text-center text-sm me-2 text-gray-600">
            Already have an account?{' '}
            <Link to="/user/login" className="text-[#2c6472] font-semibold hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-[#2c6472] text-white px-8">
        <h1 className="text-xl font-medium mb-3 ms-2 text-center">Welcome to</h1>
        <div className="flex items-center mb-4 -ms-2">
          <img
            src={logo}
            className="h-8 w-8"
          />
          <h3 className="text-black text-xl font-medium">JSE AI</h3>
        </div>
        <div className='relative mb-5 flex justify-center items-center ms-4'>
          <img src={frame} alt="" className='relative object-cover ' />
          <DotLottieReact
            src="https://lottie.host/47dbe349-fbbc-4772-9026-56f4ed8832c8/G4VcaYQkF2.lottie"
            loop
            autoplay
            style={{ width: '100px', height: '100px' }}
            className='absolute object-cover me-2 p-2'
          />
        </div><br />
        <p className=" text-center text-sm max-w-xs italic">
          "Unlock your next opportunity — your dream job is just a click away."
        </p>
      </div>

      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center border-b-[#2c6472] border-b-8">
            <h2 className="text-xl font-semibold mb-4 text-[#2c6472]">Check Your Email 📬</h2>
            <p className="text-gray-700 ">We've sent you a verification link. Please verify before login!</p>
          </div>
        </div>
      )}


      {/* Fullscreen Overlay with Animation */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-40 transition-opacity duration-1000">
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

export default Signup;


