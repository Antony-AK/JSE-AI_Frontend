import React, { createContext, useContext, useState } from 'react';

// Create context
const ClContext = createContext();

// Provider component
export const ExternalClProvider = ({ children }) => {
  // Get session data
  const stored = JSON.parse(sessionStorage.getItem("cv_data")) || {};
  const rawData = stored.cl_data || {};

  // Transform data
  const [personalInfo, setPersonalInfo] = useState({
    name: rawData.name || "",
    mail: rawData.mail || "",
    contact: rawData.contact || "",
    address: rawData.address || "",
    title: rawData.title || "",
  });

  const [paragraphs, setParagraphs] = useState(rawData.paragraphs || []);

  return (
    <ClContext.Provider value={{
      personalInfo,
      setPersonalInfo,
      paragraphs,
      setParagraphs,
    }}>
      {children}
    </ClContext.Provider>
  );
};

// Hook to use the context
export const useExternalCl = () => useContext(ClContext);
