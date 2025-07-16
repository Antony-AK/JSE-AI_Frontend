import React from 'react';
import dream1 from "../../assets/MacBook2.png"
import dream2 from "../../assets/MacBook1.png"
import dream3 from "../../assets/MacBook3.png"
import bot3 from "../../assets/bot1.png"

const DreamJobSection = () => {
  return (
    <section id="features" className=" bg-white  py-16 px-4">
      {/* Top Section */}
      <div className='relative z-[999]  bg-white'>

        <div className=" text-center mb-16 ">
          <img src={bot3} alt="" className='w-52 h-30 absolute -top-24 left-[43%]' />

          <h2 className="text-2xl sm:text-3xl mt-10 font-bold text-black">
            We bring you closer to your dream job.
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium sm:text-base">
            We discover. You elevate. Goals achieved.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl  mx-auto text-center">
          {/* Card 1 - Build Your CV */}
          <div className='flex justify-center items-center flex-col'>
            <div className="bg-[#ffd7d7]  rounded-2xl flex justify-center items-center w-80 h-64">
              <img src={dream2} alt="Career Starts " className="object-cover rounded-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-center mt-6">Build Your CV</h3>
            <p className="text-sm font-medium mt-2 leading-relaxed text-center">
              Build your CV or upload<br />
              Choose the 3 Jobs Title<br />
              Let AI find the perfect job posts for you
            </p>
          </div>

          {/* Card 2 - Find Your Match */}
          <div className='flex justify-center items-center flex-col'>
            <div className="bg-[#ffc8b1]  rounded-2xl flex flex-col justify-center items-center w-80 h-64 ">
              <img src={dream1} alt="Gateway to Jobs" className="object-cover rounded-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-center mt-6">Find Your Match & Apply</h3>
            <p className="text-sm font-medium mt-2 w-[300px] leading-relaxed text-center">
              Choose the language of application<br />
              Pick the jobs recommended by AI or you<br />
              Enjoy automation, just review and send
            </p>
          </div>

          {/* Card 3 - Track Your Applications */}
          <div className='flex justify-center items-center flex-col'>
            <div className="bg-[#ffc8b1]  rounded-2xl flex flex-col justify-center items-center w-80 h-64 ">
              <img src={dream3} alt="Gateway to Jobs" className="object-cover rounded-2xl" />
            </div>

            <h3 className="text-xl font-semibold text-center mt-6">Track Your Applications</h3>
            <p className="text-sm text-black font-medium  mt-2 leading-relaxed w-[300px] text-center">
              Track all your job applications<br />
              Prepare for interviews with smart research<br />
              Celebrate your perfect match!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DreamJobSection;
