import React from 'react'
import logo from '../../assets/jsenewlogo.png'
import insert from '../../assets/insert-icon.svg'
import upload from '../../assets/bx_upload.svg'
import linked from '../../assets/logos_linkedin-icon.svg'
import { Link } from 'react-router-dom'

const DataOnboarding = () => {
    return (
        <div className="flex flex-col md:flex-row h-screen bg-white">
            {/* Left Sidebar */}
            <div className="w-full md:w-[30%] p-5 md:pl-7 bg-gradient-to-b from-[#2E8095] to-[#2C6472] text-white flex flex-col items-center md:items-start">
                <div className="flex items-center md:mb-10">
                    <img className='w-24 h-10 object-fill' src={logo} alt="JobFusion Logo" />
                </div>
                <div className="mt-5 md:mt-40 text-center md:text-left">
                    <p className='font-semibold sm:text-2xl md:text-3xl'>Just a few steps away from landing your dream job</p>
                    <p className='text-sm sm:text-base md:text-lg mt-5 text-white/90'>Start building your profile and unlock new career opportunities.</p>
                </div>
            </div>

            {/* Right Content Area */}
            <div className="w-full md:w-[70%] flex flex-col items-center text-black p-5 md:p-10">
                <div className="w-full flex flex-col items-center mt-10">
                    <h1 className='font-semibold text-lg sm:text-2xl md:text-3xl text-center'>Build your job profile in just a few steps.</h1>
                    <p className='mt-3 text-sm md:text-base text-center'>Select an option that works best for you.</p>
                </div>

                <div className="flex flex-col gap-6 mt-10 md:mt-20">
                    <Link to="/user/onboarding/personal-information">
                        <div className="flex w-full md:w-[450px] h-[80px] md:h-[96px] gap-5 p-5 md:pl-8 items-center border-dashed border-2 border-[#2c6472]/50 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
                            <img src={insert} className='w-6 h-6 object-cover' alt="" />
                            <p className='text-sm sm:text-base md:text-lg font-medium'>Create a Profile from Scratch</p>
                        </div>
                    </Link>
                    <Link to="/user/resume">
                        <div className="flex w-full md:w-[450px] h-[80px] md:h-[96px] gap-5 p-5 md:pl-8 items-center border-dashed border-2 border-[#2c6472]/50 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
                            <img src={upload} className='w-6 h-6 object-cover' alt="" />
                            <p className='text-sm sm:text-base md:text-lg font-medium'>Upload Resume</p>
                        </div>
                    </Link>
                    {/* <Link to="/user/linkedin"> 
                        <div className="flex w-[450px] h-[72px] gap-5 pl-8 items-center border-dashed border-2 border-[#2c6472]/50 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
                            <img src={linked} className='w-6 h-6 -mt-1 object-cover' alt="" />
                            <p className='text-lg font-medium'>Import from Linkedin</p>
                        </div>
                    </Link> */}
                </div>
            </div>
        </div>
    )
}

export default DataOnboarding
