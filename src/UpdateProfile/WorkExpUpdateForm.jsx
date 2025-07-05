import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import trash from "../assets/trash2.png";
import axios from "axios";
import Calendar from '../base/Calender/Calender';
import { format } from 'date-fns';

const WorkExpUpdateForm = ({ onclose }) => {

    const apiUrl = "https://dev.arshan.digital/b1/work-experience";
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        job_title: "",
        company_name: "",
        location: "",
        start_date: "",
        end_date: "",
        key_responsibilities: ""
    });
    const token = sessionStorage.getItem("authToken");


    const isFormValid = () => {
        return formData.job_title && formData.company_name && formData.start_date && formData.key_responsibilities;
    };

    const sendData = async () => {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            console.error("Error: No token found in session storage.");
            return;
        }

        const formatDateForAPI = (dateString) => {
            if (!dateString) return null; // ⛔ avoid formatting if empty
            const date = new Date(dateString);
            return date.toISOString(); // ✅ full ISO string with "T"
        };

        const requestData = {
            ...formData,
            start_date: formatDateForAPI(formData.start_date),
            ...(formData.end_date && { end_date: formatDateForAPI(formData.end_date) }),
        };



        try {
            const response = await axios.post(`${apiUrl}`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            toast.success(`Work Experience uploaded!`);
        } catch (error) {
            console.error("Error uploading data:", error);
            if (error.response) {
                console.error("API Response:", error.response.data); // Log the actual response from API
            }
        }
    };

    const handleAddExperience = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            toast.error("Please fill all required fields!");
            return;
        }
        setLoading(true);
        await sendData();
        await fetchExperiences();
        setFormData({
            job_title: "",
            company_name: "",
            location: "",
            start_date: "",
            end_date: "",
            key_responsibilities: "",
        });
        setActiveId(null);
        setLoading(false);
    };

    const fetchExperiences = useCallback(async () => {
        console.log("Token used:", token);

        try {
            const res = await axios.get(`${apiUrl}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const rawData = Array.isArray(res.data)
                ? res.data : Array.isArray(res.data?.work_experiences)
                    ? res.data.work_experiences
                    : [];

            const dataWithId = rawData.map((exp, index) => ({ ...exp, tempId: index + 1 }));
            setExperiences(dataWithId);

        } catch (err) {
            console.error("Failed to fetch experiences", err);
        }
    }, [token]);

    useEffect(() => {
        fetchExperiences();
    }, [fetchExperiences]);


    const [activeId, setActiveId] = useState(null); // track which one is active


    // Select experience to edit
    const handleSelectExperience = (exp) => {
        setFormData({
            job_title: exp.job_title || "",
            company_name: exp.company_name || "",
            location: exp.location || "",
            start_date: exp.start_date?.split("T")[0] || "",
            end_date: exp.end_date?.split("T")[0] || "",
            key_responsibilities: exp.key_responsibilities || ""
        });
        setActiveId(exp.tempId);
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // Save Changes
    const handleSave = async () => {
        const toISOString = (dateStr) => dateStr ? new Date(dateStr).toISOString() : null;

        const updatedExperience = {
            job_title: formData.job_title,
            company_name: formData.company_name,
            location: formData.location,
            start_date: toISOString(formData.start_date),
            end_date: formData.end_date ? toISOString(formData.end_date) : null,
            key_responsibilities: formData.key_responsibilities
        };

        const selectedIndex = experiences.findIndex(exp => exp.tempId === activeId);

        if (selectedIndex === -1) {
            return toast.error("Selected experience not found.");
        }

        const backendIndex = selectedIndex + 1; // because your backend expects 1-based index in URL

        try {
            const res = await axios.put(`${apiUrl}/${backendIndex}`, updatedExperience, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 200) {
                // Update local state
                const updatedList = experiences.map((exp, i) =>
                    i === selectedIndex ? { ...exp, ...updatedExperience } : exp
                );
                setExperiences(updatedList);

                toast.success("Work experience updated!");
                setFormData({
                    job_title: "",
                    company_name: "",
                    location: "",
                    start_date: "",
                    end_date: "",
                    key_responsibilities: ""
                });
                setActiveId(null);
            } else {
                toast.error("Failed to update work experience.");
            }

        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Error while updating work experience.");
        }
    };

    const handleDeleteExperience = async () => {
        if (!activeId) return toast.error("Please select an experience to delete!");

        const selectedExperience = experiences.find(exp => exp.tempId === activeId);
        if (!selectedExperience) return;
        try {
            await axios.delete(`${apiUrl}/${selectedExperience.tempId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Experience deleted!");
            await fetchExperiences();
            setFormData({
                job_title: "",
                company_name: "",
                location: "",
                start_date: "",
                end_date: "",
                key_responsibilities: ""
            });
            setActiveId(null);
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete.");
        }
    };



    return (
        <div className='fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center'>
            <div className='w-[700px] h-[650px] bg-white flex flex-col shadow rounded-xl px-10 py-5'>

                <div className="flex justify-between w-full mb-7 mt-3">
                    <h3 className='text-lg font-semibold'>Work Experience</h3>
                    <p onClick={onclose} className='text-lg font-semibold cursor-pointer hover:scale-95'>X</p>
                </div>

                {experiences && experiences.length > 0 && (
                    <div className="expereince-title flex gap-4  mb-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                        {experiences.map((exp) => (
                            <div
                                key={exp.tempId}
                                onClick={() => handleSelectExperience(exp)}
                                className={`flex-shrink-0  h-8 px-3 py-1.5 text-sm rounded snap-start cursor-pointer 
                                ${activeId === exp.tempId ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20'} 
                                hover:bg-[#2c6472] hover:text-white transition-all duration-200`}
                            >
                                {exp?.job_title}
                            </div>
                        ))}
                        <div
                            onClick={() => {
                                setFormData({
                                job_title: "",
                                company_name: "",
                                location: "",
                                start_date: "",
                                end_date: "",
                                key_responsibilities: "",
                                });
                                setActiveId(null); // clear editing mode
                            }}
                            className="flex items-center justify-center flex-shrink-0 h-8 w-8 p-3 rounded snap-start cursor-pointer 
                                bg-gray-500/20 text-[#2c6472] text-2xl hover:bg-gray-900/20 transition-all duration-200"
                            >
                            +
                        </div>                        
                    </div>
                )}

                <div className="form-fields flex flex-col gap-4">
                    <div className="flex flex-col w-full gap-2">
                        <label htmlFor="job_title" className='text-[15px] text-gray-500'>Job Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleChange}
                            required
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                        />
                    </div>

                    <div className='flex gap-4'>
                        <div className="flex flex-col w-1/2 gap-2">
                            <label htmlFor="company_name" className='text-[15px] text-gray-500'>Company Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                required
                                className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                            />
                        </div>

                        <div className="flex flex-col w-1/2 gap-2">
                            <label htmlFor="location" className='text-[15px] text-gray-500'>Location <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                            />
                        </div>
                    </div>

                    <div className='flex gap-4'>
                        <div className="flex flex-col w-1/2 gap-2">
                            <label htmlFor="start_date" className='text-[15px] text-gray-500'>Start Date <span className="text-red-500">*</span></label>
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

                        <div className="flex flex-col w-1/2 gap-2">
                            <label htmlFor="end_date" className='text-[15px] text-gray-500'>End Date</label>
                            <Calendar
                                selectedDate={formData.end_date ? new Date(formData.end_date) : null}
                                onDateChange={(date) =>
                                    setFormData((prev) => ({
                                    ...prev,
                                    end_date: format(date, 'yyyy-MM-dd'),
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <label htmlFor="key_responsibilities" className='text-[15px] text-gray-500'>Key Responsibilities <span className="text-red-500">*</span></label>
                        <textarea
                            name="key_responsibilities"
                            value={formData.key_responsibilities}
                            onChange={handleChange}
                            required
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                        />  
                    </div>

                    <div className="flex justify-between w-full mt-2">
                        <button onClick={activeId === null ? handleAddExperience : null}
                            disabled={activeId !== null}
                            className={`text-sm ${activeId !== null ? 'text-gray-500/60 cursor-not-allowed' : 'text-[#2c6472]'} font-medium hover:scale-95`}>
                                + Add More Experience
                        </button>
                        <button onClick={activeId !== null ? handleDeleteExperience : null}
                            disabled={activeId === null}
                            className={`text-sm flex ${activeId !== null ? 'text-red-500' : 'text-gray-500/60 cursor-not-allowed'} font-medium hover:scale-95`}>
                            <img src={trash} alt="trash icon" className="w-4 h-3.5 mt-0.5 me-1 object-contain" />
                            Remove
                        </button>
                    </div>

                    <div className='flex justify-center items-center gap-4 mt-3'>
                        <button
                            className={` ${activeId !== null ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20 cursor-not-allowed'} w-32 text-sm px-2 py-2 rounded-xl hover:scale-95 transition`}
                            onClick={activeId !== null ? handleSave : null}
                            disabled={activeId === null}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkExpUpdateForm;
