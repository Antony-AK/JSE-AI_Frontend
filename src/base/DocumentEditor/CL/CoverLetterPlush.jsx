import React, { useEffect, useState } from 'react';
import { useCl } from '../Context/ClContext'; // Adjust the path if needed

const t = (key, lang = "en") => {
    const map = {
        date: { en: "Date", de: "Datum" },
        subject: { en: "Subject", de: "Betreff" },
        dear: { en: "Dear", de: "Sehr geehrter" },
        recruiter: { en: "Recruiter", de: "Personalverantwortlicher" },
        regards: { en: "Kind regards", de: "Mit freundlichen Grüßen" },
        applying: { en: "Applying position as", de: "Bewerbung für die Stelle als" },
    };

    const langMap = {
        english: "en",
        german: "de",
        en: "en",
        de: "de",
    };

    const langCode = langMap[lang?.toLowerCase()] || "en";
    return map[key]?.[langCode] || key;
};


const CoverLetterPlush = ({ personalInfo, recipient, paragraphs, language }) => {


    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-GB', options); // example: 3 July 2025
        setCurrentDate(formattedDate);
    }, []);

    return (
        <div className="w-[794px] h-[1123px] mx-auto p-12 bg-white text-black font-[Times New Roman] text-[15px] leading-relaxed flex flex-col gap-8 ">
            {/* Header */}
            <div className=" flex items-center gap-5 min-w-[60%] mx-auto ">
                <div className='w-[60%]'>
                    {personalInfo?.name?.split(' ').length > 1 ? (
                        <h1 className="text-[20px] font-medium flex flex-col items-end justify-end ">
                            <span>{personalInfo?.name?.split(' ')[0]}</span>
                            <span>{personalInfo?.name?.split(' ')[1]}</span>
                        </h1>
                    ) : (
                        <h1 className="text-[20px] font-medium flex justify-end">{personalInfo?.name}</h1>
                    )}
                    <p className="text-[16px] flex justify-end ">{personalInfo?.title}</p>
                </div>

                <hr className='w-[2px] h-28 bg-black' />
                <div className="mt-2 text-[13px] space-y-1">
                    <p>(+49) {personalInfo?.contact}</p>
                    <p>{personalInfo?.mail}</p>
                    {personalInfo?.website && <p className="text-blue-700 underline">{personalInfo.website}</p>}
                    <p>{personalInfo?.address}</p>
                </div>
            </div>

            {/* Recipient and Subject */}
            <div className="text-left  flex flex-col   text-[15px] border-t border-gray-300 ">


                <p className="mb-3 mt-5">
                    <strong className='font-medium me-3'>{t("date", language)}:</strong> {recipient?.date || currentDate}
                </p>

            </div>

            {/* Body */}
            <div className="space-y-4  text-justify">
                <p className='-mt-5'>{t("dear", language)} {recipient?.name?.split(" ")[0] || t("recruiter", language)},</p>
                {paragraphs?.map((para, idx) => (
                    <p key={idx}>{para}</p>
                ))}
            </div>

            {/* Closing */}
            <div className="mb-5 mt-16">
                <p>{t("regards", language)}</p>
                <p className="pt-1 font-semibold">{personalInfo?.name}</p>
            </div>
        </div>
    );
};

export default CoverLetterPlush;
