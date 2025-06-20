import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import linkedinLogo from '../../assets/linkedin-full-logo.png'

const Linkedin = () => {
      const navigate = useNavigate();
    const loading = false; // Simulating loading state, replace with actual state management if 
    return (
        <div className="flex h-screen p-5 bg-white">
            {/* Left Sidebar */}
            <div className="w-[30%] h-[99.5%] p-5 pl-7 bg-gradient-to-b from-[#2E8095] to-[#2C6472] text-white">
                <div className="flex items-center mb-10">
                    <img className='w-10 h-10 object-fill' src={logo} alt="JobFusion Logo" />
                    <p className="text-white ml-2 text-lg font-semibold">JSE AI</p>
                </div>
                <div className=" items-center mt-40">
                    <p className='font-semibold text-3xl'>Just a few steps away from landing your dream job</p>
                    <p className='text-lg mt-5 text-white/90'>Start building your profile and unlock new career opportunities.</p>
                </div>
            </div>

            <div className="ms-[27%] fixed top-10 flex flex-col items-center h-full w-[73%] text-black p-10">
                <div className="flex flex-col w-[70%] h-[60%] items-center border border-gray-500/40">
                    <div className="w-full flex mx-auto mt-8 items-center flex-col">
                        <h1 className='font-semibold text-2xl'>Import from</h1>
                        <img src={linkedinLogo} className=' mt-3  w-24 h-6 object-cover  ' />
                        <p className='mt-8 text-base text-gray-700 font-medium'><span className='font-semibold text-lg'>JSE Ai Import</span> would like to: </p>
                    </div>

                    <div className="w-full flex mx-auto mt-3 gap-6 items-center flex-col">
                        <p className='text-lg font-medium text-gray-700 mt-5'>Use your full profile including  your experience,<br />
                            education, skills and recommendations.</p>
                        <p className='text-lg font-medium text-gray-700 mt-2'>You can stop this sync in your Linkedin settings.<br />
                            JSE Ai profile import terms apply.learn more.</p>
                    </div>
                </div>

                <div className='text-center m-10 text-lg font-medium text-[#2c6472] hover:scale-95 transition-transform ease-in-out duration-200 cursor-pointer'>Not you?</div>

                {/* Buttons */}
                <div className="flex w-[50%] justify-between items-center gap-4 ">
                    <button
                        type="button"
                        className=" teal-button px-6 py-2 bg-[#2c6472] text-white w-[130px] h-[44px]  rounded-full focus:outline-none transition-transform duration-200 ease-in-out"
                  onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className=" teal-button px-6 py-2 bg-[#2c6472] text-white w-[130px] h-[44px]  rounded-full focus:outline-none transition-transform duration-200 ease-in-out"
                    //   onClick={handleNext}
                    >
                        Allow
                    </button>
                </div>
            </div>

        </div>
    )
}

export default Linkedin
