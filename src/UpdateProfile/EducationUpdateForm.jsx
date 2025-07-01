import React, { useState, useEffect, useCallback } from 'react'
import trash from "../assets/trash2.png"
import axios from 'axios';
import { toast } from 'react-toastify';

const EducationUpdateForm = ({ onclose }) => {
    const apiUrl = 'https://dev.arshan.digital/b1/academics';
    const [education, setEducation] = useState([]);
    const token = sessionStorage.getItem('authToken');



    const [formData, setFormData] = useState({
        degree: '',
        institution: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        achievements: ''
    });

    const handleAddEducation = async () => {
        if (!token) {
            console.error('Error: No token found in session storage.');
            return;
        }

        const formatDateToISO = (date) => {
            const localDate = new Date(date);
            return isNaN(localDate.getTime()) ? null : localDate.toISOString(); // Keep full ISO
        };        

        const updatedFormData = {
            ...formData,
            start_date: formatDateToISO(formData.start_date),
            end_date: formData.end_date ? formatDateToISO(formData.end_date) : null,
        };        

        try {
            const response = await axios.post(apiUrl, updatedFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success(`Education data uploaded successfully`);

            // Clear form
            setFormData({
                degree: '',
                institution: '',
                field_of_study: '',
                start_date: '',
                end_date: '',
                achievements: ''
            });

            await fetchEducations();

        } catch (error) {
            console.error('Error uploading data:', error);
            if (error.response) {
                console.error('API Response:', error.response.data);
            }
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
            achievements: edu.achievements || ""
        });
        setActiveId(edu.tempId);
    };


    //Save Changes
    const handleSave = async () => {

        const formatDateToFullISO = (date) => {
            return date ? new Date(date).toISOString() : null;
        };

        // Create the updated experience object from the form data
        const updatedExperience = {
            degree: formData.degree,
            institution: formData.institution,
            field_of_study: formData.field_of_study,
            start_date: formatDateToFullISO(formData.start_date),
            end_date: formData.end_date ? formatDateToFullISO(formData.end_date) : null,
            achievements: formData.achievements
        };
        

        // Get the experience object that was selected (using tempId as the identifier)
        const selectedEducation = education.find(edu => edu.tempId === activeId);

        if (!selectedEducation) {
            return alert("Selected experience not found.");
        }

        const educationIndex = selectedEducation.tempId;  // tempId is used as the index here

        try {
            // Send the PUT request for the specific experience using the tempId in the URL
            const res = await axios.put(`${apiUrl}/${educationIndex}`, updatedExperience, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",

                },
            });
     

            if (res.status === 200) {
                // After successful update, update the local state with the updated experience
                const updatedList = education.map(edu =>
                    edu.tempId === educationIndex ? { ...edu, ...updatedExperience } : edu
                );
                setEducation(updatedList);
                toast.success("Education updated successfully!");
            } else {
                alert("❌ Failed to Education.");
            }

        } catch (error) {
            console.error("Update failed:", error);
            alert("❌ Error while updating work experience.");
        }
    };

    const handleDeleteEducation = async () => {
        if (!activeId) return alert("Please select an experience to delete!");

        const selectedEducation = education.find(edu => edu.tempId === activeId);
        if (!selectedEducation) return;
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
            alert("❌ Failed to delete.");
        }
    };





    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    return (

        <div className='fixed inset-0 overflow-y-auto bg-white bg-opacity-70 z-50 flex items-center justify-center p-10 trasnfrom ease-in-out duration-200'>
            <div className='w-full max-w-[700px] mt-5  bg-white flex flex-col shadow rounded-xl px-10 py-5 ' >

                <div className="flex justify-between w-full mt-3 mb-7">
                    <h3 className='text-lg font-semibold'>Education</h3>
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
                        <label htmlFor="degree" className='text-[15px] text-gray-500'>Degree Title  <span className="text-red-500">*</span></label>
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
                            <label htmlFor="institution" className='text-[15px] text-gray-500' >Institution Name  <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="institution"
                                onChange={handleChange}
                                value={formData.institution}
                                required
                                className='border border-gray-500/30 px-4 py-2 rounded outline-none' />
                        </div>

                        <div className="flex flex-col w-1/2 gap-3">
                            <label htmlFor="field_of_study" className='text-[15px] text-gray-500' >Field of Study  <span className="text-red-500">*</span></label>
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
                            <label htmlFor="start_date" className='text-[15px] text-gray-500' >Start Date  <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="start_date"
                                onChange={handleChange}
                                value={formData.start_date}
                                className='border border-gray-500/30 px-4 py-2 rounded outline-none' />
                        </div>

                        <div className="flex flex-col w-1/2 gap-3">
                            <label htmlFor="end_date" className='text-[15px] text-gray-500'>End Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="end_date"
                                onChange={handleChange}
                                value={formData.end_date}
                                className='border border-gray-500/30 px-4 py-2 rounded outline-none' />
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-4">
                        <label htmlFor="achievements" className='text-[15px] text-gray-500'>Achivements  <span className="text-red-500">*</span></label>
                        <textarea
                            name="achievements"
                            onChange={handleChange}
                            required
                            value={formData.achievements} className='border border-gray-500/30 px-4 py-2 rounded outline-none' />
                    </div>

                    <div className="flex justify-between w-full mt-2">
                        <button onClick={activeId === null ? handleAddEducation : null}
                        disabled={activeId !== null}
                         className={`text-sm ${activeId !== null ? 'text-gray-500/60 cursor-not-allowed' : 'text-[#2c6472]'} font-medium hover:scale-95`}>+ Add Education</button>
                        <button
                            onClick={activeId !== null ? handleDeleteEducation : null}
                            disabled={activeId === null}
                            className={`text-sm flex ${activeId !== null ? 'text-red-500 ' : 'text-gray-500/60 cursor-not-allowed'} font-medium hover:scale-95`}>
                            <img src={trash} alt="trash icon" className="w-4 h-3.5 mt-0.5 text-red-500 me-1 object-contain " />
                            Remove</button>
                    </div>

                    <div className='flex justify-center items-center gap-4 mt-3'>
                        <button onClick={activeId !== null ? handleSave : null}
                            disabled={activeId === null}
                            className={` ${activeId !== null ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20 cursor-not-allowed'} w-32 text-sm px-2 py-2 rounded-xl mb-2 hover:scale-95 transition`}
                        >
                            Save Changes
                        </button>
                    </div>

                </div>
            </div>

        </div>

    )
}

export default EducationUpdateForm
