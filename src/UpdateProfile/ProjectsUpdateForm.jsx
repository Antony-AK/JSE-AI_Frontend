import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import trash from "../assets/trash2.png";
import { toast } from 'react-toastify';

const ProjectUpdateForm = ({ onClose }) => {
    const token = sessionStorage.getItem('authToken');
    const apiUrl = `${BASE_URL}/pastprojects`;

    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        project_name: '',
        institution: '',
        start_date: '',
        end_date: '',
        currentdo: false,
        project_description: ''
    });

    const [errors, setErrors] = useState({});
    const [activeId, setActiveId] = useState(null);

    const fetchProjects = useCallback(async () => {
        try {
            const res = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = Array.isArray(res.data)
                ? res.data
                : res.data?.past_projects || [];

            const projectsWithId = data.map((proj, index) => ({
                ...proj,
                tempId: index + 1
            }));
            setProjects(projectsWithId);
        } catch (error) {
            toast.error("Failed to fetch projects");
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            console.warn("⚠️ No auth token found. Cannot fetch projects.");
            return;
        }
        fetchProjects();
    }, [token, fetchProjects]);


    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData((prev) => {
            const updated = {
                ...prev,
                [id]: type === 'checkbox' ? checked : value,
            };
            if (id === 'currentdo' && checked) updated.end_date = '';
            return updated;
        });

        setErrors((prev) => {
            const updated = { ...prev };
            delete updated[id];
            if (id === 'currentdo' && checked) delete updated.end_date;
            return updated;
        });
    };

    const handleSubmit = async (navigateNext = false) => {
        if (validate()) {
            try {
                if (!token) {
                    navigate('/user/login');
                    toast.error("User not found. Please log in.");
                    return;
                }

                const toISOString = (date) => date ? new Date(date).toISOString() : null;

                const payload = {
                    project_name: formData.project_name,
                    institution: formData.institution,
                    start_date: toISOString(formData.start_date),
                    end_date: formData.currentdo ? null : toISOString(formData.end_date),
                    currently_doing: formData.currentdo,
                    project_description: formData.project_description,
                };

                const response = await axios.post(apiUrl, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });




                await fetchProjects(); // 👈 to refresh the tab list too


                // Reset form
                setFormData({
                    project_name: '',
                    institution: '',
                    start_date: '',
                    end_date: '',
                    currentdo: false,
                    project_description: ''
                });
                toast.success(" Project added successfully!");
                setErrors({});

            } catch (error) {
                console.error(" API Error:", error.response?.data || error.message);
                toast.error(error.response?.data.issue || "Submission failed. Please try again.");
            }
        }
    };

    const handleSelectProject = (project) => {
        setFormData({
            project_name: project.project_name || '',
            institution: project.institution || '',
            start_date: project.start_date?.split('T')[0] || '',
            end_date: project.end_date?.split('T')[0] || '',
            currentdo: project.currently_doing || false,
            project_description: project.project_description || ''
        });
        setActiveId(project.tempId);
    };

    const validate = () => {
        const newErrors = {};
        const start = new Date(formData.start_date);
        const end = new Date(formData.end_date);
        const today = new Date();

        if (!formData.project_name.trim()) newErrors.project_name = "Project name is required";
        if (!formData.start_date) newErrors.start_date = "Start date is required";

        if (!formData.currentdo) {
            if (!formData.end_date) {
                newErrors.end_date = "End date is required";
            } else if (start > end) {
                newErrors.end_date = "End date cannot be before start date";
            }
        } else if (start > today) {
            newErrors.start_date = "Start date cannot be in the future";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async (e) => {
        e?.preventDefault(); // 🔒 Prevents page reload

        if (!validate()) return;

        const selected = projects.find(p => p.tempId === activeId);
        if (!selected) return toast.error("Project not found");

        try {
            const payload = {
                project_name: formData.project_name,
                institution: formData.institution,
                start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
                end_date: formData.currentdo || !formData.end_date ? null : new Date(formData.end_date).toISOString(),
                currently_doing: formData.currentdo,
                project_description: formData.project_description,
            };

            await axios.put(`${apiUrl}/${activeId}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedProject = {
                ...selected,
                ...payload,
            };

            setProjects((prev) =>
                prev.map((p) => (p.tempId === activeId ? updatedProject : p))
            );

            toast.success(" Project updated!");
            setActiveId(null);
            setFormData({
                project_name: '',
                institution: '',
                start_date: '',
                end_date: '',
                currentdo: false,
                project_description: ''
            });
        } catch (error) {
            console.error("Update Error:", error);
            toast.error(" Failed to update project");
        }
    };


    const handleDelete = async () => {
        try {
            await axios.delete(`${apiUrl}/${activeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(" Project deleted");
            setActiveId(null);
            setFormData({
                project_name: '',
                institution: '',
                start_date: '',
                end_date: '',
                currentdo: false,
                project_description: ''
            });
            await fetchProjects();
        } catch (error) {
            toast.error(" Failed to delete project");
        }
    };

    return (
        <div className='fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center'>
            <div className='w-[700px] h-[640px] bg-white shadow rounded-xl px-10 py-5 overflow-y-auto hide-scrollbar'>
                <div className='flex justify-between mb-6'>
                    <h3 className='text-xl font-semibold'>Update Projects</h3>
                    <p onClick={onClose} className='text-lg font-semibold cursor-pointer hover:scale-95'>X</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-5 overflow-x-auto hide-scrollbar mb-4">
                    {projects.map((proj) => (
                        <div
                            key={proj.tempId}
                            onClick={() => handleSelectProject(proj)}
                            className={`text-sm px-4 py-2 rounded-md cursor-pointer ${activeId === proj.tempId ? 'bg-[#2c6472] text-white' : 'bg-gray-300'} hover:bg-[#2c6472] hover:text-white`}
                        >
                            {proj.project_name}
                        </div>
                    ))}
                </div>

                {/* Form Fields */}
                <form className='flex flex-col gap-4'>
                    {/* Name */}
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm'>Project Name <span className='text-red-500'>*</span></label>
                        <input
                            id="project_name"
                            value={formData.project_name}
                            onChange={handleChange}
                            className={`px-4 py-3 border ${errors.project_name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c6472]`}
                        />
                    </div>

                    {/* Institution */}
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm'>University / Company</label>
                        <input
                            id="institution"
                            value={formData.institution}
                            onChange={handleChange}
                            className='px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c6472]'
                        />
                    </div>

                    {/* Dates */}
                    <div className='flex gap-5'>
                        <div className='flex flex-col w-1/2'>
                            <label className='text-sm'>Start Date <span className='text-red-500'>*</span></label>
                            <input
                                type="date"
                                id="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className={`px-4 py-3 border ${errors.start_date ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c6472]`}
                            />
                            {errors.start_date && <p className='text-red-500 text-xs'>{errors.start_date}</p>}
                        </div>

                        <div className='flex flex-col w-1/2'>
                            <label className='text-sm'>End Date {!formData.currentdo && <span className='text-red-500'>*</span>}</label>
                            <input
                                type="date"
                                id="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                disabled={formData.currentdo}
                                className={`px-4 py-3 border ${errors.end_date ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c6472]`}
                            />
                            {errors.end_date && <p className='text-red-500 text-xs'>{errors.end_date}</p>}
                        </div>
                    </div>

                    {/* Currently doing */}
                    <div className='flex items-center gap-3'>
                        <input
                            type="checkbox"
                            id="currentdo"
                            checked={formData.currentdo}
                            onChange={handleChange}
                            className='w-4 h-4 accent-[#2c6472]'
                        />
                        <label htmlFor="currentdo" className='text-sm'>I currently do this</label>
                    </div>

                    {/* Description */}
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm'>Project Description</label>
                        <textarea
                            id="project_description"
                            value={formData.project_description}
                            onChange={handleChange}
                            rows={3}
                            className='px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c6472] resize-none'
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className='flex justify-between mt-4'>

                        <button
                            type="button"
                            onClick={() => handleSubmit(false)}
                            className='text-sm text-[#2C6472] font-medium hover:scale-95 disabled:text-gray-400 disabled:cursor-not-allowed'
                        >
                            + Add Another
                        </button>
                        <button
                            type='button'
                            onClick={handleDelete}
                            disabled={!activeId}
                            className={`flex items-center text-sm ${!activeId ? 'text-gray-400 cursor-not-allowed' : 'text-red-500'} font-medium hover:scale-95`}
                        >
                            <img src={trash} alt="delete" className='w-4 h-4 mr-1' />
                            Remove
                        </button>


                    </div>

                    <div className='flex justify-center items-center gap-4 mt-3'>
                        <button
                            onClick={(e) => activeId !== null && handleUpdate(e)}
                            disabled={activeId === null}
                            className={` ${activeId !== null ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20 cursor-not-allowed'} w-32 text-sm px-2 py-2 rounded-xl mb-2 hover:scale-95 transition`}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectUpdateForm;
