import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import logo from "../../assets/jsenewlogo.png";

const Footer = () => {
  return (
    <footer className="bg-[#245e69] text-white py-16 px-6">
      <div className="mx-auto px-6 md:px-20 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
        {/* Left section */}
        <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <img src={logo} alt="JSE AI Logo" className="h-10" />
          </div>
          <p className="font-medium mt-5">
            Relax. JSE AI takes care of the hustle.
          </p>
        </div>

        {/* Right section */}
        <div className="flex flex-col gap-5 items-center md:items-end text-center md:text-right">
          <h4 className="font-semibold mb-1">Contact</h4>
          <div className="flex items-center gap-2 text-sm">
            <div className="rounded-full bg-white p-2">
              <FaEnvelope className="text-[#2c6472] w-3 h-3" />
            </div>
            <span>info@arshan.de</span>
          </div>
        </div>
      </div>

      <hr className="w-[90%] mx-auto my-8 border-gray-400 px-20" />

      <div className="mx-auto flex flex-col px-20 md:flex-row justify-between items-center text-sm font-medium">
        <p className="text-center text-xs sm:text-sm">
          © 2025 JSE AI powered by Arshan. All Rights Reserved
        </p>
        <div className="flex gap-7 mt-3 md:mt-0">
          <div className="rounded-full bg-white p-2">
            <FaInstagram className="text-[#2c6472] w-4 h-4" />
          </div>
          <div className="rounded-full bg-white p-2">
            <FaLinkedinIn className="text-[#2c6472] w-4 h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
