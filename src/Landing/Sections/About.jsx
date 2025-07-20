import React from 'react';
import bot2 from "../../assets/bot2.png";

const About = () => {
  return (
    <section className="w-full h-auto md:h-[90vh] bg-white  md:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:mt-14  items-center justify-between md:gap-10">
        
        {/* Left: Robot Image */}
        <div className="w-full max-w-[300px] sm:max-w-[350px]   md:w-96 md:h-96 mx-auto md:mx-auto">
          <img src={bot2} alt="JSE Bot" className="w-full h-auto object-contain mx-auto ms-10 md:ms-0" />
        </div>

        {/* Right: Text */}
        <div className="text-[#2c6472] text-center text-xl md:text-left sm:text-2xl md:text-3xl font-semibold mb-10 leading-relaxed sm:leading-[2.5rem] md:leading-[3rem] font-poppins px-2">
          Let JSE AI search and personalize job <br />
          opportunities for you. So you can focus on <br />
          growing, not grinding.
        </div>
      </div>
    </section>
  );
};

export default About;
