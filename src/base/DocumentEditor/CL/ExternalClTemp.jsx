import React, { useRef } from 'react';
import { useExternalCl } from '../Context/ExternalClContext';
import download_icon from '../../../assets/download.svg';

const ExternalClTemp = () => {

  const previewRef = useRef();
  const { personalInfo, paragraphs } = useExternalCl();



  return (

    <div className="w-full relative flex flex-col items-center justify-center bg-[#f5f5f5] pb-10">

      <div
        suppressHydrationWarning
        id="cl-pdf-preview"
        ref={previewRef}
        className="bg-white text-black px-10 py-8 shadow-md"
        style={{
          boxSizing: 'border-box',
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: '16px',
          lineHeight: '1.65',
          wordWrap: 'break-word',
          whiteSpace: 'normal',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div className="flex justify-between border-b border-t border-black py-6 mb-10">
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{personalInfo.name}</h1>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{personalInfo.title}</h2>
          </div>
          <div style={{ textAlign: 'right', fontSize: '14px', lineHeight: '1.5' }}>
            <p>{personalInfo.mail}</p>
            <p>{personalInfo.contact}</p>
            <p>{personalInfo.address}</p>
          </div>
        </div>

        {/* Body */}
        <div style={{ fontSize: '16px', lineHeight: '1.75', textAlign: 'justify' }}>
          <p style={{ marginBottom: '20px' }}>HR,</p>
          {paragraphs.map((para, idx) => (
            <p key={idx} style={{ marginBottom: '20px' }}>{para}</p>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '50px' }} className="border-b border-black pb-6">
          <p>Yours sincerely,</p>
          <p style={{ fontWeight: '600', marginTop: '15px' }}>{personalInfo.name}</p>
        </div>
      </div>
    </div>

    
  )
}

export default ExternalClTemp