import React, { useEffect, useState } from "react";
import { useExternalCl } from "../Context/ExternalClContext";

const ExternalCoverLetterPlush = () => {
  const { personalInfo, recipient, subject, paragraphs } = useExternalCl();

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = today.toLocaleDateString("en-GB", options); // example: 3 July 2025
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div className="w-[794px] h-[1123px] mx-auto p-12 bg-white text-black font-[Times New Roman] text-[15px] leading-relaxed flex flex-col justify-between">
      {/* Header */}
      <div className=" flex justify-center gap-5 w-[90%] mx-auto ">
        <div className="w-[60%]">
          {personalInfo?.name?.split(" ").length > 1 ? (
            <h1 className="text-[20px] font-medium flex flex-col items-end justify-end ">
              <span>{personalInfo?.name?.split(" ")[0]}</span>
              <span>{personalInfo?.name?.split(" ")[1]}</span>
            </h1>
          ) : (
            <h1 className="text-[20px] font-medium flex justify-end">
              {personalInfo?.name}
            </h1>
          )}
          <p className="text-[16px] flex justify-end ">{personalInfo?.title}</p>
        </div>

        <hr className="w-[2px] h-28 bg-black" />
        <div className="mt-2 text-[13px] space-y-1">
          <p>(+49) {personalInfo?.contact}</p>
          <p>{personalInfo?.mail}</p>
          {personalInfo?.website && (
            <p className="text-blue-700 underline">{personalInfo.website}</p>
          )}
          <p>{personalInfo?.address}</p>
        </div>
      </div>

      {/* Recipient and Subject */}
      <div className="text-left  flex flex-col -mt-20 text-[15px]">
        <div className=" border-y mb-6 items-center border-gray-400">
          <p className="my-2">
            <strong className="me-3 font-medium">To :</strong>Recruiter
          </p>
        </div>

        <p className="mb-6">
          <strong className="font-medium me-3">Date :</strong>{" "}
          {recipient?.date || currentDate}
        </p>
        <p className="">
          <strong className="font-medium me-3">Subject :</strong>Applying
          postion as {personalInfo?.title}
        </p>
      </div>

      {/* Body */}
      <div className="space-y-4 -mt-20 text-justify">
        <p>Dear {recipient?.name || "Recruiter"},</p>
        {paragraphs?.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* Closing */}
      <div className="mb-5">
        <p>Kind regards,</p>
        <p className="pt-1 font-semibold">{personalInfo?.name}</p>
      </div>
    </div>
  );
};

export default ExternalCoverLetterPlush;
