import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BASE_URL } from '../utils/api';
import { jobskills } from '../assets/data';
import axios from 'axios';
import trash from '../assets/trash2.png';
import { toast } from 'react-toastify';

const JobTitleUpdateForm = ({ onclose }) => {
  const [titles, setTitles] = useState([]);
  const [formData, setFormData] = useState({
    primary_title: '',
    secondary_title: '',
    tertiary_title: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pendingTitleToAdd, setPendingTitleToAdd] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const token = sessionStorage.getItem('authToken');
  const apiUrl = `${BASE_URL}/jobtitles`;

  const sortedTitles = Object.keys(jobskills).sort();

  const fetchTitles = useCallback(async () => {
    try {
      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.jobtitles || [];

      const withTempId = data.map((title, index) => ({ ...title, tempId: index + 1 }));
      setTitles(withTempId);
    } catch (err) {
      console.error('Error fetching job titles:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchTitles();
  }, [fetchTitles]);

  const handleSelectTitle = (title) => {
    setFormData({
      primary_title: title.primary_title || '',
      secondary_title: title.secondary_title || '',
      tertiary_title: title.tertiary_title || '',
    });
    setSearchTerm('');
    setActiveId(title.tempId);
  };

  const getFilteredTitles = (input) =>
    sortedTitles.filter((title) =>
      title.toLowerCase().includes((input || '').toLowerCase())
    );

  const isDuplicate = (title) => {
    const lower = title.toLowerCase();
    return (
      formData.primary_title?.toLowerCase() === lower ||
      formData.secondary_title?.toLowerCase() === lower ||
      formData.tertiary_title?.toLowerCase() === lower
    );
  };

  const handleSelect = (value) => {
    if (isDuplicate(value)) {
      toast.error('This title is already added!');
      return;
    }

    if (!formData.primary_title) {
      setFormData((prev) => ({ ...prev, primary_title: value }));
    } else if (!formData.secondary_title) {
      setFormData((prev) => ({ ...prev, secondary_title: value }));
    } else if (!formData.tertiary_title) {
      setFormData((prev) => ({ ...prev, tertiary_title: value }));
    } else {
      toast.error('You can only select up to 3 titles.');
    }

    setSearchTerm('');
    setShowDropdown(false);
  };

  const removeTitle = (key) => {
    if (key === 'primary_title') {
      setFormData((prev) => ({
        primary_title: prev.secondary_title,
        secondary_title: prev.tertiary_title,
        tertiary_title: '',
      }));
    } else if (key === 'secondary_title') {
      setFormData((prev) => ({
        ...prev,
        secondary_title: prev.tertiary_title,
        tertiary_title: '',
      }));
    } else if (key === 'tertiary_title') {
      setFormData((prev) => ({ ...prev, tertiary_title: '' }));
    }
  };

  const handleSaveChanges = async () => {
    if (!formData.primary_title) return alert("Primary title is required.");

    try {
      await axios.put(`${apiUrl}/${activeId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Titles updated!");
      setActiveId(null);
      await fetchTitles();
    } catch (err) {
      console.error('Update failed:', err);
      toast.error("❌ Update failed.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/${activeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Deleted successfully.");
      setFormData({
        primary_title: '',
        secondary_title: '',
        tertiary_title: '',
      });
      setActiveId(null);
      await fetchTitles();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error("❌ Delete failed.");
    }
  };

  const handleAdd = async () => {
    if (!formData.primary_title) return alert("Primary title is required.");
    try {
      await axios.post(apiUrl, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Job titles added!");
      setFormData({
        primary_title: '',
        secondary_title: '',
        tertiary_title: '',
      });
      await fetchTitles();
    } catch (err) {
      console.error('Add failed:', err);
      toast.error("❌ Add failed.");
    }
  };

  const selectedTitles = [
    { key: 'primary_title', value: formData.primary_title },
    { key: 'secondary_title', value: formData.secondary_title },
    { key: 'tertiary_title', value: formData.tertiary_title },
  ].filter((t) => t.value);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
      <div className="w-[700px] h-[500px] bg-white shadow rounded-xl px-10 py-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Job Titles</h3>
          <p onClick={onclose} className="cursor-pointer text-lg font-semibold hover:scale-95">X</p>
        </div>

        <div className="flex gap-3 overflow-x-auto mt-14 mb-4">
          {titles.map((title) => (
            <div
              key={title.tempId}
              onClick={() => handleSelectTitle(title)}
              className={`px-3 py-1 text-sm rounded cursor-pointer ${activeId === title.tempId ? 'bg-[#2c6472] text-white' : 'bg-gray-300'} hover:bg-[#2c6472] hover:text-white`}
            >
              {title.primary_title}
            </div>
          ))}
        </div>

        <div className='relative flex mb-2' ref={dropdownRef}>
          <input
            ref={inputRef}
            type='text'
            className='w-full h-[52px] px-4 py-2 border border-gray-300 rounded-lg text-base text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2c6472]'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const inputValue = searchTerm.trim();
                const match = getFilteredTitles(inputValue)[0];

                if (!match) return toast.error('Title not found');

                const isExact = sortedTitles.some((t) => t.toLowerCase() === inputValue.toLowerCase());
                if (!isExact) {
                  setSearchTerm(match);
                  setPendingTitleToAdd(match);
                } else {
                  setPendingTitleToAdd(inputValue);
                }

                setTimeout(() => inputRef.current?.blur(), 0);
              }
            }}
            placeholder="Search or select job title..."
          />

          {showDropdown && (
            <ul className='absolute z-10 w-full max-h-56 overflow-y-auto mt-14 bg-white border border-gray-300 rounded shadow-md'>
              {getFilteredTitles(searchTerm).map((title, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(title)}
                  className={`px-4 py-2 cursor-pointer ${index === 0 ? 'bg-[#2c6472] text-white' : 'text-gray-500 hover:bg-[#2c6472] hover:text-white'}`}
                >
                  {title}
                </li>
              ))}
              {getFilteredTitles(searchTerm).length === 0 && (
                <li className='px-4 py-2 text-gray-400'>No matching titles</li>
              )}
            </ul>
          )}
        </div>

        <div className='flex flex-wrap gap-3 mt-7'>
          {selectedTitles.map(({ key, value }, idx) => (
            <div key={idx} className='bg-gray-100 px-3 py-1 text-sm text-gray-600 rounded-full flex items-center'>
              <span className='mr-2'>{value}</span>
              <button onClick={() => removeTitle(key)} className='text-gray-600 hover:text-red-500'>&times;</button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-10">
          <button
            onClick={activeId === null ? handleAdd : null}
            disabled={activeId !== null}
            className={`text-sm ${activeId !== null ? 'text-gray-400 cursor-not-allowed' : 'text-[#2c6472]'} font-medium hover:scale-95`}
          >
            + Add Titles
          </button>
          <button
            onClick={activeId !== null ? handleDelete : null}
            disabled={activeId === null}
            className={`text-sm flex items-center ${activeId !== null ? 'text-red-500' : 'text-gray-400 cursor-not-allowed'} font-medium hover:scale-95`}
          >
            <img src={trash} alt="trash" className="w-4 h-4 mr-1" />
            Remove
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={activeId !== null ? handleSaveChanges : null}
            disabled={activeId === null}
            className={`w-32 text-sm px-3 py-2 rounded-xl transition ${activeId !== null ? 'bg-[#2c6472] text-white' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobTitleUpdateForm;
