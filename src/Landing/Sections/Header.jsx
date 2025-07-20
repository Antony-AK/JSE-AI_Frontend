import React from 'react';
import bot1 from "../../assets/bot1.png"
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header id="home" className="relative w-full flex-col h-[95vh] md:h-[100vh]  px-4 text-center flex justify-center items-center font-Manrope">
      <div className='w-[400px] mb-16 h-28 '>
        <img src={bot1} alt="" />
      </div>

      <div>
        <h1 className="text-3xl sm:text-5xl font-semibold  md:leading-tight text-gray-900 font-Manrope">
          Find your {' '}
          <span className="text-[#2c6472] leading-[4rem]">Perfect Job<br /></span>{' '}
          with AI
        </h1>

        <p className="mt-6 text-gray-500 font-medium text-base  max-w-2xl mx-auto">
          JSE AI supercharges your job hunt with precision matches, seamlessly connecting you to opportunities tailored to your skills and aspirations.
        </p>
      </div>

      <div className="mt-8">
        <Link to='/user/signup' ><button className="bg-white border border-gray-300 text-black font-medium px-6 py-2 rounded-full hover:bg-[#2c6472] hover:text-white transition duration-100 ease-linear">
          Start Free Trial
        </button></Link>
      </div>
    </header>
  );
};

export default Header;
