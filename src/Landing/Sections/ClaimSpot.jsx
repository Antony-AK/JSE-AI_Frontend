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
    <section className="bg-[#245e69] rounded-xl p-6 md:p-10 text-white max-w-[1100px] mx-auto my-20 flex flex-col md:flex-row items-stretch gap-8">
      {/* Left Side */}
      <div className="basis-[55%] flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Limited Availability.
            <br />
            Unlimited Potential.
          </h2>
          <p className="mt-5 text-lg font-medium">
            Tell us your dream role and let our AI match you with ideal
            opportunities.
          </p>
        </div>

        <div className="space-y-4 text-sm mt-auto flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full">
              <FaPhoneAlt className="text-[#2c6472] text-sm" />
            </div>
            <span>+49 178 9815465</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full">
              <FaEnvelope className="text-[#2c6472]" />
            </div>
            <span>info@arshan.de</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full">
              <FaMapMarkerAlt className="text-[#2c6472]" />
            </div>
            <span>Linkstraße 2 Level 8, 10785 Berlin</span>
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
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              className="w-full border text-sm border-gray-300 rounded-full px-5 py-3 outline-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4 flex flex-col gap-2">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full border text-sm border-gray-300 rounded-full px-5 py-3 outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6 flex flex-col gap-2">
            <label className="block text-sm font-semibold mb-1">
              Expected Profession
            </label>
            <input
              name="profession"
              type="text"
              placeholder="eg. ui/ux designer"
              className="w-full border text-sm border-gray-300 rounded-full px-5 py-3 outline-none"
              value={formData.profession}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 text-xs bg-[#245e69] text-white py-4 rounded-full font-semibold hover:bg-[#1e4f59]"
        >
          Claim My Spot
        </button>
      </form>
    </section>
  );
};

export default ClaimSpot;