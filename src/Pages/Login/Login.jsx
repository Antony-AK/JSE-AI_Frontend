import React, { useState } from 'react';
import { t } from "../../utils/i18n";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from "../../assets/Animation - 1745282599914.json";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import google from "./../../assets/Google.png";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import frame from "./../../assets/Frame.png";
import logo from "../../assets/jsenewlogo.png"
import { BASE_URL } from '../../utils/api';
import { useProfileImage } from '../../base/ProfileEditor/ProfileImageContext';


const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { fetchProfileImage } = useProfileImage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading immediately when login is submitted
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('authToken', data.token);
        fetchProfileImage(data.token); // ✅ Pass the token explicitly

         const { next_step, progress_completed } = data.user;

      const stepToPath = {
        personal_info: '/user/onboarding/personal-information',
        work_experiences: '/user/onboarding/work-experience',
        academics: '/user/onboarding/education',
        projects: '/user/onboarding/projects',
        languages: '/user/onboarding/languages',
        certificates: '/user/onboarding/certificates',
        preferred_job_titles: '/user/onboarding/jobtitles',
        key_skills: '/user/onboarding/skills',
      };

      const isFirstLogin = localStorage.getItem('firstLogin') === 'true';

      if (progress_completed) {
        navigate('/user/dashboard');
      } else if (isFirstLogin) {
        localStorage.removeItem('firstLogin');
        navigate('/user/dataonboarding');
      } else if (next_step && stepToPath[next_step]) {
        navigate(stepToPath[next_step]);
      } else {
        navigate('/user/dataonboarding'); // Fallback
      }

      } else {
        toast.error(data.issue || t("login.errors.login_failed"));
        setLoading(false); // ✅ Stop loading on error
      }
    } catch (err) {
      toast.error(t("login.errors.network_error") + err.message);
      setLoading(false); // ✅ Stop loading on error
    }
  };



  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-col-reverse md:flex-row md:flex-1">
        {/* Left Panel */}
        <div className="flex flex-1 justify-center items-center p-8 py-14 bg-white">
          <div className="max-w-lg w-full">
            <h2 className="text-xl md:text-3xl font-semibold text-center mb-2">{t("login.title")}</h2><br /><br />

            {/* <button className="w-full h-[52px] flex items-center justify-center border border-gray-300 py-3 rounded-md mb-1 hover:bg-[#2c6472]/5 hover:border-[#2c6472] transition">
              <img src={google} className="mr-4 text-xl text-gray-600" />
              <span className="text-base text-gray-700">Continue with Google</span>
            </button><br />

            <div className="flex items-center my-2">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="mx-3 text-gray-400 text-sm">or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div><br /> */}

            <form onSubmit={handleSubmit} className="grid gap-y-5">
              <div className="relative -mt-5">
                <label className="mb-1 ms-3 block  text-gray-500 text-sm">

                  {t("login.email")}
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

                  {t("login.password")}
                </label>
                <input
                  id='password'
                  type={showPassword ? 'password' : 'text'}
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
                <Link to="/user/forgot-password" className="hover:underline font-semibold">
                  {t("login.forgot_password")}
                </Link>
              </div>

              <button
                type="submit"
                className="teal-button w-half h-[50px] bg-[#2c6472] text-white py-2 mt-4 rounded-md font-semibold hover:bg-[#24525f] transition"
                disabled={loading}
              >
                {t("login.login")}
              </button><br />
            </form>

            <p className="text-center text-sm -mt-2">
              {t("login.no_account")}{" "}
              <Link to="/user/signup" className="text-[#2c6472] font-semibold hover:underline">
                {t("login.signup")}
              </Link>
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex md:flex-1 flex-col justify-center items-center bg-[#2c6472] text-white p-8 ">
          <div className="flex flex-col  items-center mb-3">
            <h3 className="text-center text-xl md:text-3xl ms-4 mb-2 font-medium">{t("login.right_panel.welcome")}</h3>
            <img
              src={logo}
              className="h-10 md:h-12 w-24 md:w-28"
            />
          </div>
          <div className='hidden relative mb-5 md:flex justify-center items-center ms-4'>
            <img src={frame} alt="" className='relative object-cover ' />
            <DotLottieReact
              src="https://lottie.host/47dbe349-fbbc-4772-9026-56f4ed8832c8/G4VcaYQkF2.lottie"
              loop
              autoplay
              style={{ width: '70px', height: '70px' }}
              className='absolute object-cover me-2 p-2'
            />
          </div>
          <div> <p className="hidden md:block  text-center items-center text-sm  mt-4">
            {t("login.right_panel.subtitle_line1")}<br />
            {t("login.right_panel.subtitle_line2")}
        </p>
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