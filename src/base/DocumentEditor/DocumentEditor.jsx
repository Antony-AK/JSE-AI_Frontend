import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import download_icon from '../../assets/download.svg'
import right_arrow from '../../assets/left-arrow.png'
import edit_icon from '../../assets/edit-icon.svg'
import { useExternalCv } from './Context/ExternalCvContext';
import { useExternalCl } from './Context/ExternalClContext';
import ExternalClTemp from './CL/ExternalClTemp';
import ExternalModernDeedy from './CV/ExternalModernDeedy';
import ExternalEuropass from './CV/ExternalEuropassCV';
import ExternalModernClassic from './CV/ExternalModernClassic'
import ExternalPlushCV from './CV/ExternalPlushCV'

const DocumentEditor = () => {

    const navigate = useNavigate();

    const [isChecked, setIsChecked] = useState(false);

    const handleDone = () => {
        if (!isChecked) {
            toast.error("Please confirm the download.");
            return;
        }

        navigate('/user/my-jobs/external');

        // Ensure scroll to top after navigation
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }, 100);
    };

    const clPreviewRef = useRef(null);
    const cvPreviewRef = useRef(null);
    const [language, setLanguage] = useState(() => sessionStorage.getItem("selectedLanguage") || "en");




    const {
        personalInfo: cvPersonalInfo,
        professionalSummary,
        workExperience,
        education,
        projects,
        certificates,
        skills,
        languages,
        isLoading: isCvLoading

    } = useExternalCv();

    const {
        personalInfo: clPersonalInfo,
        setPersonalInfo: setClPersonalInfo,
        paragraphs,
        setParagraphs,
        isLoading: isClLoading

    } = useExternalCl();



    const handleClDownload = () => {
        const element = clPreviewRef.current;
        if (!element) return;

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

        html2pdf().set(opt).from(element).save();
    };

    const handleCvDownload = () => {
        const element = cvPreviewRef.current;
        if (!element) return;

        const opt = {
            margin: 0,
            filename: 'CV.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };


    if (isCvLoading || isClLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-semibold text-gray-700 animate-pulse">
                    🛠️ Processing your CV and CL...
                </p>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-5 p-5 mb-5 '>

            <div className="flex items-center w-full px-10 mb-5">
                {/* Empty left space */}
                <div className="flex-1 flex items-center cursor-pointer">
                    {/* <img src={right_arrow} className='w-2 h-3.5 object-cover' alt="" />
                    <p className='ml-2 text-base font-medium'>Back</p> */}
                </div>
                <div className="flex-1 text-center">
                    <h2 className="text-xl font-semibold uppercase">Curriculum Vitae & Cover Letter</h2>
                </div>
                <div className="flex-1" />
            </div>

            <div className="grid grid-cols-2 mx-auto w-full ">
                <div className="flex flex-col gap-5 justify-center mx-auto ms-5">

                    <div className="flex justify-between px-5  max-w-[690px]">
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

                    <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
                        <div ref={cvPreviewRef} className="h-full w-[794px] py-5 flex bg-white mx-auto overflow-hidden scrollbar-custom">

                            <ExternalModernDeedy
                                personalInfo={cvPersonalInfo}
                                professionalSummary={professionalSummary}
                                workExperience={workExperience}
                                education={education}
                                projects={projects}
                                skills={skills}
                                languages={languages}
                                certificates={certificates}
                                language={language}
                            />

                            {/* <ExternalEuropass 
                            personalInfo={cvPersonalInfo}
                            professionalSummary={professionalSummary}
                            workExperience={workExperience}
                            education={education}
                            projects={projects}
                            skills={skills}
                            languages={languages}
                            certificates={certificates}
                        /> */}

                            {/* <ExternalModernClassic 
                            personalInfo={cvPersonalInfo}
                            professionalSummary={professionalSummary}
                            workExperience={workExperience}
                            education={education}
                            projects={projects}
                            skills={skills}
                            languages={languages}
                            certificates={certificates}
                        /> */}

                            {/* <ExternalPlushCV 
                            personalInfo={cvPersonalInfo}
                            professionalSummary={professionalSummary}
                            workExperience={workExperience}
                            education={education}
                            projects={projects}
                            skills={skills}
                            languages={languages}
                            certificates={certificates}
                        /> */}

                            {/* <ThirdCV 
                            personalInfo={personalInfo}
                            professionalSummary={professionalSummary}
                            workExperience={workExperience}
                            education={education}
                            projects={projects}
                            skills={skills}
                            languages={languages}
                            certificates={certificates}
                        /> */}

                        </div>
                    </div>

                </div>


                <div className="flex flex-col gap-5 justify-start mx-auto">

                    <div className="flex justify-between px-5 max-w-[680px]">
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


                    <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
                        <div ref={clPreviewRef} className="h-[1123px] w-[794px] bg-white mx-auto  scrollbar-custom">

                            <ExternalClTemp
                                personalInfo={{
                                    name: clPersonalInfo.name,
                                    title: clPersonalInfo.title,
                                    mail: clPersonalInfo.mail,
                                    contact: clPersonalInfo.contact,
                                    address: clPersonalInfo.address,
                                }}
                                paragraphs={paragraphs}
                                language={language}
                            />

                        </div>
                    </div>

                </div>

            </div>

            <div className="flex justify-between  px-10">

                <div className="">
                    <div className="flex gap-3 items-center">
                        <input
                            className='accent-[#2c6472] w-4 h-4 -mt-4'
                            id='checkDownload'
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                        />
                        <label htmlFor="checkDownload" className='text-sm mb-3' >Your CV and Cover Letter have been successfully downloaded.</label>
                    </div>
                    <p className='text-[#2c6472] text-sm font-semibold max-w-[600px]'>To locate them, check your device's Downloads folder — the files are saved with the company name and designation for easy access.</p>
                </div>

                <div className="">
                    <button
                        className={`px-8 py-1.5 rounded-2xl transition-all duration-200 ${isChecked ? 'bg-[#2c6472] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        onClick={handleDone}
                        disabled={!isChecked}
                    >
                        Done
                    </button>

                </div>

            </div>

        </div>
    )
}

export default DocumentEditor