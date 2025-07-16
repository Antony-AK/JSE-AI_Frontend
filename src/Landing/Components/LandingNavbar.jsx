import React from 'react';
import logo from '../../assets/jsenewlogoblack.png';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  return (
    <nav className="w-full bg-white px-10 py-6 flex items-center justify-between z-50">
      {/* Left Logo */}
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Robot Logo" className="w-24 h-9 object-cover" />
      </div>

      {/* Center Links */}
      <ul className="hidden md:flex space-x-8 ms-28 text-gray-800 font-Manrope font-medium">
        {['Home', 'Features', 'Pricing', 'FAQs', 'Contact us'].map((item, idx) => {
          const href = `#${item.toLowerCase().replace(/\s/g, '')}`;
          return (
            <li key={idx}>
              <a
                href={href}
                className="group relative font-medium transition-colors duration-300"
              >
                <span className="font-semibold group-hover:text-[#2c6472]">
                  {item}
                </span>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#2c6472] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          );
        })}
      </ul>


      {/* Right Login Button */}
      <div className='flex gap-3'>
        <Link to='/user/signup'><button className="bg-[#2c6472] text-white px-6 py-2 rounded-full font-medium hover:bg-[#25545f] transition duration-300">
          Sign Up
        </button></Link>
         <Link to='/user/login'><button className="bg-[#2c6472] text-white px-6 py-2 rounded-full font-medium hover:bg-[#25545f] transition duration-300">
          Login
        </button></Link>
         
      </div>
    </nav>
  );
};

export default LandingNavbar;
