import React from "react";
import announcements from "../../assets/announcements-icon.svg";

const Announcements = () => {
  return (
    <div className="m-10">
      <div className="border rounded-xl p-5 bg-white space-y-3">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <h2 className="font-bold text-[15px] mb-3">Announcements</h2>
            <img src={announcements} alt="" />
          </div>
        </div>


<div className="flex flex-col space-y-6">
        <p className="text-[#000000A1] font-medium text-sm ">
          <span className="text-[#2c6472] text-sm md:text-base font-semibold mr-2">
            27 Jul 2025
          </span>
          - We're excited to share that{" "}
          <span className="text-[#2c6472] font-semibold">JSE AI</span>{" "}
          is now <span className="font-semibold text-[#2c6472]">95% optimized</span> for peak performance. Pages now load almost instantly,
          reducing waiting times to nearly zero. These enhancements ensure a seamless
          and ultra-fast experience, helping you focus more on your goals and less on
          the load.
        </p>
        <p className="text-[#000000A1] font-medium text-sm">
          <span className="text-[#2c6472] text-sm md:text-base font-semibold mr-2">
            17 Jul 2025
          </span>
          - The new version of{" "}
          <span className="text-[#2c6472] font-semibold">JSE AI</span>{" "}
          brings major improvements across the platform. With advanced AI
          matching, optimized performance, and a refreshed UI, the app is
          now smarter and faster than ever before. These upgrades aim to
          make your job search smoother and more effective.
        </p>
        </div>


      </div>
    </div>
  );
};

export default Announcements;
