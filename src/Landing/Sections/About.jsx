import React from 'react';
import bot2 from "../../assets/bot2.png"

const About = () => {
  return (
    <section  className="w-full h-[80vh]  flex justify-between items-center bg-white py-20 px-6 ">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left: Robot Image */}
        <div className="flex-shrink-0 w-96 h-96">
          <img src={bot2} alt="" />
         
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
