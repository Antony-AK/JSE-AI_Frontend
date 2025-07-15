import React from 'react';
import dream1 from "../../assets/laptop.png"
import dream2 from "../../assets/dreamjob21.svg"
import dream3 from "../../assets/dreamjob22.svg"
import bot3 from "../../assets/bot1.png"




const DreamJobSection = () => {
  return (
    <section id="features" className=" bg-white  py-16 px-4">
      {/* Top Section */}
      <div className='relative z-[999]  bg-white'>

        <div className=" text-center mb-16 ">
          <img src={bot3} alt="" className='w-52 h-30 absolute -top-24 left-[45%]' />

          <h2 className="text-2xl sm:text-3xl mt-10 font-bold text-black">
            We bring you closer to your dream job.
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            We discover. You elevate. Goals achieved.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-40 max-w-6xl mx-auto text-center">
          {/* Card 1 */}
          <div>
            <div className="bg-[#ffd7d7] p-4 rounded-2xl flex justify-center items-center h-56">
              <img src={dream1} alt="Career Starts" className="object-contain mt-[87px] h-full" />
            </div>
            <h3 className="text-xl font-semibold mt-4">Your Career Starts Here.</h3>
            <p className="text-sm font-medium mt-2 text-center">Everything you need to land your dream job.</p>
          </div>

          {/* Card 2 */}
          <div>
            <div className="bg-[#ffc8b1] p-4 rounded-2xl flex flex-col justify-center items-center h-56 ">
              <img src={dream2} alt="Gateway to Jobs" className="object-contain  h-[60%]" />
              <img src={dream3} alt="" className="object-contain h-[50%]" />
            </div>
            <h3 className="text-xl font-semibold mt-4">Your Gateway to Jobs.</h3>
            <p className="text-sm font-medium mt-2 w-[300px] -ms-2 text-center ">
              Generate CVs & Cover Letters in German<br /> & English.
            </p>
          </div>

          {/* Card 3 */}
          <div>
            <div className="bg-[#c7f5cb] p-4 rounded-2xl relative w-80 h-64">
              <div className="absolute top-4 left-6 rotate-[-10deg] bg-blue-500 text-white text-xs font-medium px-4 py-2 h-9 w-28 rounded-md flex items-center justify-center shadow-md">Projects</div>

              <div className="absolute top-12 right-6 rotate-[10deg] bg-orange-500 text-white text-xs font-medium px-4 py-2 h-9 w-28 rounded-md flex items-center justify-center shadow-md">FAQ</div>

              <div className="absolute bottom-28 left-8 rotate-[-5deg] bg-green-800 text-white text-xs font-medium px-4 py-2 h-9 w-28 rounded-md flex items-center justify-center shadow-md">Job</div>

              <div className="absolute bottom-20 right-8 rotate-[5deg] bg-blue-200 text-white text-xs font-medium px-4 py-2 h-9 w-28 rounded-md flex items-center justify-center shadow-md">Activities</div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#2c6472] text-white text-xs font-medium px-2 py-2 h-9 w-28 rounded-md flex items-center justify-center shadow-md">Job Research</div>
            </div>

            <h3 className="text-xl font-semibold mt-4">Research. Align.Act</h3>
            <p className="text-sm text-black font-medium  mt-2 -ms-2 w-[300px] text-center">
              Study. Plan. Act. Learn the company’s mission before interviewing.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DreamJobSection;
