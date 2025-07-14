import React from 'react';
import dream1 from "../../assets/laptop.png"
import dream2 from "../../assets/dreamjob21.svg"
import dream3 from "../../assets/dreamjob22.svg"



const DreamJobSection = () => {
  return (
    <section className="bg-white py-16 px-4">
      {/* Top Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <img src="" alt="Floating Robot" className="w-24 h-16 object-contain bg-slate-200" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-black">
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
          <div className="bg-[#ffc8b1] p-4 rounded-2xl flex justify-center items-center h-56">
            <img src={dream2} alt="Gateway to Jobs" className="object-contain h-full" />
            <img src={dream3} alt="" className="object-contain h-full" />
          </div>
          <h3 className="text-xl font-semibold mt-4">Your Gateway to Jobs.</h3>
          <p className="text-sm font-medium mt-2 w-[300px] -ms-2 text-center ">
            Generate CVs & Cover Letters in German<br/> & English.
          </p>
        </div>

        {/* Card 3 */}
        <div>
          <div className="bg-[#c7f5cb] p-4 rounded-2xl flex justify-center items-center h-56">
            <img src="" alt="Research Align Act" className="object-contain h-full" />
          </div>
          <h3 className="text-xl font-semibold mt-4">Research. Align.Act</h3>
          <p className="text-sm text-black font-medium  mt-2 -ms-2 w-[300px] text-center">
            Study. Plan. Act. Learn the company’s mission before interviewing.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DreamJobSection;
