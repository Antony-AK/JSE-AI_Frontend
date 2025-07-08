import React from "react";
import announcements from "../../assets/announcements-icon.svg";

const Announcements = () => {
  return (
    <div className="m-10">
      <div className="border rounded-xl p-5 bg-white space-y-3">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <h2 className="font-bold text-[15px]">Announcements</h2>
            <img src={announcements} alt="" />
          </div>
        </div>

        <p className="text-sm font-medium text-[#000000A1]">
          <span className="text-[#2c6472] font-semibold mr-2">
            {new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          – The new version of{" "}
          <span className="text-[#2c6472] font-semibold">JSE AI</span> brings
          major improvements across the platform. With advanced AI matching,
          optimized performance, and a refreshed UI, the app is now smarter and
          faster than ever before. These upgrades aim to make your job search
          smoother and more effective.
        </p>
        
      </div>
    </div>
  );
};

export default Announcements;
