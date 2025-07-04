import React, { useEffect, useState } from 'react';
import { useCl } from '../Context/ClContext';

const CoverLetterModern = () => {
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
        <p className="text-blue-600 pb-1 underline">{personalInfo?.mail}</p><hr className='w-[0.5px] h-6 bg-black'/>
        <p>(+49) {personalInfo?.contact}</p>
        </div>
        {personalInfo?.website && (
          <p className="text-blue-600 underline">{personalInfo.website}</p>
        )}
      </div>

      <hr className="border-gray-400 mb-4" />

      {/* Recipient */}
      <div className="mb-3">
        <p><strong className='font-medium me-2'>To :</strong> {recipient?.name || 'Recruiter'}</p>
      </div>

      {/* Date + Subject */}
      <div className="mb-3">
        <p><strong className='font-medium me-2'>Date:</strong> {recipient?.date || currentDate}</p>
        <p className="mt-3"><strong className='font-medium me-2'>Subject:</strong> {subject || `Applying position as ${personalInfo?.title}`}</p>
      </div>

      {/* Body */}
      <div className="space-y-5 text-justify">
        <p>Dear {recipient?.name?.split(' ')[0] || 'Recruiter'},</p>
        {paragraphs?.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 space-y-5">
        <p>Kind regards,</p>
        {/* Signature (Optional Image) */}
        <p className="font-semibold">{personalInfo?.name}</p>
      </div>
    </div>
  );
};

export default CoverLetterModern;
