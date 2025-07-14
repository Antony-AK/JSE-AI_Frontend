import React from 'react';

const About = () => {
  return (
    <section  className="w-full h-[50vh]  flex justify-between items-center bg-gray-500 py-20 px-6 ">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-24">
        {/* Left: Robot Image */}
        <div className="flex-shrink-0 w-80 h-96">
         
        </div>

        {/* Right: Text */}
        <div className="text-[#2c6472] text-lg sm:text-3xl font-semibold leading-[4rem] font-poppins">
          Let JSE AI search and personalize job<br />
          opportunities for you. So you can focus on<br />
          growing, not grinding.
        </div>
      </div>
    </section>
  );
};

export default About;
