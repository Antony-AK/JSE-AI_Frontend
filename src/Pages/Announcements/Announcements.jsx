import React from "react";
import { t } from "../../utils/i18n";
import announcements from "../../assets/announcements-icon.svg";

const Announcements = () => {
  return (
    <div className="m-10">
      <div className="border rounded-xl p-5 bg-white space-y-3">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <h2 className="font-bold text-[15px] mb-3">{t("announcements.title")}</h2>
            <img src={announcements} alt="" />
          </div>
        </div>


<div className="flex flex-col space-y-6">
        <p className="text-[#000000A1] font-medium text-sm ">
          <span className="text-[#2c6472] text-sm md:text-base font-semibold mr-2">
            {t("announcements.announcement1.date")}
          </span>
          {t("announcements.announcement1.line1")}{" "}
          <span className="text-[#2c6472] font-semibold">{t("announcements.announcement1.highlight1")}</span>{" "}
          {t("announcements.announcement1.line2")}{" "}<span className="font-semibold text-[#2c6472]">{t("announcements.announcement1.highlight2")}</span> {t("announcements.announcement1.line3")}
        </p>
        <p className="text-[#000000A1] font-medium text-sm">
          <span className="text-[#2c6472] text-sm md:text-base font-semibold mr-2">
            {t("announcements.announcement2.date")}
          </span>
          {t("announcements.announcement2.line1")}{" "}
          <span className="text-[#2c6472] font-semibold">{t("announcements.announcement2.highlight1")}</span>{" "}
          {t("announcements.announcement2.line2")}
        </p>
        </div>


      </div>
    </div>
  );
};

export default Announcements;
