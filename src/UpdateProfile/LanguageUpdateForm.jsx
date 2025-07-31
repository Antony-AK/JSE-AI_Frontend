import React from 'react';
import trash from "../assets/trash2.png";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // ✅ FIXED toast issue
import { BASE_URL } from '../utils/api';
import { t } from "../utils/i18n";


const LanguageUpdateForm = ({ onclose }) => {

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

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
      toast.error("Please fill all the fields.");
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
      toast.success(" Language added successfully");


      await fetchLanguages();



    } catch (err) {
      console.error('Error uploading language:', err);
      toast.error(err.issue);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLanguage = async () => {
    if (!activeId) return toast.error("Please select a language to update!");
    const selected = languages.find(lang => lang.tempId === activeId);
    if (!selected) return toast.error("Selected language not found.");

    setSaveLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/${activeId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Language updated successfully");
      await fetchLanguages();
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update language.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteLanguage = async () => {
    if (!activeId) return toast.error("Please select a language to delete!");
    setDeleteLoading(true);
    try {
      await axios.delete(`${apiUrl}/${activeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Language deleted.");
      setFormData({ language: '', proficiency: '' });
      setActiveId(null);
      await fetchLanguages();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete language.");
    } finally {
      setDeleteLoading(false);
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
        <div className="flex justify-between w-full mt-3  mb-7">
          <h3 className='text-lg font-semibold'>{t("language.title")}</h3>
          <p onClick={onclose} className='text-lg font-semibold cursor-pointer hover:scale-95'>X</p>
        </div>

        {/* Tabs */}
        {languages.length > 0 && (
          <div className="expereince-title flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
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

            {/* + Tab */}
            <div
              onClick={() => {
                setFormData({ language: '', proficiency: '' });
                setActiveId(null);
              }}
              className="flex items-center justify-center flex-shrink-0 h-8 w-8 p-3 rounded snap-start cursor-pointer 
                bg-gray-500/20 text-[#2c6472] text-xl font-medium hover:bg-gray-300 transition-all duration-200"
            >
              +
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="form-fields w-[90%] mx-auto flex flex-col gap-7 mt-5">

          {/* Language Field */}
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="language" className='text-[15px] text-gray-500'>
              {t("language.language_label")} <span className="text-red-500">*</span>
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
                {t("language.proficiency_label")} <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-4 ms-3">
                {[
                  { label: t("language.level.beginner"), value: 'beginner' },
                  { label: t("language.level.intermediate"), value: 'intermediate' },
                  { label: t("language.level.fluent"), value: 'fluent' },
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
              onClick={activeId === null && !loading ? handleAddLanguage : null}
              disabled={activeId !== null || loading}
              className={`text-sm flex items-center gap-2 font-medium hover:scale-105 transition ${activeId !== null || loading ? 'text-gray-500/60 cursor-not-allowed' : 'text-[#2c6472]'
                }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-[2.5px] border-[#2c6472] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-lg font-bold">+</span>
              )}
              {t("language.add_button")}
            </button>

            <button
              onClick={activeId !== null && !deleteLoading ? handleDeleteLanguage : null}
              disabled={activeId === null || deleteLoading}
              className={`text-sm flex items-center gap-2 font-medium hover:scale-105 transition ${activeId === null || deleteLoading ? 'text-gray-500/60 cursor-not-allowed' : 'text-red-500'
                }`}
            >
              {deleteLoading ? (
                <div className="w-4 h-4 border-[2.5px] border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <img src={trash} alt="trash icon" className="w-4 h-3.5 object-contain" />
              )}
              {t("language.remove_button")}
            </button>
          </div>

          <div className='flex justify-center items-center gap-4 mt-3'>
            <button
              onClick={activeId !== null && !saveLoading ? handleUpdateLanguage : null}
              disabled={activeId === null || saveLoading}
              className={`flex justify-center items-center ${activeId !== null && !saveLoading ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20 text-black cursor-not-allowed'
                } w-32 text-sm px-2 py-2 rounded-xl mb-2 hover:scale-105 transition`}
            >
              {saveLoading ? (
                <div className="w-4 h-4 border-[2.5px] border-[#2c6472] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{t("language.save_button")}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageUpdateForm;
