import { createContext, useContext, useState, useEffect } from 'react';

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

  // Load from sessionStorage only on first render
  useEffect(() => {
    const storedData = sessionStorage.getItem('generatedCL');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setPersonalInfo({
        name: parsed.name || '',
        title: parsed.title || '',
        mail: parsed.mail || '',
        contact: parsed.contact || '',
        address: parsed.address || '[ address ]',
      });
      setParagraphs(parsed.paragraphs || []);
    }
  }, []);

  return (
    <ClContext.Provider value={{ personalInfo, setPersonalInfo, paragraphs, setParagraphs }}>
      {children}
    </ClContext.Provider>
  );
};

export const useCl = () => useContext(ClContext);