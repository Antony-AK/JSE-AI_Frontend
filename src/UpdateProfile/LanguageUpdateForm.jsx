import React from 'react';
import trash from "../assets/trash2.png";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // ✅ FIXED toast issue
import { BASE_URL } from '../utils/api'; 

const LanguageUpdateForm = ({ onclose }) => {
  const [languages, setLanguages] = useState([]);
  const [formData, setFormData] = useState({
    language: '',
    proficiency: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeId, setActiveId] = useState(null); // track selected item
  const token = sessionStorage.getItem('authToken');
  const apiUrl = `${BASE_URL}/languages`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.language.trim()) {
      newErrors.language = 'Language name is required';
    }
    if (!formData.proficiency) {
      newErrors.proficiency = 'Proficiency level is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Please fill all the fields before adding data");
      return false;
    }

    return true;
  };

   const handleAddLanguage = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
  
      const token = sessionStorage.getItem('authToken');
  
  
      if (!token) {
        navigate('/user/login');
        toast.error('User not found. Please log in');
        return;
      }
  
      setLoading(true);
      
      try {
  
        const response = await fetch(`${BASE_URL}/languages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Add this
          },
          body: JSON.stringify({
            language: formData.language,
            proficiency: formData.proficiency,
          }),
        });
  
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Upload failed');
  
        }
  
        setFormData({
          language: '',
          proficiency: ''
        });  

            await fetchLanguages();

  
  
      } catch (err) {
        console.error('Error uploading language:', err);
        toast.error(err.issue);
      } finally {
        setLoading(false);
      }
    };

  const handleUpdateLanguage = async () => {
    if (!activeId) return alert("Please select a language to update!");

    const selected = languages.find(lang => lang.tempId === activeId);
    if (!selected) return alert("Selected language not found.");

    try {
      const response = await axios.put(`${apiUrl}/${activeId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Language updated successfully");
      await fetchLanguages();
    } catch (err) {
      console.error("Update failed", err);
      alert("❌ Failed to update language.");
    }
  };

  const handleDeleteLanguage = async () => {
    if (!activeId) return alert("Please select a language to delete!");

    try {
      await axios.delete(`${apiUrl}/${activeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Language deleted");
      setFormData({ language: '', proficiency: '' });
      setActiveId(null);
      await fetchLanguages();
    } catch (err) {
      console.error("Delete failed", err);
      alert("❌ Failed to delete language.");
    }
  };

  const fetchLanguages = useCallback(async () => {
    try {
      const res = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const rawData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.languages)
        ? res.data.languages
        : [];

      const dataWithId = rawData.map((lan, index) => ({
        ...lan,
        tempId: index + 1,
      }));

      setLanguages(dataWithId);
    } catch (err) {
      console.error("Failed to fetch languages", err);
    }
  }, [token]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const handleSelectLanguages = (lan) => {
    setFormData({
      language: lan.language || '',
      proficiency: lan.proficiency || '',
    });
    setActiveId(lan.tempId);
  };

  return (
    <div className='fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center'>
      <div className='w-[700px] h-[570px] bg-white flex flex-col shadow rounded-xl px-10 py-5'>
        <div className="flex justify-between w-full mt-3">
          <h3 className='text-lg font-semibold'>Languages</h3>
          <p onClick={onclose} className='text-lg font-semibold cursor-pointer hover:scale-95'>X</p>
        </div>

        {/* Tabs */}
        <div className="expereince-title flex gap-4 mt-7 mb-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
          {languages.map((lan) => (
            <div
              key={lan.tempId}
              onClick={() => handleSelectLanguages(lan)}
              className={`flex-shrink-0 h-8 px-3 py-1.5 text-sm rounded snap-start cursor-pointer 
              ${activeId === lan.tempId ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20'} 
              hover:bg-[#2c6472] hover:text-white transition-all duration-200`}
            >
              {lan?.language}
            </div>
          ))}
        </div>

        {/* Form Fields */}
        <div className="form-fields w-[90%] mx-auto flex flex-col gap-7">

          {/* Language Field */}
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="language" className='text-[15px] text-gray-500'>
              Language <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className='border border-gray-500/30 px-4 py-4 rounded-md outline-none focus:ring-1 focus:ring-[#2c6472]'
            />
          </div>

          {/* Proficiency Field */}
          <div className='flex gap-4'>
            <div className="flex flex-col w-full gap-2">
              <label className='text-[15px] text-gray-500'>
                Proficiency <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-4 ms-3">
                {[
                  { label: 'Beginner (A1, A2)', value: 'beginner' },
                  { label: 'Intermediate (B1, B2)', value: 'intermediate' },
                  { label: 'Fluent / Native (C1, C2)', value: 'fluent' },
                ].map((level) => (
                  <label key={level.value} className="flex items-center text-sm text-gray-500">
                    <input
                      type="radio"
                      name="proficiency"
                      value={level.value}
                      checked={formData.proficiency === level.value}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {level.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between w-full mt-2">
            <button
              onClick={activeId === null ? handleAddLanguage : null}
              disabled={activeId !== null}
              className={`text-sm ${activeId !== null ? 'text-gray-500/60 cursor-not-allowed' : 'text-[#2c6472]'} font-medium hover:scale-95`}
            >
              + Add Language
            </button>

            <button
              onClick={activeId !== null ? handleDeleteLanguage : null}
              disabled={activeId === null}
              className={`text-sm flex ${activeId !== null ? 'text-red-500' : 'text-gray-500/60 cursor-not-allowed'} font-medium hover:scale-95`}
            >
              <img src={trash} alt="trash icon" className="w-4 h-3.5 mt-0.5 me-1 object-contain" />
              Remove
            </button>
          </div>

          <div className='flex justify-center items-center gap-4 mt-3'>
            <button
              onClick={activeId !== null ? handleUpdateLanguage : null}
              disabled={activeId === null}
              className={` ${activeId !== null ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20 cursor-not-allowed'} w-32 text-sm px-2 py-2 rounded-xl mb-2 hover:scale-95 transition`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageUpdateForm;
