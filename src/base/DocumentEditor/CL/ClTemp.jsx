import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { blue } from '@mui/material/colors';
import download_icon from '../../../assets/download.svg'


const ClPreview = ({ data }) => {
  const previewRef = useRef();

  const handleDownload = () => {
    if (!data.name || !data.title || data.paragraphs.length === 0) {
      alert("Please fill in all fields before downloading.");
      return;
    }

    const opt = {
      margin: 0,
      filename: 'cover_letter.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2.5,
        useCORS: true,
        scrollY: 0,
      },
      jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
    };

    html2pdf().set(opt).from(previewRef.current).save();
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-center bg-[#f5f5f5] pb-10">

      <div className="flex-1 flex justify-end">
        <button onClick={handleDownload} className="flex -mt-14 mb-5 gap-4 ms-[550px] bg-[#2c6472] px-8 py-2 rounded-md">
          <img width="12px" height="12px" src={download_icon} alt=" " />
          <p className="text-white text-sm">Download PDF</p>
        </button>
      </div>
      <div
        suppressHydrationWarning
        id="cl-pdf-preview"
        ref={previewRef}
        className="bg-white text-black px-10 py-8 shadow-md "
        style={{
          width: '794px',
          height: '1123px',
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
        <div
          className="flex justify-between border-b border-t border-black py-6 mb-10  "
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', marginTop: '-10px' }}>{data.name}</h1>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{data.title}</h2>
          </div>
          <div style={{ textAlign: 'right', fontSize: '14px', lineHeight: '1.5' }}>
            <p>{data.mail}</p>
            <p>{data.contact}</p>
            <p>{data.address}</p>
          </div>
        </div>

        {/* Body */}
        <div style={{ fontSize: '16px', lineHeight: '1.75', textAlign: 'justify' }}>
          <p style={{ marginBottom: '20px' }}>HR,</p>
          {data.paragraphs.map((para, idx) => (
            <p key={idx} style={{ marginBottom: '20px' }}>{para}</p>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '50px' }} className='border-b border-black pb-6'>
          <p>Yours sincerely,</p>
          <p style={{ fontWeight: '600', marginTop: '15px', borderBottom: '2px', }}>{data.name}</p>
        </div>
      </div>


    </div>
  );
};

export default ClPreview;
