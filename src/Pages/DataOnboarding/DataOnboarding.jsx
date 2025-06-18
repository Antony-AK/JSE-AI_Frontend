import React from 'react'
import logo from '../../assets/logo.png'
import insert from '../../assets/insert-icon.svg'
import upload from '../../assets/bx_upload.svg'
import linked from '../../assets/logos_linkedin-icon.svg'
import { Link } from 'react-router-dom'

const DataOnboarding = () => {
    return (
        <div className="flex h-screen p-5 bg-white">
            {/* Left Sidebar */}
            <div className="w-[27%] h-[99.5%] p-5 pl-7 bg-gradient-to-b from-[#2E8095] to-[#2C6472] text-white">
                <div className="flex items-center mb-10">
                    <img className='w-10 h-10 object-fill' src={logo} alt="JobFusion Logo" />
                    <p className="text-white ml-2 text-lg font-semibold">JSE AI</p>
                </div>
                <div className=" items-center mt-40">
                    <p className='font-semibold text-3xl'>Just a few steps away from landing your dream job</p>
                    <p className='text-lg mt-5 text-white/90'>Start building your profile and unlock new career opportunities.</p>
                </div>
            </div>

            {/* Right Content Area */}
            <div className="ms-[27%] fixed top-10 flex flex-col items-center h-full w-[73%] text-black p-10">
                <div className="w-full flex mx-auto items-center flex-col">
                    <h1 className='font-semibold text-3xl'>Build your job profile in just a few steps.</h1>
                    <p className=' mt-3  -ml-72 '>Select an option that works best for you.</p>
                </div>

                <div className="flex flex-col gap-7 mt-24  -ml-32">
                    <Link to="/user/onboarding/personal-information"><div className="flex w-[500px] h-20 gap-5 pl-8 items-center border-dashed border-2 border-[#2c6472]/50 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
                        <img src={insert} className='w-6 h-6 -mt-1 object-cover' alt="" />
                        <p className='text-lg font-medium'>Create a Profile from Scratch</p>
                    </div></Link>
                    <Link to="/user/resume"> <div className="flex w-[500px] h-20 gap-5 pl-8 items-center border-dashed border-2 border-[#2c6472]/50 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
                        <img src={upload} className='w-6 h-6 -mt-1 object-cover' alt="" />
                        <p className='text-lg font-medium'>Upload Resume</p>
                    </div></Link>
                    <Link to="/user/linkedin"> <div className="flex w-[500px] h-20 gap-5 pl-8 items-center border-dashed border-2 border-[#2c6472]/50 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
                        <img src={linked} className='w-6 h-6 -mt-1 object-cover' alt="" />
                        <p className='text-lg font-medium'>Import from Linkedin</p>
                    </div></Link>
                </div>

            </div>
        </div>
    )
}

export default DataOnboarding

