import { createContext, useContext, useState } from 'react';

const ClContext = createContext();

export const ClProvider = ({ children }) => {

    const [personalInfo, setPersonalInfo] = useState({
        name: "Koushik Babu2025",
        title: "Software Engineer",
        mail: "Ramani.mallempuri@gmail.com",
        contact: "+49 17624931591",
        address: "34th cross street, Prenzlauer Allee 172, Berlin 10409",
    });
    
    const [paragraphs, setParagraphs] = useState([
        "I am writing to express my enthusiastic interest in the Software Engineer position at your esteemed organization. With a Master's degree in Computer Science Engineering, and over 5 years of hands-on experience in full-stack web development, I have honed my skills in building scalable, performant, and user-centric applications. My expertise spans across the MERN stack, RESTful API integration, cloud deployment (AWS & Azure), and agile development methodologies.",
    
        "Throughout my career, I have consistently delivered impactful software solutions that enhanced user experience and increased operational efficiency. In my previous role at Zidio Development, I led a team in designing a smart task scheduling system (WorkFlowIQ) using React, Node.js, MongoDB, and Express. I also integrated Redux for advanced state management and implemented drag-and-drop calendar features to boost productivity. The success of this project not only strengthened my technical foundation but also enhanced my leadership and communication skills.",
    
        "Beyond coding, I take immense pride in collaborating cross-functionally and ensuring project milestones are met with precision and innovation. I am passionate about clean code architecture, writing reusable components, and implementing CI/CD pipelines to streamline the development lifecycle. Joining your team excites me because I am confident I can bring fresh perspectives, dedication, and technical excellence that align with your mission to build world-class software products."
    
    ]);

  return (
    <ClContext.Provider value={{ personalInfo, setPersonalInfo, paragraphs, setParagraphs }}>
      {children}
    </ClContext.Provider>
  );
};

export const useCl = () => useContext(ClContext);
