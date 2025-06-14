import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubmitAllData = () => {
  const navigate = useNavigate();
   const hasFetched = useRef(false);
  const [loading, setLoading] = useState(true);

  function dataURLToBlob(dataURL) {
    const parts = dataURL.split(',');
    const mime = dataURL.match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const submitAllData = async () => {
      const token = sessionStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const endpoints = {
        personalInfo: 'https://arshan.digital/personal-info',
        summary: 'https://arshan.digital/professional-summary',
        experience: 'https://arshan.digital/work-experience',
        education: 'https://arshan.digital/education',
        certificates: 'https://arshan.digital/certificates',
        languages: 'https://arshan.digital/languages',
      };

      try {
        // Log all session storage data before API calls
        const personalInfo = JSON.parse(sessionStorage.getItem('personalInfo'));
        console.log('📌 personalInfo:', personalInfo);

        const summary = JSON.parse(sessionStorage.getItem('professionalsummary'));
        console.log('📌 summary:', summary);

        const experiences = JSON.parse(sessionStorage.getItem('workexp')) || [];
        console.log('📌 experiences:', experiences);

        const educationEntries = JSON.parse(sessionStorage.getItem("education")) || [];
        console.log('📌 educationEntries:', educationEntries);

        const certificateFormData = JSON.parse(sessionStorage.getItem('certificateFormData'));
        console.log('📌 certificateFormData:', certificateFormData);

        const certificateFile = sessionStorage.getItem('certificateFile');
        console.log('📌 certificateFile:', certificateFile);


        const languages = JSON.parse(sessionStorage.getItem('languageFormData')) || [];
        console.log('📌 languages:', languages);

        const languageCertificateFile = sessionStorage.getItem('languageCertificateFile');
        console.log('📌 languageCertificateFile:', languageCertificateFile);

        // Additional session storage keys for certificate data


        // Comment out API calls for now
        // if (personalInfo) await axios.post(endpoints.personalInfo, personalInfo, { headers });
        // if (summary) await axios.post(endpoints.summary, summary, { headers });

        // for (let exp of experiences) {
        //   await axios.post(endpoints.experience, exp, { headers });
        // }

        // for (let edu of educationEntries) {
        //   await axios.post(endpoints.education, edu, { headers });
        // }

        // for (let lang of languages) {
        //   const form = new FormData();
        //   form.append('LanguageName', lang.LanguageName);
        //   form.append('ProficiencyLevel', lang.ProficiencyLevel);
        //   if (lang.file) {
        //     const file = typeof lang.file === 'string' ? dataURLToBlob(lang.file) : lang.file;
        //     form.append('file', file, 'language-cert.pdf');
        //   }

        //   console.log('⬆️ Posting language:', {
        //     LanguageName: lang.LanguageName,
        //     ProficiencyLevel: lang.ProficiencyLevel,
        //     file: lang.file,
        //   });

        //   await axios.post(endpoints.languages, form, {
        //     headers: { Authorization: `Bearer ${token}` },
        //   });
        // }

        console.log('✅ All data logged successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error('❌ Error occurred:', error);
        alert('Failed to submit data. Please try again.');
      } finally {
        setLoading(false); // Set loading to false after logging the data
      }
    };

    submitAllData();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
      {loading ? (
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      ) : (
        <p className="text-xl mt-4">Data logged successfully!</p>
      )}
      {loading && <p className="text-xl mt-4">Logging your data, please wait...</p>}
    </div>
  );
};

export default SubmitAllData;
