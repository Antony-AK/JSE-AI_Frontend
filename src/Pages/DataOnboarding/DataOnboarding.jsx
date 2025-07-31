import React from 'react'
import { t } from "../../utils/i18n";
import logo from '../../assets/jsenewlogo.png'
import insert from '../../assets/insert-icon.svg'
import upload from '../../assets/bx_upload.svg'
import linked from '../../assets/logos_linkedin-icon.svg'
import { Link } from 'react-router-dom'

const DataOnboarding = () => {
    return (
        <div className="flex p-5 flex-col md:flex-row h-screen bg-white">
            {/* Left Sidebar */}
            <div className="w-full md:w-[30%] p-5 md:pl-7 bg-gradient-to-b from-[#2E8095] to-[#2C6472] text-white flex flex-col items-center  md:items-start">
                <div className="flex items-center md:mb-10">
                    <img className='w-24 h-10 object-fill' src={logo} alt="JobFusion Logo" />
                </div>
                <div className="mt-5 md:mt-40  text-center md:text-left">
                    <p className='font-semibold sm:text-2xl w-72 md:w-full mx-auto md:text-3xl'>{t("dataOnboarding.sidebar.title")}</p>
                    <p className='hidden md:block text-sm sm:text-base md:text-lg mt-5 text-white/90'>{t("dataOnboarding.sidebar.subtitle")}</p>
                </div>
            </div>

            {/* Right Content Area */}
            <div className="w-full md:w-[70%] flex flex-col items-center text-black p-5 md:p-10">
                <div className="w-full flex flex-col items-center mt-20 md:mt-16">
                    <h1 className='font-semibold text-lg sm:text-2xl md:text-3xl text-center'>{t("dataOnboarding.main.title")}</h1>
                    <p className='mt-3 text-sm md:text-base text-center'>{t("dataOnboarding.main.subtitle")}</p>
                </div>

                <div className="flex flex-col gap-6 mt-10 md:mt-20">
                    <Link to="/user/onboarding/personal-information">
                        <div className="flex w-full md:w-[450px] h-[80px] md:h-[96px] gap-5 p-5 md:pl-8 items-center border-dashed border-2 border-[#2c6472]/50 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
                            <img src={insert} className='w-6 h-6 object-cover' alt="" />
                            <p className='text-sm sm:text-base md:text-lg font-medium'>{t("dataOnboarding.options.createProfile")}</p>
                        </div>
                    </Link>
                    <Link to="/user/resume">
                        <div className="flex w-full md:w-[450px] h-[80px] md:h-[96px] gap-5 p-5 md:pl-8 items-center border-dashed border-2 border-[#2c6472]/50 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
                            <img src={upload} className='w-6 h-6 object-cover' alt="" />
                            <p className='text-sm sm:text-base md:text-lg font-medium'>{t("dataOnboarding.options.uploadResume")}</p>
                        </div>
                    </Link>
                    {/* <Link to="/user/linkedin"> 
                        <div className="flex w-[450px] h-[72px] gap-5 pl-8 items-center border-dashed border-2 border-[#2c6472]/50 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
                            <img src={linked} className='w-6 h-6 -mt-1 object-cover' alt="" />
                            <p className='text-lg font-medium'>{t("dataOnboarding.options.importLinkedin")}</p>
                        </div>
                    </Link> */}
                </div>
            </div>
        </div>
    )
}

export default DataOnboarding
