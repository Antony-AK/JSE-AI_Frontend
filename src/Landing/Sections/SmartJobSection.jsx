import React from 'react';
import smartjob from "../../assets/smartjoba.mp4"
import smartjobicon from "../../assets/smartjobicon.png"



const SmartJobSection = () => {
  return (
    <section className="bg-white py-28 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left: Image + Robot */}
        <div className="relative w-full md:w-1/2 flex justify-center">
          <video
            loop={true}
            autoPlay
            muted
            playsInline
            src={smartjob}
            alt="Woman on laptop"
            className="rounded-xl  w-[80%]  h-[500px] bg-slate-200 object-cover"
          />
          <img
            src=""
            alt="Robot"
            className="absolute -bottom-3 left-16 w-20 h-20 object-contain bg-slate-600 hidden sm:block"
          />
        </div>

        {/* Right: Text */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug mb-4">
            More than a job site.
            <span className="text-[#2c6472] font-bold"> JSE AI </span>
            finds and<br />filters the best jobs, just for you.
          </h2>
          <p className=" mb-10 text-sm font-medium sm:text-base">
            Let our AI generate CVs, smart career match and track jobs<br />
            for you. while you stay focused on getting hired.
          </p>

          {/* Features */}
          <ul className="space-y-10 text-sm sm:text-base text-gray-700">
            <li className="flex items-start gap-3">
              <img src={smartjobicon} alt="icon" className="w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-xl text-black mb-1">Profile Precision Matching</p>
                <p className='font-medium'>
                  AI scans your Experience & Projects to match you with <br/> the right jobs.
                  No more guesswork.
                </p>
              </div>
            </li>
            <li className="flex  items-start  gap-3">
              <img src={smartjobicon} alt="icon" className="w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-xl text-black mb-1">Rise Above the Rest.</p>
                <p className='font-medium'>Our AI boosts your resume to stand out and get noticed<br/> faster.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <img src={smartjobicon} alt="icon" className="w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-xl text-black mb-1">Know Before You Apply</p>
                <p className='font-medium'>
                  Learn about the company before your interview to stand<br/> out.
                  Let AI do the heavy task.
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
