import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../utils/api'; // adjust path as needed

const ClContext = createContext();

export const ClProvider = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    title: '',
    mail: '',
    contact: '',
    address: '',
  });

  const [paragraphs, setParagraphs] = useState([]);

  // ✅ Load from API on mount
  useEffect(() => {
  const fetchCoverLetter = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const stored = sessionStorage.getItem('generatedCL');

      if (!token || !stored) {
        console.warn("⚠️ Missing token or generatedCL session data.");
        return;
      }

      const parsed = JSON.parse(stored);
      const jobId = parsed.job_id; // ✅ make sure this line is here!

      if (!jobId) {
        console.warn("⚠️ job_id missing in session storage.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/internal/generate-cover-letter?job_id=${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("📩 Fetched CL from API:", data);

      const clData = data.cl_data;

      setPersonalInfo({
        name: clData.name || '',
        title: clData.title || '',
        mail: clData.mail || '',
        contact: clData.contact || '',
        address: clData.address || '[ address ]',
      });

      setParagraphs(clData.paragraphs || []);
    } catch (error) {
      console.error("❌ Failed to fetch CL from API:", error.response?.data || error.message);
    }
  };

  fetchCoverLetter();
}, []);


  return (
    <ClContext.Provider value={{
      personalInfo,
      setPersonalInfo,
      paragraphs,
      setParagraphs
    }}>
      {children}
    </ClContext.Provider>
  );
};

export const useCl = () => useContext(ClContext);
