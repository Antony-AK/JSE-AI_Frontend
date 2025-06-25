import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../utils/api'; // make sure path is correct

const ClContext = createContext();

export const ExternalClProvider = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    mail: "",
    contact: "",
    address: "",
    title: "",
  });

  const [paragraphs, setParagraphs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoverLetter = async () => {
      const token = sessionStorage.getItem("authToken");
      const jobId = sessionStorage.getItem("externalJobId"); // ✅ Make sure this is stored earlier

      if (!token || !jobId) {
        console.warn("⚠️ Missing token or job ID in sessionStorage");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/external/generate?job_id=${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const clData = response.data?.cl_data;

        if (clData) {
          setPersonalInfo({
            name: clData.name || "",
            mail: clData.mail || "",
            contact: clData.contact || "",
            address: clData.address || "",
            title: clData.title || "",
          });
          setParagraphs(clData.paragraphs || []);
        }

        console.log("✅ Cover letter fetched successfully:", clData);

      } catch (error) {
        console.error("❌ Failed to fetch cover letter:", error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoverLetter();
  }, []);

  return (
    <ClContext.Provider value={{
      personalInfo,
      setPersonalInfo,
      paragraphs,
      setParagraphs,
      isLoading,
    }}>
      {children}
    </ClContext.Provider>
  );
};

// Custom hook
export const useExternalCl = () => useContext(ClContext);
