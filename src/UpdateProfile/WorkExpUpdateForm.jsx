import React, { useState, useEffect, useCallback } from 'react';
import trash from "../assets/trash2.png";
import axios from "axios";

const WorkExpUpdateForm = ({ onclose }) => {

    const apiUrl = "https://jse.arshan.digital/b1/work-experience";
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        job_title: "",
        company_name: "",
        employment_type: "",
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
            const date = new Date(dateString);
            // Format to YYYY-MM-DD, or adjust to the format your backend expects
            return date.toISOString().split('T')[0];
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
            alert(`✅ Work Experience uploaded successfully`);
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
            alert("Please fill all required fields!");
            return;
        }
        setLoading(true);
        await sendData();
        await fetchExperiences();
        setFormData({
            job_title: "",
            company_name: "",
            employment_type: "",
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
            employment_type: exp.employment_type || "",
            start_date: exp.start_date?.time?.split("T")[0] || "",
            end_date: exp.end_date?.time?.split("T")[0] || "",
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
        // Create the updated experience object from the form data
        const updatedExperience = {
            job_title: formData.job_title,
            company_name: formData.company_name,
            employment_type: formData.employment_type,
            start_date: formData.start_date,
            ...(formData.end_date && { end_date: formData.end_date }),
            key_responsibilities: formData.key_responsibilities
        };


        // Get the experience object that was selected (using tempId as the identifier)
        const selectedExperience = experiences.find(exp => exp.tempId === activeId);

        if (!selectedExperience) {
            return alert("Selected experience not found.");
        }

        const experienceIndex = selectedExperience.tempId;  // tempId is used as the index here

        try {
            // Send the PUT request for the specific experience using the tempId in the URL
            const res = await axios.put(`${apiUrl}/${experienceIndex}`, updatedExperience, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",

                },
            });
     

            if (res.status === 200) {
                // After successful update, update the local state with the updated experience
                const updatedList = experiences.map(exp =>
                    exp.tempId === experienceIndex ? { ...exp, ...updatedExperience } : exp
                );
                setExperiences(updatedList);

                alert("✅ Work experience updated successfully!");
            } else {
                alert("❌ Failed to update work experience.");
            }

        } catch (error) {
            console.error("Update failed:", error);
            alert("❌ Error while updating work experience.");
        }
    };

    const handleDeleteExperience = async () => {
        if (!activeId) return alert("Please select an experience to delete!");

        const selectedExperience = experiences.find(exp => exp.tempId === activeId);
        if (!selectedExperience) return;
        try {
            await axios.delete(`${apiUrl}/${selectedExperience.tempId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("✅ Experience deleted!");
            await fetchExperiences();
            setFormData({
                job_title: "",
                company_name: "",
                employment_type: "",
                start_date: "",
                end_date: "",
                key_responsibilities: ""
            });
            setActiveId(null);
        } catch (err) {
            console.error("Delete failed", err);
            alert("❌ Failed to delete.");
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
                            <label htmlFor="employment_type" className='text-[15px] text-gray-500'>Employee Type <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="employment_type"
                                value={formData.employment_type}
                                onChange={handleChange}
                                required
                                className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                            />
                        </div>
                    </div>

                    <div className='flex gap-4'>
                        <div className="flex flex-col w-1/2 gap-2">
                            <label htmlFor="start_date" className='text-[15px] text-gray-500'>Start Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                            />
                        </div>

                        <div className="flex flex-col w-1/2 gap-2">
                            <label htmlFor="end_date" className='text-[15px] text-gray-500'>End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className='border border-gray-500/30 px-4 py-2 rounded outline-none'
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
                            className={`text-sm ${activeId !== null ? 'text-gray-500/60 cursor-not-allowed' : 'text-[#2c6472]'} font-medium hover:scale-95`}>+ Add More Experience</button>
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
