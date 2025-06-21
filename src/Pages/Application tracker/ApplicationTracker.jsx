import React from 'react'
import ApplicationCard from './ApplicationCard';

// data.js
export const applications = [
  {
    id: 1,
    title: "UI/UX Designer",
    company: "UST Global",
    location: "Trivandrum, Kerala, India",
    description:
      "We are seeking a talented UI/UX Designer to create engaging and user-friendly digital experiences...",
    yourSkills: "Figma, Photoshop, Web flow, framer",
    requiredSkills: "Figma, Adobe XD, Sketch, Wix Studio, illustrator",
    profileMatch: 92,
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "UST Global",
    location: "Trivandrum, Kerala, India",
    description:
      "We are seeking a talented UI/UX Designer to create engaging and user-friendly digital experiences...",
    yourSkills: "Figma, Photoshop, Web flow, framer",
    requiredSkills: "Figma, Adobe XD, Sketch, Wix Studio, illustrator",
    profileMatch: 92,
  },
];


const ApplicationTracker = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
            {applications.map((app, idx) => (
                <ApplicationCard key={app.id} app={app} isHighlighted={idx === 0} />
            ))}
        </div>
    )
}

export default ApplicationTracker
