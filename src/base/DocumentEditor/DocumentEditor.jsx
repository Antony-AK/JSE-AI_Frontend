import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import download_icon from '../../assets/download.svg'
import right_arrow from '../../assets/left-arrow.png'
import edit_icon from '../../assets/edit-icon.svg'
import { useExternalCv } from './Context/ExternalCvContext';
import { useExternalCl } from './Context/ExternalClContext';
import ExternalClTemp from './CL/ExternalClTemp';
import ExternalModernDeedy from './CV/ExternalModernDeedy';

const DocumentEditor = () => {

    const navigate = useNavigate();

    const clPreviewRef = useRef(null);
    const cvPreviewRef = useRef(null);

    const {
        personalInfo: cvPersonalInfo,
        professionalSummary,
        workExperience,
        education,
        projects,
        certificates,
        skills,
        languages
    } = useExternalCv();

    const {
        personalInfo: clPersonalInfo,
        setPersonalInfo: setClPersonalInfo,
        paragraphs,
        setParagraphs
    } = useExternalCl();

    const handleClDownload = () => {
        const element = clPreviewRef.current;
        if (!element) return;

        const opt = {
            margin:       0,
            filename:     'Cover_Letter.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    const handleCvDownload = () => {
        const element = cvPreviewRef.current;
        if (!element) return;

        const opt = {
            margin:       0,
            filename:     'ModernDeddy_CV.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

  return (
    <div className='flex flex-col gap-5 p-5 mb-14'>

        <div className="flex items-center w-full px-10 mb-5">
            {/* Empty left space */}
            <div className="flex-1 flex items-center cursor-pointer" onClick={() => navigate(-1)}>
                <img src={right_arrow} className='w-2 h-3.5 object-cover' alt="" />
                <p className='ml-2 text-base font-medium'>Back</p>
            </div>        
            <div className="flex-1 text-center">
                <h2 className="text-xl font-semibold">CV & CL</h2>
            </div>       
            <div className="flex-1" />
        </div>

        <div className="grid gap-5 grid-cols-2">
            
            <div className="flex flex-col gap-5 justify-center mx-auto">

                <div className="flex justify-between px-5  max-w-[710px]">
                    <div onClick={() => navigate('/user/external-cv')} className="flex-1 -mt-2 flex gap-2 items-center cursor-pointer">
                        <img width="12px" src={edit_icon} alt="" />
                        <p className='text-[#2c6472] text-lg  font-medium'>Edit</p>
                    </div>
                    <h2 className='flex-1 text-xl ms-32 font-semibold'>CV</h2>
                    <div className="mb-5">
                        <button onClick={handleCvDownload} className="flex-1 flex items-center gap-4 bg-[#2c6472] px-8 py-1.5 rounded-lg">
                            <img width="12px" src={download_icon} alt=" " />
                            <p className="text-white text-sm">Download</p>
                        </button>
                    </div>
                </div>

                <div ref={cvPreviewRef} className="h-full w-[710px] flex bg-white mx-auto overflow-hidden overflow-y-auto scrollbar-custom">

                    <ExternalModernDeedy
                        personalInfo={cvPersonalInfo}
                        professionalSummary={professionalSummary}
                        workExperience={workExperience}
                        education={education}
                        projects={projects}
                        skills={skills}
                        languages={languages}
                        certificates={certificates}
                    />

                </div>
                
            </div>           
            

            <div className="flex flex-col gap-5 justify-center mx-auto">

                <div className="flex justify-between px-5 max-w-[710px]">
                    <div onClick={() => navigate('/user/external-cl')} className="flex-1 flex -mt-2 gap-2 items-center cursor-pointer">
                        <img width="12px" src={edit_icon} alt="" />
                        <p className='text-[#2c6472] text-lg font-medium'>Edit</p>
                    </div>
                    <h2 className='flex-1 text-xl ms-32 font-semibold'>CL</h2>
                    <div className="mb-5">
                        <button onClick={handleClDownload} className="flex-1 flex items-center gap-4 bg-[#2c6472] px-8 py-1.5 rounded-lg">
                            <img width="12px" src={download_icon} alt=" " />
                            <p className="text-white text-sm">Download</p>
                        </button>
                    </div>
                </div>

                <div ref={clPreviewRef} className="h-full w-[710px] bg-white mx-auto overflow-hidden overflow-y-auto scrollbar-custom">

                    <ExternalClTemp
                        data={{
                            name: clPersonalInfo.name,
                            title: clPersonalInfo.title,
                            mail: clPersonalInfo.mail,
                            contact: clPersonalInfo.contact,
                            address: clPersonalInfo.address,
                            paragraphs,
                        }}
                    />

                </div>
                    
            </div>

        </div>

        <div className="flex justify-between mt-5 px-10">

            <div className="">
                <div className="flex gap-3 items-center">
                    <input className='accent-[#2c6472] w-4 h-4 -mt-4' id='checkDownload' type="checkbox" />
                    <label htmlFor="checkDownload" className='text-sm mb-3' >Your CV and Cover Letter have been successfully downloaded.</label>
                </div>
                <p className='text-[#2c6472] text-sm font-semibold max-w-[600px]'>To locate them, check your device's Downloads folder — the files are saved with the company name and designation for easy access.</p>
            </div>

            <div className="">
                <button className="bg-[#2c6472] text-white px-8 py-1.5 rounded-2xl">
                    Finish Editing
                </button>
            </div>

        </div>

    </div>
  )
}

export default DocumentEditor