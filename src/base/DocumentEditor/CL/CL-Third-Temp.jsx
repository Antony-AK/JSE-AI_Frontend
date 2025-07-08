import React, { useEffect, useState } from 'react';
import { useCl } from '../Context/ClContext';

const t = (key, lang = "en") => {
  const map = {
    date: { en: "Date", de: "Datum" },
    subject: { en: "Subject", de: "Betreff" },
    dear: { en: "Dear", de: "Sehr geehrter" },
    recruiter: { en: "Recruiter", de: "Personalverantwortlicher" },
    regards: { en: "Kind regards", de: "Mit freundlichen Grüßen" },
    applying: { en: "Applying position as", de: "Bewerbung für die Stelle als" }, // 🌟 new

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


const CoverLetterModern = ({ language }) => {
  const { personalInfo, recipient, subject, paragraphs } = useCl();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formatted = today.toLocaleDateString('en-GB', options);
    setCurrentDate(formatted);
  }, []);

  return (
    <div
      className="mx-auto bg-white text-black font-[calibri] text-[15px] leading-[1.6]"
      style={{ width: '794px', height: '1123px', padding: '50px' }}
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-[18px] font-bold uppercase">{personalInfo?.name}</h1>
        <p>{personalInfo?.title}</p>
        <p className="mt-1">{personalInfo?.address}</p>
        <div className='flex gap-3'>
          <p className="text-blue-600 pb-1 underline">{personalInfo?.mail}</p><hr className='w-[0.5px] h-6 bg-black' />
          <p>(+49) {personalInfo?.contact}</p>
        </div>
        {personalInfo?.website && (
          <p className="text-blue-600 underline">{personalInfo.website}</p>
        )}
      </div>

      <hr className="border-gray-400 mb-4" />



      {/* Date + Subject */}
      <div className="mb-3">
        <p><strong className='font-medium me-2'>{t("date", language)}:</strong> {recipient?.date || currentDate}</p>
       
      </div>

      {/* Body */}
      <div className="mt-5">
        <p className='my-5'>
          {t("dear", language)} {recipient?.name?.split(' ')[0] || t("recruiter", language)},
        </p>        <div className="text-justify space-y-4">
          {paragraphs?.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>


      {/* Footer */}
      <div className="mt-16 space-y-5">
        <p>{t("regards", language)},</p>
        {/* Signature (Optional Image) */}
        <p className="font-semibold">{personalInfo?.name}</p>
      </div>
    </div>
  );
};

export default CoverLetterModern;
