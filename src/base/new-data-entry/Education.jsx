import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/api'
import Calendar from '../Calender/Calender';
import { format } from 'date-fns';
import warning from "../../assets/carbon_warning.png"


const Education = () => {

    const navigate = useNavigate();

    const apiUrl = `${BASE_URL}/academics`;

    const token = sessionStorage.getItem('authToken');

    const [formData, setFormData] = useState({
        tempId: Date.now(),
        institution: '',
        city: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        enddate: '',
        currentstudy: false,
        description: ''
    });

    const [errors, setErrors] = useState({});
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [addedCompanies, setAddedCompanies] = useState([]);
    const [educationList, setEducationList] = useState([]);
    const [activeId, setActiveId] = useState(null);



    useEffect(() => {
        const stored = sessionStorage.getItem("extractedResume");
        if (stored) {
            const parsed = JSON.parse(stored)?.data;
            const edu = parsed?.education || [];

            const eduWithIds = edu.map((item, idx) => ({
                tempId: Date.now() + idx,
                institution: item.institution || '',
                city: item.city || '',
                degree: item.degree || '',
                field_of_study: item.field_of_study || '',
                start_date: item.start_date || '',
                enddate: item.currentstudy === "true" ? '' : item.end_date || '',
                currentstudy: item.currentstudy === "true",
                description: item.description || '',
            }));

            if (eduWithIds.length > 0) {
                setEducationList(eduWithIds);
                setFormData(eduWithIds[0]);
                setActiveId(eduWithIds[0].tempId);
            }
        }
    }, []);

    const handleSelect = (edu) => {
        setFormData(edu);
        setActiveId(edu.tempId);
        setErrors({});
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;

        setFormData((prev) => {
            const updated = {
                ...prev,
                [id]: type === 'checkbox' ? checked : value,
            };
            if (id === 'currentstudy' && checked) {
                updated.enddate = '';
            }
            return updated;
        });

        setErrors((prev) => {
            const updatedErrors = { ...prev };
            delete updatedErrors[id];
            if (id === 'currentstudy' && checked) {
                delete updatedErrors['enddate'];
            }
            return updatedErrors;
        });
    };

    const validate = () => {
        const newErrors = {};
        const { institution, city, degree, field_of_study, start_date, enddate, currentstudy } = formData;

        if (!institution.trim()) newErrors.institution = "Institution is required";
        if (!city.trim()) newErrors.city = "City / Country is required";
        if (!degree.trim()) newErrors.degree = "Degree is required";
        if (!field_of_study.trim()) newErrors.field_of_study = "Field of Study is required";
        if (!start_date) newErrors.start_date = "Start date is required";

        const start = new Date(start_date);
        const end = new Date(enddate);
        const today = new Date();

        if (!currentstudy) {
            if (!enddate) newErrors.enddate = "End date is required";
            else if (start > end) newErrors.enddate = "End date cannot be before start date";
        } else {
            if (start > today) newErrors.start_date = "Start date cannot be after today";
        }

        return newErrors;
    };

    const handleSubmit = async (navigateNext = false) => {
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            if (!token) {
                navigate('/user/login');
                toast.error("Please log in first.");
                return;
            }

            const toISOString = (date) => date ? new Date(date).toISOString() : null;

            const payload = {
                institution: formData.institution,
                city: formData.city,
                degree: formData.degree,
                field_of_study: formData.field_of_study,
                start_date: toISOString(formData.start_date),
                end_date: formData.currentstudy ? null : toISOString(formData.enddate),
                currently_studying: formData.currentstudy,
                description: formData.description,
            };

            await axios.post(apiUrl, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (navigateNext) {
                navigate('/user/onboarding/projects');
                window.scrollTo({ top: 0 });
                return;
            }

            // 🧠 Update the list in-place without adding a blank entry
            const updatedList = educationList.map((e) =>
                e.tempId === activeId ? { ...e, ...formData } : e
            );

            // If not found (new entry), push it
            const found = educationList.some((e) => e.tempId === activeId);
            let finalList;

            if (found) {
                finalList = updatedList;
            } else {
                const newEntry = { ...formData };
                finalList = [newEntry, ...educationList]; // 🔥 Add new one to the top!
            }

            setEducationList(finalList);
            setActiveId(null); // We'll reset this shortly


            // 🧼 Just clear the form
            setFormData({
                tempId: Date.now(),
                institution: '',
                city: '',
                degree: '',
                field_of_study: '',
                start_date: '',
                enddate: '',
                currentstudy: false,
                description: ''
            });

            const newTempId = Date.now();
            setFormData({
                tempId: newTempId,
                institution: '',
                city: '',
                degree: '',
                field_of_study: '',
                start_date: '',
                enddate: '',
                currentstudy: false,
                description: ''
            });
            setActiveId(newTempId); // 🪄 Make the new form active


            // 🪄 Don't update activeId so it doesn't select the cleared form
            setActiveId(null);

            setErrors({});
            window.scrollTo({ top: 0 });

        } catch (err) {
            console.error("❌ API Error:", err.response?.data || err.message);
            toast.error(err.response?.data?.issue || "Something went wrong!");
        }
    };



    return (
        <div className='p-10 pt-2 flex flex-col gap-5 w-[100%] min-h-screen overflow-y-auto'>


            {educationList.length > 0 && (
                <div className="flex justify-end items-center w-[95%]">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/user/onboarding/projects')}>
                        <p className='ml-2 text-lg font-medium text-[#00000057]'>Skip</p>
                    </div>
                </div>
            )}

            <p className='text-[#2c6472] font-semibold '>STEP 3 OF 8</p>

            <h2 className='font-bold text-xl'>Add your academic story.</h2>

            {educationList.length > 0 && (
                <div className="flex gap-3 px-6 py-4 -m-3 w-[90%] rounded-lg overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                    {educationList
                        .filter((edu) => edu.degree.trim() !== '') // ✅ Only show filled entries
                        .map((edu) => (
                            <div
                                key={edu.tempId}
                                onClick={() => handleSelect(edu)}
                                className={`flex-shrink-0 w-[200px] px-4 py-3 rounded-xl snap-start cursor-pointer 
              text-sm flex flex-col items-start justify-center gap-1 font-semibold whitespace-nowrap transition-all duration-200
              ${activeId === edu.tempId ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20 text-[#2c6472]'}
              hover:bg-[#2c6472] hover:text-white`}
                            >
                                <p className="text-base font-bold truncate w-full">{edu.degree}</p>
                                <p className="text-xs font-medium opacity-90 truncate w-full">{edu.institution || 'No Institute'}</p>
                            </div>
                        ))}
                </div>
            )}


            <form onSubmit={handleSubmit} className="p-5 pt-2 flex flex-col gap-5 w-[80%]">

                {/* Institution */}
                <div className="flex flex-col gap-2 text-lg">
                    <label className='font-medium' htmlFor="institution">School, University or Institution <span className='text-red-500'>*</span></label>
                    <input
                        className={`px-5 py-3 rounded-lg border ${errors.institution ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                        type="text"
                        id='institution'
                        value={formData.institution}
                        onChange={handleChange}
                    />
                    {errors.institution && <span className="text-red-500 text-sm">{errors.institution}</span>}
                </div>

                {/* City */}
                <div className="flex flex-col gap-2 text-lg">
                    <label className='font-medium' htmlFor="city">City / Country <span className='text-red-500'>*</span></label>
                    <input
                        className={`px-5 py-3 rounded-lg border ${errors.city ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                        type="text"
                        id='city'
                        value={formData.city}
                        onChange={handleChange}
                    />
                    {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
                </div>

                {/* Degree */}
                <div className="flex flex-col gap-2 text-lg">
                    <label className='font-medium' htmlFor="degree">Degree, Qualification, or Major <span className='text-red-500'>*</span></label>
                    <input
                        className={`px-5 py-3 rounded-lg border ${errors.degree ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                        type="text"
                        id='degree'
                        value={formData.degree}
                        onChange={handleChange}
                    />
                    {errors.degree && <span className="text-red-500 text-sm">{errors.degree}</span>}
                </div>

                {/* Field */}
                <div className="flex flex-col gap-2 text-lg">
                    <label className='font-medium' htmlFor="field_of_study">Field of Study <span className='text-red-500'>*</span></label>
                    <input
                        className={`px-5 py-3 rounded-lg border ${errors.field_of_study ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
                        type="text"
                        id='field_of_study'
                        value={formData.field_of_study}
                        onChange={handleChange}
                    />
                    {errors.field_of_study && <span className="text-red-500 text-sm">{errors.field_of_study}</span>}
                </div>

                {/* Start & End Date */}
                <div className="flex justify-start gap-10 text-lg w-full">
                    <div className="flex flex-col gap-2 w-[50%]">
                        <label className='font-medium' htmlFor="start_date">Start Date <span className='text-red-500'>*</span></label>
                        <Calendar
                            selectedDate={formData.start_date ? new Date(formData.start_date) : null}
                            onDateChange={(date) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    start_date: format(date, 'yyyy-MM-dd'),
                                }))
                            }
                        />

                        {errors.start_date && <span className="text-red-500 text-sm">{errors.start_date}</span>}
                    </div>
                    <div className="flex flex-col gap-2 w-[50%]">
                        <label className="font-medium" htmlFor="enddate">
                            End Date {!formData.currentstudy && <span className="text-red-500">*</span>}
                        </label>

                        {formData.currentstudy ? (
                            <input
                                disabled
                                type="text"
                                value=""
                                placeholder="Currently Studying"
                                className="w-full px-5 py-3 rounded-lg border border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                            />
                        ) : (
                            <Calendar
                                selectedDate={formData.enddate ? new Date(formData.enddate) : null}
                                onDateChange={(date) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        enddate: format(date, 'yyyy-MM-dd'),
                                    }))
                                }
                            />
                        )}

                        {errors.enddate && <span className="text-red-500 text-sm">{errors.enddate}</span>}
                    </div>

                </div>

                {/* currently Studies */}
                <div className="flex items-center gap-5">
                    <input
                        className='w-5 h-5 accent-[#2c6472] rounded-xl'
                        id='currentstudy'
                        type="checkbox"
                        checked={formData.currentstudy}
                        onChange={handleChange}
                    />
                    <label className='font-medium text-lg' htmlFor="currentstudy">I'm currently studying</label>
                </div>

                {/* Additional Description */}
                <div className="flex flex-col gap-2 text-lg">
                    <label className="font-medium" htmlFor="description">Additional Description <span className='text-[#0000009c]'>(Optional)</span></label>
                    <textarea
                        id="description"
                        className="px-5 py-3 rounded-lg border border-[rgba(0,0,0,0.14)] outline-none focus:border-[#2c6472] resize-none"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className='text-xs flex items-center justify-start text-center  '><p><span className='font-medium'>Please note:</span><span className='text-[#2c6472] ms-1'>Enter your details carefully , you can  only edit them later.</span></p></div>


                <div className="flex justify-between mt-7">
                    <div className="cursor-pointer" onClick={() => handleSubmit(false)}>
                        <p className='text-lg text-[#2C6472] font-semibold'>+ Add Another</p>
                    </div>
                    <button type="button" onClick={() => handleSubmit(true)} className='rounded-xl px-6 py-2 bg-[#2C6472] text-[#fff] mb-10'>Save & Next</button>
                </div>

            </form>

            {showSavePopup && (
                <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 bg-white border-b-4 border-[#2C6472] text-black rounded-md shadow-lg transform transition-all duration-500 ease-in-out animate-toast-in`}>
                    <div className="relative px-3 py-1">
                        <span>✅ Education saved successfully!</span>
                        <div className="absolute bottom-0 left-0 h-[3px] bg-white animate-progress w-full" />
                    </div>
                </div>
            )}

            {/* Footer appears after scrolling all content */}
            <div className="flex justify-start gap-2 text-gray-500 text-sm mt-10 ">
                <img src={warning} className="w-5 ms-5 h-5 object-cover" alt="" />
                AI is not perfect. Make sure your data is accurate before saving.
            </div>

        </div>
    )
}

export default Education