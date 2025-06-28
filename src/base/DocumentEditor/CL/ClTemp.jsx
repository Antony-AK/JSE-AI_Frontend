import React, { useRef } from 'react';
import { useCl } from '../Context/ClContext';

const ClPreview = () => {
  const previewRef = useRef();
  const { personalInfo, paragraphs } = useCl();

  return (
    <div 
      ref={previewRef}
      id="cl-pdf-preview"
      className="bg-white text-black"
      style={{
        width: '794px',              // A4 width in px
        height: '1123px',            // A4 height in px
        padding: '60px 50px',        // Safe margins
        boxSizing: 'border-box',
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '16px',
        lineHeight: '1.6',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Header */}
      <div style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '20px 0', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', marginTop: "-10px"}}>{personalInfo.name}</h1>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{personalInfo.title}</h2>
        </div>
        <div style={{ textAlign: 'right', fontSize: '14px', lineHeight: '1.5' }}>
          <p>{personalInfo.mail}</p>
          <p>{personalInfo.contact}</p>
          <p>{personalInfo.address}</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ flexGrow: 1, marginTop: '30px' }}>
        <p style={{ marginBottom: '20px' }}>Dear Recruiter ,</p>
        {paragraphs.map((para, idx) => (
          <p key={idx} style={{ marginBottom: '18px', textAlign: 'justify' }}>{para}</p>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginBottom: '100px', borderBottom: '1px solid #000', paddingBottom: '30px' }}>
        <p>Yours sincerely,</p>
        <p style={{ fontWeight: '600', marginTop: '15px' }}>{personalInfo.name}</p>
      </div>
    </div>
  );
};

export default ClPreview;
