import React from 'react'
import download_icon from '../../../assets/download.svg'
import edit_icon from '../../../assets/edit-icon.svg'
import { Download } from 'lucide-react';


const Cl = () => {

  const coverLetterData = {
    personalInfo: {
      title: 'Personal Information',
      content: {
        Name: 'Steve',
        'Date of Birth': '05 May 1998',
        Email: 'steve@email.com',
        LinkedIn: 'linkedin.com/in/steve-uiux',
      },
    },
    recipientDetails: {
      title: 'Details of the person/organisation to whom this document is addressed:',
      content: {
        To: 'The Hiring Manager',
        '[Company Name]': '',
        '[Company Address]': '',
      },
    },
    cityDateSubject: {
      title: 'City, Date and Subject:',
      content: {
        City: 'Tuticorin',
        Date: 'June 16, 2025',
        Subject: 'Application for the Position of UI/UX Designer',
      },
    },
    content: {
      title: 'Content:',
      content: `Dear Hiring Manager,

I am writing to express my interest in the UI/UX Designer position at your esteemed organization. As a third-year B.Tech student in Artificial Intelligence and Data Science from Francis Xavier Engineering College, I bring a strong passion for user-centered design and a solid foundation in modern design tools like Figma.

Over the past few months, I have worked on real-world projects such as Doclify (an online doctor consultation app) and Venura (a studio booking app), which strengthened my practical knowledge of UI/UX design, responsiveness, and usability. I am confident in my ability to craft intuitive and visually engaging user interfaces that align with your business goals.`,
    },
    closing: {
      title: 'Closing:',
      content: {
        Sincerely: '',
        Name: 'K. Ajay Shanmugam',
      },
    },
  };

  return (

    <>

      <div className="flex items-center w-full px-4 mt-5">
        
        {/* Empty left space */}
        <div className="flex-1" />
      
        <div className="flex-1 text-center">
          <h2 className="text-xl font-semibold">CL</h2>
        </div>
      
        <div className="flex-1 flex justify-end">
          <button className="flex items-center gap-4 bg-[#2c6472] px-8 py-1.5 rounded-lg">
              <img width="12px" src={download_icon} alt=" " />
              <p className="text-white text-sm">Download</p>
          </button>
        </div>

      </div>

      <div className="flex w-full gap-5 p-5">

        {/* Sections */}
        <div className="w-1/2 space-y-4">

        {/* Personal Info */}
          <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 border-2 border-[#2c6472]">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-gray-800">{coverLetterData.personalInfo.title}</h2>
              <img width="12px" src={edit_icon} alt="Edit" />
            </div>
            <div className="pl-1 space-y-1.5">
              {Object.entries(coverLetterData.personalInfo.content).map(([key, value], index) => (
                <p key={index} className="text-[#00000082] font-medium">
                  {key}: {value}
                </p>
              ))}
            </div>
          </div>

          {/* Recipient Details */}
          <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 border">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-gray-800">{coverLetterData.recipientDetails.title}</h2>
              <img width="12px" src={edit_icon} alt="Edit" />
            </div>
            <div className="pl-1 space-y-1.5">
              {Object.entries(coverLetterData.recipientDetails.content).map(([key, value], index) => (
                <p key={index} className="text-[#00000082] font-medium">
                  {key}: {value}
                </p>
              ))}
            </div>
          </div>

          {/* City, Date and Subject */}
          <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 border">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-gray-800">{coverLetterData.cityDateSubject.title}</h2>
              <img width="12px" src={edit_icon} alt="Edit" />
            </div>
            <div className="pl-1 space-y-1.5">
              {Object.entries(coverLetterData.cityDateSubject.content).map(([key, value], index) => (
                <p key={index} className="text-[#00000082] font-medium">
                  {key}: {value}
                </p>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 border">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-gray-800">{coverLetterData.content.title}</h2>
              <img width="12px" src={edit_icon} alt="Edit" />
            </div>
            <p className="text-[#00000082] font-medium whitespace-pre-line pl-1">
              {coverLetterData.content.content}
            </p>
          </div>

          {/* Closing */}
          <div className="border rounded-md px-4 mb-4 py-3 bg-white text-sm text-gray-700 border">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-gray-800">{coverLetterData.closing.title}</h2>
              <img width="12px" src={edit_icon} alt="Edit" />
            </div>
            <div className="pl-1 space-y-1.5">
              {Object.entries(coverLetterData.closing.content).map(([key, value], index) => (
                <p key={index} className="text-[#00000082] font-medium">
                  {key}: {value}
                </p>
              ))}
            </div>
          </div>
          
        </div>
        


        {/* Right Blank Space (Preview Area) */}
        <div className="w-[50%] flex flex-col gap-5">

          <div className="h-[842px] flex bg-white">

          </div>

          <div className="flex justify-end">
              <button className="bg-[#2c6472] text-white px-8 py-1.5 rounded-2xl">
                  Done
              </button>
          </div>

        </div>

      </div>        

    </>
  );
};


export default Cl
