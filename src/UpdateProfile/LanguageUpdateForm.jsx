import React from 'react'
import trash from "../assets/trash2.png"
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const LanguageUpdateForm = ({ onclose }) => {
    const [certificateFile, setCertificateFile] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [selectedCertificateFileName, setSelectedCertificateFileName] = useState('');
    const [formData, setFormData] = useState({
        LanguageName: '',
        ProficiencyLevel: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});


    const token = sessionStorage.getItem('authToken');

    const apiUrl = "https://jse.arshan.digital/b1/languages";


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.LanguageName.trim()) {
            newErrors.LanguageName = 'Language name is required';
        }
        if (!formData.ProficiencyLevel) {
            newErrors.ProficiencyLevel = 'Proficiency level is required';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            alert("Please fill all the fields before adding data");
            return false;
        }

        return true;
    };


    const handleAddCertificate = async (e) => {
        if (!validateForm()) return;

        const token = sessionStorage.getItem('authToken');
        if (!token) {
            alert('You are not authenticated. Please log in.');
            return;
        }

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('LanguageName', formData.LanguageName);
            formDataToSend.append('ProficiencyLevel', formData.ProficiencyLevel);
            if (certificateFile) {
                formDataToSend.append('file', certificateFile); // ✅ Only if selected
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Upload failed');
            }

            alert(`✅ Languages uploaded successfully`);

            setFormData({
                LanguageName: '',
                ProficiencyLevel: ''
            });
            setCertificateFile(null);

            await fetchLanguages();

        } catch (err) {
            console.error('Error uploading language:', err);
            alert('Failed to upload language data.');
        } finally {
            setLoading(false);
        }
    };



    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCertificateFile(file); // ✅ Save raw file directly
            setSelectedCertificateFileName(''); // Clear previously selected file name

        }
    };

    const fetchLanguages = useCallback(async () => {


        try {
            const res = await axios.get(`${apiUrl}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched certificates response:", res.data);
            const rawData = Array.isArray(res.data)
                ? res.data : Array.isArray(res.data?.languages)
                    ? res.data.languages
                    : [];

            const dataWithId = rawData.map((lan, index) => ({ ...lan, tempId: index + 1 }));
            setLanguages(dataWithId);

        } catch (err) {
            console.error("Failed to fetch Certificates", err);
        }
    }, [token]);

    useEffect(() => {
        fetchLanguages();
    }, [fetchLanguages]);


    const [activeId, setActiveId] = useState(null); // track which one is active

    const handleSelectLanguages = (lan) => {
        setFormData({
            LanguageName: lan.language || "",
            ProficiencyLevel: lan.proficiency || "",
        });
        setCertificateFile(null); // Clear manually uploaded file
        setSelectedCertificateFileName(lan.certificate_file?.split('/').pop() || '');
        setActiveId(lan.tempId);
    };

    const handleUpdateLanguage = async () => {
        if (!activeId) return alert("Please select a language to update!");

        const selectedLanguage = languages.find(lang => lang.tempId === activeId);
        if (!selectedLanguage) return alert("Selected language not found.");

        const formDataToSend = new FormData();
        formDataToSend.append("LanguageName", formData.LanguageName);
        formDataToSend.append("ProficiencyLevel", formData.ProficiencyLevel);

        if (certificateFile) {
            formDataToSend.append("file", certificateFile);
        }

        try {
            const res = await axios.put(`${apiUrl}/${activeId}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200) {
                alert("✅ Language updated successfully!");
                await fetchLanguages();
            } else {
                alert("❌ Failed to update language.");
            }
        } catch (err) {
            console.error("Update failed", err);
            alert("❌ Error while updating language.");
        }
    };

    const handleDeleteLanguage = async () => {
        if (!activeId) return alert("Please select a language to delete!");

        const selectedLanguage = languages.find(lang => lang.tempId === activeId);
        if (!selectedLanguage) return;

        try {
            await axios.delete(`${apiUrl}/${activeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("✅ Language deleted!");
            await fetchLanguages();

            // Reset form after delete
            setFormData({
                LanguageName: '',
                ProficiencyLevel: ''
            });
            setCertificateFile(null);
            setSelectedCertificateFileName('');
            setActiveId(null);

        } catch (err) {
            console.error("Delete failed", err);
            alert("❌ Failed to delete language.");
        }
    };




    return (
        <div className='fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center trasnfrom ease-in-out duration-200'>
            <div className='w-[700px] h-[570px] bg-white flex flex-col shadow rounded-xl px-10 py-5 ' >

                <div className="flex justify-between w-full mt-3">
                    <h3 className='text-lg font-semibold'>Language</h3>
                    <p onClick={onclose} className='text-lg font-semibold cursor-pointer transform ease-in-out duration-200 hover:scale-95'>X</p>
                </div>

                <div className="expereince-title flex gap-4 mt-7 mb-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                    {languages.map((lan) => (
                        <div
                            key={lan.tempId}
                            onClick={() => handleSelectLanguages(lan)}
                            className={`flex-shrink-0  h-8 px-3 py-1.5 text-sm rounded snap-start cursor-pointer 
                                ${activeId === lan.tempId ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20'} 
                                hover:bg-[#2c6472] hover:text-white transition-all duration-200`}
                        >
                            {lan?.language}
                        </div>
                    ))}
                </div>

                <div className="form-fields flex flex-col gap-4">
                    <div className="flex flex-col w-full gap-4">
                        <label htmlFor="LanguageName" className='text-[15px] text-gray-500'>Language <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="LanguageName" // Fixed name attribute
                            placeholder=" "
                            value={formData.LanguageName}
                            onChange={handleChange}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none' />
                    </div>


                    <div className='flex gap-4'>
                        <div className="flex flex-col w-full gap-3">
                            <label htmlFor="certificateFile" className='text-[15px] text-gray-500' >Language Certificate (optional)</label>
                            <div className="border h-16 rounded outline-none border-gray-500/30 text-center">
                                <input
                                    type="file"
                                    id="certificateUpload"
                                    name='certificateFile'
                                    onChange={handleFileChange}
                                    className="hidden "
                                />
                                {/* {certificateFile &&  ? ( */}
                                <label htmlFor="certificateUpload" className="cursor-pointer flex mt-5 flex-col items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="gray"
                                        opacity={0.5}
                                        viewBox="0 0 24 24"
                                        width="25"
                                        height="25"
                                        className="-mt-1"
                                    >
                                        <path d="M16 16h-2v-4h-4v4H8l4 4 4-4z" />
                                        <path d="M18.944 10.112a6.5 6.5 0 00-12.671-1.098A5.502 5.502 0 007 20h11a5 5 0 00.944-9.888zM18 18H7a3.5 3.5 0 010-7h.5l.1-.4a4.5 4.5 0 018.7 1.2l.2.9H18a3 3 0 010 6z" />
                                    </svg>
                                    <p className="text-xs text-gray-500 text-center">
                                        {certificateFile?.name || selectedCertificateFileName}
                                    </p>
                                </label>
                            </div>
                        </div>

                    </div>

                    <div className='flex gap-4'>
                        <div className="flex flex-col w-full gap-3">
                            <label htmlFor="jobtitle" className='text-[15px] text-gray-500' >Proficiency <span className="text-red-500">*</span></label>
                            <div className="flex gap-2 my-2">
                                {['Native', 'Fluent', 'Intermediate', 'Beginner'].map((level) => (
                                    <label key={level} className="flex items-center cursor-pointer text-gray-500 text-xs">
                                        <input
                                            type="radio"
                                            name="ProficiencyLevel" // Fixed name attribute
                                            value={level}
                                            checked={formData.ProficiencyLevel === level} // Fix checked condition
                                            onChange={handleChange}
                                            className="mr-2 mb-1 text-gray-500"
                                        />
                                        {level}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between w-full mt-2">
                        <button  onClick={activeId === null ? handleAddCertificate : null}
                        disabled={activeId !== null}
                         className={`text-sm ${activeId !== null ? 'text-gray-500/60 cursor-not-allowed' : 'text-[#2c6472]'} font-medium hover:scale-95`}>+ Add Language</button>
                        <button onClick={activeId !== null ? handleDeleteLanguage : null}
                        disabled={activeId === null}
                         className={`text-sm flex ${activeId !== null ? 'text-red-500' : 'text-gray-500/60 cursor-not-allowed'} font-medium hover:scale-95`}>
                             <img src={trash} alt="trash icon" className="w-4 h-3.5 mt-0.5 text-red-500 me-1 object-contain " />
                            Remove</button>
                    </div>

                    <div className='flex justify-center items-center gap-4 mt-3'>
                        <button onClick={activeId !== null ? handleUpdateLanguage : null}
                        disabled={activeId === null}
                         className={` ${activeId !== null ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20 cursor-not-allowed'} w-32 text-sm px-2 py-2 rounded-xl mb-2 hover:scale-95 transition`}
                         >Save Changes</button>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default LanguageUpdateForm
