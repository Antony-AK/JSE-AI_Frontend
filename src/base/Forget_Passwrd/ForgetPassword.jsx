import React, { useState, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from "../../assets/Animation - 1745282599914.json";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import frame from "./../../assets/Frame.png";
import logo from "../../assets/jsenewlogo.png"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';



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
            const response = await axios.post("https://dev.arshan.digital/b1/auth/request-password-reset", {
                email: email.trim(),
            });

            toast.success("Verification mail sent! 📧");
            console.log("✅ Success:", response.data);

            // optionally redirect to OTP screen or something here
        } catch (err) {
            console.error("❌ Error:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="flex flex-col min-h-screen ">
            <div className="flex flex-1">
                {/* Left Panel */}
                <div className="flex w-[50%] justify-center items-center p-8 bg-white">
                    <div className=" w-[1200px] ">
                        <h2 className="text-2xl font-semibold w-full text-center mb-3"> Forget Password </h2>
                        <h4 className='w-[80%] mx-auto flex flex-col justify-center items-center font-medium text-center mb-10'>We’ll send a verification code to this email if it matches an existing <span className='text-[#2c6472] font-semibold text-lg'>JSE AI <span className='text-black text-base font-medium'>account</span></span></h4>


                        {/* INPUT Boxes */}
                        <div className="flex flex-col justify-center items-center gap-2 mt-6">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-[70%] h-14  px-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 ring-[#2c6472] transition-all"
                                placeholder='Enter your registered email'
                            />
                        </div>


                        <div className="mt-14 w-[70%] mx-auto flex justify-center items-center">
                            <button
                                onClick={() => navigate('/user/login')}
                                className="w-44 mx-auto py-3 bg-white text-[#2c6472]  rounded-2xl border-2 border-[#2c6472] font-semibold hover:bg-[#1f4d59]/5 transition-all"
                            >
                                Back
                            </button>
                            {/* Verify Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-44 mx-auto py-3 bg-[#2c6472] text-white rounded-2xl font-semibold hover:bg-[#1f4d59] transition-all"
                            >
                                {loading ? "Sending..." : "Verify"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="flex flex-1 flex-col justify-center items-center bg-[#2c6472] text-white p-8">
                    <div className="flex flex-col  items-center mb-3">
                        <h3 className="text-center  text-2xl ms-4 font-medium">Welcome Back!</h3>
                        <img
                            src={logo}
                            className="h-12 w-28"
                        />
                    </div>
                    <div className='relative mb-5 flex justify-center items-center ms-4'>
                        <img src={frame} alt="" className='relative object-cover ' />
                        <DotLottieReact
                            src="https://lottie.host/ea3cb741-1e89-48d0-89de-a5ad795a6cff/Ok1556eeUy.lottie"
                            loop
                            autoplay
                            style={{ width: '100px', height: '100px' }}
                            className='absolute object-cover me-2 p-1'
                        />
                    </div>
                    <div> <p className=" text-center items-center text-sm  mt-4">
                        Unlock your next opportunity<br />
                        Your dream job is just a click away        </p>
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