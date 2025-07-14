import React from 'react';

const Header = () => {
  return (
    <header  className="relative  w-full h-[90vh] bg-white px-4 text-center flex justify-center items-center font-poppins">
      <div className="relative w-full h-[400px] mt-28 z-[9999] bg-white">
        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-gray-900">
          Find your Perfect{' '}
          <span className="text-[#2c6472] leading-[4rem]">Dream<br />Job</span>{' '}
          with AI
        </h1>

        <p className="mt-6 text-gray-500 font-medium text-base sm:text-lg max-w-xl mx-auto">
          JSE AI supercharges your job hunt with smart matches,
          <br />
          faster career growth.
        </p>

        <div className="mt-8">
          <button className="bg-white border border-gray-300 text-black font-medium px-6 py-2 rounded-full hover:bg-[#2c6472] hover:text-white transition duration-100 ease-linear">
            Start 7-day Free Trial
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
