import React, { useState, useEffect, useRef } from "react";
import { t } from "../../utils/i18n";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../../assets/Animation - 1745282599914.json";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import google from "./../../assets/Google.png";
import frame from "./../../assets/Frame.png";
import logo from "../../assets/jsenewlogo.png";
import { BASE_URL } from "../../utils/api";
import flag from "../../assets/germanyflag.png";
import arrow from "../../assets/downarrow.png";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [shakePassword, setShakePassword] = useState(false);
  const [agreedToFirst, setAgreedToFirst] = useState(false);
  const [agreedToSecond, setAgreedToSecond] = useState(false);
  const dropdownRef = useRef(null);




  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clean phoneNumber only
    const newValue = name === "phoneNumber" ? value.replace(/\D/g, "") : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue
    }));

    // Real-time password validation
    if (name === "password") {
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newValue);
      const hasNumber = /\d/.test(newValue);
      const isLongEnough = newValue.length >= 8;

      if (!isLongEnough || !hasSpecialChar || !hasNumber) {
        setPasswordError(t("signup.errors.password_hint"));
      } else {
        setPasswordError("");
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

  };




  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error(t("signup.errors.password_mismatch"));
      return;
    }

    if (!agreedToSecond) {
      toast.error(t("signup.errors.accept_terms"));
      return;
    }


    if (!formData.password || passwordError) {
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 400);
      toast.error(t("signup.errors.invalid_password"));

      return;
    }

    const signupData = {
      email: formData.email,
      number: formData.phoneNumber, // <-- Ensure it matches the backend field
      password: formData.password,
    };

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/auth/signup`,
        signupData, // Request body as the second argument
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Signup successful:", response.data);


        // 👉 Set first login flag so we know it was a new signup
        localStorage.setItem("firstLogin", "true");

        if (window.fbq) {
          window.fbq('track', 'CompleteRegistration');
        }

        setShowVerificationPopup(true); // Show popup first!

        setTimeout(() => {
          setShowVerificationPopup(false);
          navigate("/user/login", {
            state: {
              email: formData.email,
              phoneNumber: formData.phoneNumber,
            },
          });
          setLoading(false);
        }, 2500); // Wait 2.5 seconds and THEN navigate
      } else {
        console.error("Signup failed");
        setLoading(false);
        toast.error(t("signup.errors.signup_failed"));
      }
    } catch (error) {
      console.error(
        "Error during signup:",
        error.response?.data || error.message
      );
      setLoading(false);
      toast.error(
        error.response?.data?.issue || "Signup failed, please try again."
      );
    }
  };

  const countryOptions = [{ code: "+49", name: "Germany", flag: flag }];

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen relative">
      {/* Left Panel */}
      <div className="flex flex-1 flex-col justify-evenly items-center p-8 bg-white ">
        <div className="max-w-lg w-full mt-5">
          <h2 className="text-xl md:text-3xl font-semibold text-center">
            {t("signup.title")}
          </h2>
          <br />
          <br />

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
          <form onSubmit={handleSignUp} className="space-y-1">
            {/* email Field */}
            <div className="relative -mt-5">
              <label className="mb-1 ms-3 block  text-gray-500 text-sm">
                {t("signup.email")}
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder=" "
                className="w-full h-[52px] px-4 py-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#2c6472] peer"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <br />

            {/* Phone Number Field */}
            <div ref={dropdownRef} className="relative">
              <label className="mb-1 ms-3 block text-gray-500 text-sm">
                {t("signup.phone")}
              </label>

              {/* Flag + Code box */}
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="absolute left-3 top-[29px] w-24 h-10 flex items-center justify-center gap-1.5 px-3 py-1 rounded-md  text-sm cursor-pointer z-10"
              >
                <img src={flag} alt="" className="w-5 h-3 object-cover" />
                <p>{selectedCountry.code}</p>
                <img src={arrow} alt="" className="w-3 h-1.5 object-cover" />
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute left-2 top-full w-fit bg-white border border-gray-300 rounded-md shadow z-20">
                  {countryOptions.map((country, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCountrySelect(country)}
                    >
                      <img
                        src={country.flag}
                        alt={country.name}
                        className="w-5 h-3 object-cover"
                      />
                      <span>{country.code}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Phone input */}
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder=" "
                className="w-full pl-32 h-[52px] px-4 py-3.5 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#2c6472] peer"
                value={formData.phoneNumber}
                onChange={handleChange}
              />

              {formData.phoneNumber &&
                (formData.phoneNumber.length < 10 ||
                  formData.phoneNumber.length > 11) && (
                  <p className="text-[10px] text-red-500 mt-1">
                    (Phone number must be 10 to 11 digits)
                  </p>
                )}
            </div>

            {/* Password Fields */}
            <div className="flex flex-col md:flex-row md:space-x-2">
              {/* Create Password */}
              <div className="w-full md:w-1/2">
                <label className="mb-1 ms-3 mt-3 block text-gray-500 text-sm">
                  {t("signup.password")}
                </label>

                {/* Wrap input + icon in their own relative div */}
                <div className="relative h-[52px]">
                  <input
                    id="password"
                    type={showPassword.password ? "password" : "text"}
                    name="password"
                    placeholder=" "
                    className={`w-full h-full px-4 text-black  border ${passwordError ? "border-gray-300" : "border-gray-300"
                      } rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#2c6472] peer ${shakePassword ? "shake" : ""
                      }`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("password")}
                      className="bg-transparent p-1"
                    >
                      {showPassword.password ? (
                        <FaEyeSlash className="text-gray-500" size={18} />
                      ) : (
                        <FaEye className="text-gray-500" size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>


              {/* Confirm Password */}
              <div className="w-full md:w-1/2">
                <label className="mb-1 md:ms-3 mt-3 block text-gray-500 text-sm">
                  {t("signup.confirm_password")}
                </label>

                <div className="relative h-[52px]">
                  <input
                    id="confirmPassword"
                    type={showPassword.confirmPassword ? "password" : "text"}
                    name="confirmPassword"
                    placeholder=" "
                    className={`w-full h-full px-4  border ${passwordError ? "border-gray-300" : "border-gray-300"
                      } rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#2c6472] peer ${shakePassword ? "shake" : ""
                      }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center z-10">
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      className="bg-transparent p-1"
                    >
                      {showPassword.confirmPassword ? (
                        <FaEyeSlash className="text-gray-500" size={18} />
                      ) : (
                        <FaEye className="text-gray-500" size={18} />
                      )}
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Password Hint Message */}
            {passwordError && (
              <p className="text-[10px] text-red-500 mt-1">{passwordError}</p>
            )}

            <br />

            <div className="flex gap-3 mb-10 items-start border border-gray-300 p-3 rounded-md">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#2c6472] mt-1 shrink-0"
                checked={agreedToFirst}
                onChange={(e) => setAgreedToFirst(e.target.checked)}
              />
              <div className="text-xs text-gray-700 leading-snug">
                I agree to allow <span className="font-semibold text-[#2c6472]">Arshan UG</span> to share my personal information (e.g., name, email) and user-generated content (e.g., CVs and cover letters) with <span className="font-semibold text-[#2c6472]">Partnered University</span> to support my career goals if I am currently studying or have graduated within the last 6 months from that university.
                I understand I can withdraw this consent at any time by contacting <span className="text-[#2c6472] underline">info@arshan.de</span>.
              </div>
            </div>



            <div className="flex gap-3 mb-5 items-start border p-3 border-gray-300 rounded-md">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#2c6472] shrink-0"
                checked={agreedToSecond}
                onChange={(e) => setAgreedToSecond(e.target.checked)}
              />
              <div className="text-xs text-gray-700 leading-snug">
                By signing up, you agree to our{" "}
                <a
                  href="/Terms&Conditions.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline text-[#2c6472] cursor-pointer mx-1"
                >
                  Terms & Conditions
                </a>
                and{" "}
                <a
                  href="/PrivacyPolicy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline ms-1 text-[#2c6472] cursor-pointer"
                >
                  Privacy Policy
                </a>
                .
              </div>
            </div>


            <br />



            {/* Submit Button */}
            <button
              type="submit"
              className="teal-button w-full h-[50px] bg-[#2c6472]  hover:bg-[#24525f] text-white py-3 mt-5 rounded-md"
            >
              {t("signup.signup")}
            </button>
          </form>
          <br />

          {/* Switch to Login */}
          <div className=" text-center mb-5 text-sm me-2 text-gray-600">
            {t("signup.already_have_account")}{" "}
            <Link
              to="/user/login"
              className="text-[#2c6472] font-semibold hover:underline"
            >
              {t("signup.login")}
            </Link>
          </div>
        </div>{" "}
        <div className="text-xs flex items-center justify-center text-center  ">
          <p>
            <span className="font-medium">{t("signup.note_label")}</span>
            <span className="text-[#2c6472]">
              {" "}
              {t("signup.note_message")}
            </span>
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center bg-[#2c6472] text-white px-8 py-8">
        <h3 className="text-xl md:text-3xl font-medium mb-1 ms-4 text-center">
          {t("signup.right_panel.welcome")}
        </h3>
        <div className="flex items-center md:mb-3 -ms-2">
          <img src={logo} className="h-10 md:h-12 w-24 md:w-28" />
        </div>
        <div className="hidden relative mb-5 md:flex justify-center items-center ms-4">
          <img src={frame} alt="" className="relative object-cover " />
          <DotLottieReact
            src="https://lottie.host/47dbe349-fbbc-4772-9026-56f4ed8832c8/G4VcaYQkF2.lottie"
            loop
            autoplay
            style={{ width: "100px", height: "100px" }}
            className="absolute object-cover me-2 p-2"
          />
        </div>
        <p className="hidden md:block text-center text-sm  mt-4">
          {t("signup.right_panel.subtitle_line1")}
          <br />
          {t("signup.right_panel.subtitle_line2")}
        </p>
      </div>

      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[80%] md:w-auto rounded-lg shadow-lg p-8 text-center border-b-[#2c6472] border-b-8">
            <h2 className="text-xl font-semibold mb-4 text-[#2c6472]">
              {t("signup.verification.title")}
            </h2>
            <p className="text-gray-700 ">
              {t("signup.verification.message")}
            </p>
          </div>
        </div>
      )}

      {/* Fullscreen Overlay with Animation */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-30 pointer-events-auto transition-opacity duration-1000">
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
