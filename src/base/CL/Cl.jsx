import React from 'react'
import { Download } from 'lucide-react';


const Cl = () => {
const coverLetterData = [
    {
      title: 'Personal Information',
      content: {
        Name: 'Steve',
        'Date of Birth': '05 May 1998',
        Email: 'steve@email.com',
        LinkedIn: 'linkedin.com/in/steve-uiux'
      }
    },
    {
      title: 'Details of the person/organisation to whom this document is addressed:',
      content: {
        To: 'The Hiring Manager',
        '[Company Name]': '',
        '[Company Address]': ''
      }
    },
    {
      title: 'City, Date and Subject:',
      content: {
        City: 'Tuticorin',
        Date: 'June 16, 2025',
        Subject: 'Application for the Position of UI/UX Designer'
      }
    },
    {
      title: 'Content:',
      content: `Dear Hiring Manager,

I am writing to express my interest in the UI/UX Designer position at your esteemed organization. As a third-year B.Tech student in Artificial Intelligence and Data Science from Francis Xavier Engineering College, I bring a strong passion for user-centered design and a solid foundation in modern design tools like Figma.

Over the past few months, I have worked on real-world projects such as Doclify (an online doctor consultation app) and Venura (a studio booking app), which strengthened my practical knowledge of UI/UX design, responsiveness, and usability. I am confident in my ability to craft intuitive and visually engaging user interfaces that align with your business goals.`
    },
    {
      title: 'Closing:',
      content: {
        Sincerely: '',
        Name: 'K. Ajay Shanmugam'
      }
    }
  ];

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Left Side */}
      <div className="w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button className="text-sm font-semibold text-gray-600">&larr; Back</button>
          <h1 className="text-xl font-bold text-gray-900">Cover Letter</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2c6472] text-white rounded-md text-sm">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>

        {/* Sections */}
        <div className="w-1/2 space-y-4">
          {coverLetterData.map((section, index) => (
            <div key={index} className="border rounded-md px-4 py-3 bg-white text-sm text-gray-700 relative">
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-gray-800">{section.title}</h2>
                <button className="text-[#2c6472] text-sm font-medium">✎</button>
              </div>
              <div className="pl-1 text-sm space-y-1.5">
                {typeof section.content === 'string'
                  ? <p className="whitespace-pre-wrap">{section.content}</p>
                  : Object.entries(section.content).map(([key, value], i) => (
                      <p key={i}>{key}{value ? `: ${value}` : ''}</p>
                    ))}
              </div>
            </div>
          ))}

          {/* Done Button */}
          <div className="flex justify-end mt-6">
            <button className="px-6 py-2 rounded-md bg-[#2c6472] text-white text-sm">Done</button>
          </div>
        </div>
      </div>

      {/* Right Blank Space (Preview Area) */}
      <div className="w-1/2 mt-20 bg-white border-l"></div>
    </div>
  );
};


export default Cl
