import React, { useState, useEffect, useCallback } from 'react'
import trash from "../assets/trash2.png"
import axios from 'axios';
import { toast } from 'react-toastify';
import Calendar from '../base/Calender/Calender';
import { format } from 'date-fns';
import { BASE_URL } from '../utils/api';
import { t } from "../utils/i18n";


const EducationUpdateForm = ({ onclose }) => {
    const apiUrl = `${BASE_URL}/academics`;
    const [education, setEducation] = useState([]);
    const token = sessionStorage.getItem('authToken');

    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);

    const [formData, setFormData] = useState({
        degree: '',
        institution: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        achievements: '',
        currentlyDoing: false
    });

    const handleAddEducation = async () => {
        if (!token || addLoading) return;

        setAddLoading(true);

        if (!formData.start_date) {
            toast.error("Start date is required.");
            setAddLoading(false);
            return;
        }

        if (!formData.currentlyDoing && !formData.end_date) {
            toast.error("End date is required.");
            setAddLoading(false);
            return;
        }

        if (!isValidDateRange(formData.start_date, formData.end_date)) {
            toast.error("Start date cannot be after end date.");
            setAddLoading(false);
            return;
        }

        const formatDateToISO = (date) => {
            const localDate = new Date(date);
            return isNaN(localDate.getTime()) ? null : localDate.toISOString();
        };

        const updatedFormData = {
            ...formData,
            start_date: formatDateToISO(formData.start_date),
            end_date: formData.currentlyDoing ? null : formatDateToISO(formData.end_date),
        };

        try {
            await axios.post(apiUrl, updatedFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success("Education data uploaded successfully");

            setFormData({
                degree: '',
                institution: '',
                field_of_study: '',
                start_date: '',
                end_date: '',
                achievements: '',
            });

            await fetchEducations();
        } catch (error) {
            console.error('Error uploading data:', error);
            if (error.response) {
                console.error('API Response:', error.response.data);
            }
        } finally {
            setAddLoading(false);
        }
    };

    const fetchEducations = useCallback(async () => {


        try {
            const res = await axios.get(`${apiUrl}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched experiences response:", res.data);
            
            const rawData = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.academics)
                ? res.data.academics
                : [];            

            const dataWithId = rawData.map((edu, index) => ({ ...edu, tempId: index + 1 }));
            setEducation(dataWithId);

        } catch (err) {
            console.error("Failed to fetch experiences", err);
        }
    }, [token]);

    useEffect(() => {
        fetchEducations();
    }, [fetchEducations]);


    const [activeId, setActiveId] = useState(null); // track which one is active

    const handleSelectEducation = (edu) => {
        setFormData({
            degree: edu.degree || "",
            institution: edu.institution || "",
            field_of_study: edu.field_of_study || "",
            start_date: edu.start_date?.split("T")[0] || "",
            end_date: edu.end_date?.split("T")[0] || "",
            achievements: edu.achievements || "",
            currentlyDoing: !edu.end_date,
        });
        setActiveId(edu.tempId);
    };


    const handleSave = async () => {
        if (loading || activeId === null) return;

        setLoading(true);

        const formatDateToFullISO = (date) => {
            return date ? new Date(date).toISOString() : null;
        };

        if (!formData.start_date) {
            toast.error("Start date is required.");
            setLoading(false);
            return;
        }

        if (!formData.currentlyDoing && !formData.end_date) {
            toast.error("End date is required.");
            setLoading(false);
            return;
        }

        if (!isValidDateRange(formData.start_date, formData.end_date)) {
            toast.error("Start date cannot be after end date.");
            setLoading(false);
            return;
        }

        const updatedExperience = {
            degree: formData.degree,
            institution: formData.institution,
            field_of_study: formData.field_of_study,
            start_date: formatDateToFullISO(formData.start_date),
            end_date: formData.currentlyDoing ? null : formatDateToFullISO(formData.end_date),
            achievements: formData.achievements,
        };

        const selectedEducation = education.find((edu) => edu.tempId === activeId);
        if (!selectedEducation) {
            toast.error("Selected experience not found.");
            setLoading(false);
            return;
        }

        const educationIndex = selectedEducation.tempId;

        try {
            const res = await axios.put(`${apiUrl}/${educationIndex}, updatedExperience`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 200) {
                const updatedList = education.map((edu) =>
                    edu.tempId === educationIndex ? { ...edu, ...updatedExperience } : edu
                );
                setEducation(updatedList);
                toast.success("Education updated successfully!");
            } else {
                toast.error("Failed to update education.");
            }
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Error while updating education.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEducation = async () => {
        if (!activeId || deleteLoading) return toast.error("Please select an experience to delete!");

        setDeleteLoading(true);

        const selectedEducation = education.find(edu => edu.tempId === activeId);
        if (!selectedEducation) {
            setDeleteLoading(false);
            return;
        }

        try {
            await axios.delete(`${apiUrl}/${selectedEducation.tempId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Education deleted!");
            await fetchEducations();
            setFormData({
                degree: '',
                institution: '',
                field_of_study: '',
                start_date: '',
                end_date: '',
                achievements: ''
            });
            setActiveId(null);
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isValidDateRange = (start, end) => {
        if (!start || !end) return true; // skip if one is empty (e.g., currentlyDoing)
        const startDate = new Date(start);
        const endDate = new Date(end);
        return startDate <= endDate;
    };

    return (

        <div className='fixed inset-0 overflow-y-auto bg-white bg-opacity-70 z-50 flex items-center justify-center p-10 trasnfrom ease-in-out duration-200'>
            <div className='w-full max-w-[700px] mt-5  bg-white flex flex-col shadow rounded-xl px-10 py-5 ' >

                <div className="flex justify-between w-full mt-3 mb-7">
                    <h3 className='text-lg font-semibold'>{t("educations.title")}</h3>
                    <p onClick={onclose} className='text-lg font-semibold cursor-pointer transform ease-in-out duration-200 hover:scale-95'>X</p>
                </div>

                {education.length > 0 && (
                <div className="expereince-title flex gap-4 mb-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                    {education.map((edu) => (
                        <div
                            key={edu.tempId}
                            onClick={() => handleSelectEducation(edu)}
                            className={`flex-shrink-0  h-8 px-3 py-1.5 text-sm rounded snap-start cursor-pointer 
                                ${activeId === edu.tempId ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20'} 
                                hover:bg-[#2c6472] hover:text-white transition-all duration-200`}
                        >
                            {edu?.field_of_study}
                        </div>
                    ))}
                    <div
                        onClick={() => {
                            setFormData({
                                degree: '',
                                institution: '',
                                field_of_study: '',
                                start_date: '',
                                end_date: '',
                                achievements: ''
                            });
                            setActiveId(null); // Clear selected education
                        }}
                        className="flex items-center justify-center flex-shrink-0 h-8 w-8 p-3 rounded snap-start cursor-pointer 
                            bg-gray-500/20 text-[#2c6472] text-2xl hover:bg-gray-900/20 transition-all duration-200"
                    >
                        +
                    </div>                    
                </div>
                )}

                <div className="form-fields flex flex-col gap-4">
                    <div className="flex flex-col w-full gap-4">
                        <label htmlFor="degree" className='text-[15px] text-gray-500'>{t("educations.degree")} <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="degree"
                            onChange={handleChange}
                            value={formData.degree}
                            required
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none' />
                    </div>


                    <div className='flex gap-4'>
                        <div className="flex flex-col w-1/2 gap-3">
                            <label htmlFor="institution" className='text-[15px] text-gray-500' >{t("educations.institution")}   <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="institution"
                                onChange={handleChange}
                                value={formData.institution}
                                required
                                className='border border-gray-500/30 px-4 py-2 rounded outline-none' />
                        </div>

                        <div className="flex flex-col w-1/2 gap-3">
                            <label htmlFor="field_of_study" className='text-[15px] text-gray-500' >{t("educations.field")}  <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="field_of_study"
                                onChange={handleChange}
                                required
                                value={formData.field_of_study}
                                className='border border-gray-500/30 px-4 py-2 rounded outline-none' />
                                
                        </div>
                    </div>

                    <div className='flex gap-4'>
                        <div className="flex flex-col w-1/2 gap-3">
                            <label htmlFor="start_date" className='text-[15px] text-gray-500' >{t("educations.startDate")} <span className="text-red-500">*</span></label>
                            <Calendar
                                selectedDate={formData.start_date ? new Date(formData.start_date) : null}
                                onDateChange={(date) =>
                                    setFormData((prev) => ({
                                    ...prev,
                                    start_date: format(date, 'yyyy-MM-dd'),
                                    }))
                                }
                            />
                        </div>

                        <div className="flex flex-col w-1/2 gap-3">
                            <label htmlFor="end_date" className='text-[15px] text-gray-500'>
                                {t("educations.endDate")} {!formData.currentlyDoing && <span className="text-red-500">*</span>}
                            </label>
                            {formData.currentlyDoing ? (
                                <input
                                    type="text"
                                    value="Currently Studying"
                                    disabled
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                                />
                            ) : (
                                <Calendar
                                    selectedDate={formData.end_date ? new Date(formData.end_date) : null}
                                    onDateChange={(date) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            end_date: format(date, 'yyyy-MM-dd'),
                                        }))
                                    }
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            id="currentlyDoing"
                            checked={formData.currentlyDoing}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    currentlyDoing: e.target.checked,
                                    end_date: e.target.checked ? "" : prev.end_date, // Clear end_date if checked
                                }))
                            }
                            className="mr-2 accent-[#2c6472] w-4 h-4"
                        />
                        <label htmlFor="currentlyDoing" className="text-gray-600 text-sm">
                            {t("educations.currentlyDoing")}

                        </label>
                    </div>

                    <div className="flex flex-col w-full gap-4">
                        <label htmlFor="achievements" className='text-[15px] text-gray-500'>{t("educations.achievements")}</label>
                        <textarea
                            name="achievements"
                            onChange={handleChange}
                            required
                            value={formData.achievements} className='border border-gray-500/30 px-4 py-2 rounded outline-none' />
                    </div>

                    <div className="flex justify-between w-full mt-2">
                        <button
                          onClick={activeId === null && !addLoading ? handleAddEducation : null}
                          disabled={activeId !== null || addLoading}
                          className={`text-sm flex items-center ${
                            activeId !== null || addLoading
                            ? 'text-gray-500/60 cursor-not-allowed'
                            : 'text-[#2c6472]'
                        } font-medium hover:scale-95 transition`}
                        >
                        {addLoading ? (
                            <div className="w-4 h-4 border-[2.5px] border-[#2c6472] border-t-transparent rounded-full animate-spin me-2" />
                        ) : (
                            "+ "
                        )}
                        {t("educations.add")}

                        </button>
                        <button
                          onClick={activeId !== null && !deleteLoading ? handleDeleteEducation : null}
                          disabled={activeId === null || deleteLoading}
                          className={`text-sm flex items-center 
                                ${activeId !== null ? 'text-red-500' : 'text-gray-500/60 cursor-not-allowed'} 
                                font-medium hover:scale-95 transition`}
                        >
                        {deleteLoading ? (
                            <div className="w-4 h-4 border-[2.5px] border-red-500 border-t-transparent rounded-full animate-spin me-2" />
                         ) : (
                            <img
                             src={trash}
                             alt="trash icon"
                             className="w-4 h-3.5 mt-0.5 me-1 object-contain"
                            />
                        )}
                            {t("educations.remove")}
                        </button>
                    </div>

                    <div className='flex justify-center items-center gap-4 mt-3'>
                        <button
                            onClick={activeId !== null ? handleSave : null}
                            disabled={activeId === null || loading}
                            className={`w-32 text-sm px-2 py-2 rounded-xl mb-2 transition hover:scale-95 flex items-center justify-center gap-2
                                ${activeId !== null && !loading ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20 cursor-not-allowed'}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-[3px] border-[#2c6472] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <span>{t("educations.save")}</span>
                            )}
                        </button>
                    </div>

                </div>
            </div>

        </div>

    )
}

export default EducationUpdateForm