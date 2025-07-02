import React, { useState, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from "../../assets/Animation - 1745282599914.json";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import frame from "./../../assets/Frame.png";
import logo from "../../assets/logo.png"
import foretpassowrd from "../../assets/forget-password.png";


const ForgetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const otpInputsRef = [useRef(), useRef(), useRef(), useRef()];


    const handleOtpChange = (value, index) => {
        if (!/^\d?$/.test(value)) return; // Only digits

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        // Auto focus next
        if (value && index < otpInputsRef.length - 1) {
            otpInputsRef[index + 1].current.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputsRef[index - 1].current.focus();
        }
    };



    return (
        <div className="flex flex-col min-h-screen ">
            <div className="flex flex-1">
                {/* Left Panel */}
                <div className="flex w-[50%] justify-center items-center p-8 bg-white">
                    <div className=" w-[1200px] ">
                        <h2 className="text-2xl font-semibold w-full text-center mb-14">Enter the code sent to your email to <br /> change your password.</h2>

                        {/* OTP Boxes */}
                        <div className="flex justify-center items-center gap-4 mt-6">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={otpInputsRef[index]}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 ring-[#2c6472] transition-all"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    placeholder='-'
                                />
                            ))}
                        </div>


                        <div className="mt-14 w-[70%] mx-auto">
                            {/* Verify Button */}
                            <button
                                className="w-full py-3 bg-[#2c6472] text-white rounded-md font-semibold hover:bg-[#1f4d59] transition-all"
                            >
                                Verify
                            </button>
                        </div>
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

export default ForgetPassword;