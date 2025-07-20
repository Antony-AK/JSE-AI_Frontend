import React from 'react';
import dream1 from "../../assets/MacBook2.png";
import dream2 from "../../assets/MacBook1.png";
import dream3 from "../../assets/MacBook3.png";
import bot3 from "../../assets/bot1.png";

const DreamJobSection = () => {
  return (
    <section id="features" className="bg-white scroll-mt-28 min-h-[100vh] px-4">
      {/* Top Section */}
      <div className=" ">
        {/* Heading & Bot */}
        <div className="text-center mb-20 relative">
          <img
            src={bot3}
            alt=""
            className="w-36 sm:w-52 absolute -top-16 md:-top-24 left-1/2 -translate-x-1/2"
          />
          <h2 className="text-2xl sm:text-3xl mt-20 font-bold text-black">
            We bring you closer to your dream job.
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium sm:text-base">
            We discover. You elevate. Goals achieved.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto text-center">
          {/* Card 1 */}
          <div className="flex flex-col items-center">
            <div className="rounded-2xl w-full max-w-[320px] h-64 flex justify-center items-center">
              <img
                src={dream2}
                alt="Career Starts"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-center mt-6">
              Define your target
            </h3>
            <ul className="text-sm sm:text-base font-medium mt-4 space-y-2 text-gray-600 text-left list-disc list-inside">
              <li>Build your CV or upload</li>
              <li>Choose job titles</li>
              <li>Let AI find the perfect job posts for you</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center">
            <div className="rounded-2xl w-full max-w-[320px] h-64 flex justify-center items-center">
              <img
                src={dream1}
                alt="Gateway to Jobs"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-center mt-6">
              Find Your Match & Apply
            </h3>
            <ul className="text-sm sm:text-base font-medium mt-4 space-y-2 ms-4  text-gray-600 text-left list-disc list-inside max-w-[340px]">
              <li>Choose the language of application</li>
              <li>Pick recommended job posts or upload external ones</li>
              <li>Enjoy automated applications just review and send</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center">
            <div className="rounded-2xl w-full max-w-[320px] h-64 flex justify-center items-center">
              <img
                src={dream3}
                alt="Track Applications"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-center mt-6">
              Track Your Applications
            </h3>
            <ul className="text-sm sm:text-base font-medium mt-4 space-y-2 text-gray-600 text-left list-disc list-inside max-w-[300px]">
              <li>Easily Track the status of all your applications </li>
              <li>Prepare for interviews with smart research</li>
              <li>Celebrate your perfect match!</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DreamJobSection;
