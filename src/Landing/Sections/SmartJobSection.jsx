import React from 'react';
import smartjob from "../../assets/girl.mp4"
import smartjobicon from "../../assets/smartjobicon.png"
import bot3 from "../../assets/bot3.png"



const SmartJobSection = () => {
  return (
    <section className="relative bg-white py-16 px-6 sm:px-6 md:px-10">
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left: Image + Robot */}
        <div className="relative w-full md:w-1/2 flex justify-center">
          <div className="aspect-square w-[80%] bg-slate-200 rounded-xl overflow-hidden">
            <video
              loop
              autoPlay
              muted
              playsInline
              src={smartjob}
              alt="Woman on laptop"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Text */}
        <div className="w-full md:w-1/2 flex flex-col  justify-start items-start">
          <h2 className="text-2xl sm:text-3xl  font-semibold text-gray-900 leading-snug mb-4">
            More than a job site.
            <span className="text-[#2c6472] font-bold"> JSE AI </span>
            finds and<br />filters the best jobs, just for you.
          </h2>
          <p className=" mb-10  text-sm font-medium sm:text-base">
            Let our AI generate CVs, smart career match and track jobs<br />
            for you. while you stay focused on getting hired.
          </p>

          {/* Features */}
          <ul className="space-y-10 text-sm sm:text-base text-gray-700">
            <li className="flex items-start gap-3">
              <img src={smartjobicon} alt="icon" className="w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-xl text-black mb-1">Profile Based Matching</p>
                <p className='font-medium'>
                  we scan your profile to match you with <br /> the right jobs.
                  No more guesswork.
                </p>
              </div>
            </li>
            <li className="flex  items-start  gap-3">
              <img src={smartjobicon} alt="icon" className="w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-xl text-black mb-1">AI-Generated Resumes & Cover Letters</p>
                <p className='font-medium'>Generate professional, tailored documents instantlly <br /> for every job.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <img src={smartjobicon} alt="icon" className="w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-xl text-black mb-1">Apply Tracker Dashboard</p>
                <p className='font-medium'>
                  Track all your job applications
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SmartJobSection;
