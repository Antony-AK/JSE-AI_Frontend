import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ClaimSpot = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profession: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 min-h-[100vh]">
      <section
        id="contactus"
        className="bg-[#245e69] rounded-xl  p-6 md:p-10 mt-36 text-white max-w-[1100px] mx-auto my-20 flex flex-col md:flex-row items-stretch gap-8"
      >
        {/* Left Side */}
        <div className="basis-[55%] flex flex-col justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Limited Availability.
              <br />
              Unlimited Potential.
            </h2>
            <p className="mt-5 text-base md:text-lg font-medium">
              Sign up today and benefit from our early adopter promotion
            </p>
          </div>

          <div className="space-y-4 text-sm mt-auto flex flex-col gap-4">
            {/* <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full">
              <FaPhoneAlt className="text-[#2c6472] text-sm" />
            </div>
            <span>+49 178 9815465</span>
          </div> */}
            <div className="flex items-center gap-3 mt-10">
              <div className="bg-white p-1.5 rounded-full">
                <FaEnvelope className="text-[#2c6472]" />
              </div>
              <span>info@arshan.digital</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-full">
                <FaMapMarkerAlt className="text-[#2c6472]" />
              </div>
              <span>Kolonnenstr. 8, 10827 Berlin, Germany</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 shadow-md text-black flex flex-col basis-[50%] justify-between"
        >
          <div className="flex-grow">
            <div className="mb-4 flex flex-col gap-2">
              <label className="block text-xs sm:text-sm font-semibold mb-1">
                Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                className="w-full border text-xs sm:text-sm border-gray-300 rounded-full px-5 py-3 outline-none"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <label className="block text-xs sm:text-sm font-semibold mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full border text-xs sm:text-sm border-gray-300 rounded-full px-5 py-3 outline-none"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <label className="block text-xs sm:text-sm font-semibold mb-1">
                Expected Profession
              </label>
              <input
                name="profession"
                type="text"
                placeholder="eg. ui/ux designer"
                className="w-full border text-xs sm:text-sm border-gray-300 rounded-full px-5 py-3 outline-none"
                value={formData.profession}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 text-xs sm:text-sm md:text-base bg-[#245e69] text-white py-4 rounded-full font-semibold hover:bg-[#1e4f59]"
          >
            Claim My Spot
          </button>
        </form>
      </section>
    </div>
  );
};

export default ClaimSpot;
