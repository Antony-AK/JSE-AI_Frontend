import React, { useState } from 'react'
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



    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;

        setFormData((prev) => {
            const updatedForm = {
                ...prev,
                [id]: type === 'checkbox' ? checked : value,
            };

            if (type === 'checkbox' && id === 'currentstudy' && checked) {
                updatedForm.enddate = ''; // clear end date if currently studying
            }

            return updatedForm;
        });

        // Clear relevant errors
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };

            // Always clear the error of the field being edited
            delete updatedErrors[id];

            // Special case: clear enddate error if checkbox is checked
            if (id === 'currentstudy' && checked) {
                delete updatedErrors.enddate;
            }

            return updatedErrors;
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.institution.trim()) newErrors.institution = "Institution is required";
        if (!formData.city.trim()) newErrors.city = "City / Country is required";
        if (!formData.degree.trim()) newErrors.degree = "Degree is required";
        if (!formData.field_of_study.trim()) newErrors.field_of_study = "Field of Study is required";
        if (!formData.start_date) newErrors.start_date = "Start Date is required";

        // Only validate end date if not currently studying
        if (!formData.currentstudy && !formData.enddate) {
            newErrors.enddate = "End Date is required";
        }

        const start = new Date(formData.start_date);
        const end = new Date(formData.enddate);
        const today = new Date();

        // Validate start date
        if (!formData.start_date) {
            newErrors.start_date = "Start date is required.";
        }

        // Validate end date
        if (!formData.currentstudy) {
            if (!formData.enddate) {
                newErrors.enddate = "End date is required.";
            } else if (start > end) {
                newErrors.enddate = "End date cannot be before start date.";
            }
        } else {
            // Optional: prevent selecting future start date for ongoing studies
            if (start > today) {
                newErrors.start_date = "Start date cannot be after current date.";
            }
        }

        return newErrors;
    };

    const handleSubmit = async (navigateNext = false) => {
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                if (!token) {
                    navigate('/user/login');
                    toast.error("No User found. Please log in.");
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

                const response = await axios.post(apiUrl, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });




                if (navigateNext) {
                    navigate('/user/onboarding/projects');
                    window.scrollTo({ top: 0, behavior: 'auto' });

                } else {

                    setAddedCompanies((prev) => [...prev, formData.field_of_study]);

                    // Reset form after adding
                    setFormData({
                        institution: '',
                        city: '',
                        degree: '',
                        field_of_study: '',
                        start_date: '',
                        enddate: '',
                        currentstudy: false,
                        description: ''
                    });
                    window.scrollTo({ top: 0, behavior: 'auto' });

                    setErrors({});
                }
            } catch (error) {
                console.error("❌ API Error:", error.response?.data || error.message);
                toast.error(error.response?.data.issue || "Submission failed. Please try again.");
            }
        }
    };

    return (
        <div className='p-10 pt-2 flex flex-col gap-5 w-[100%] min-h-screen overflow-y-auto'>

            {addedCompanies.length > 0 && (
                <div className="flex justify-end items-center w-[95%]">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/user/onboarding/projects')}>
                        <p className='ml-2 text-lg font-medium text-[#00000057]'>Skip</p>
                    </div>
                </div>
            )}




            <p className='text-[#2c6472] font-semibold '>STEP 3 OF 8</p>

            <h2 className='font-bold text-xl'>Add your academic story.</h2>

            {addedCompanies.length > 0 && (
                <div className="px-6 py-4 -m-3 w-[90%] rounded-lg overflow-x-auto hide-scrollbar">
                    <ul className="flex gap-3">
                        {addedCompanies.map((company, index) => (
                            <li
                                key={index}
                                className="bg-gray-500/30 px-4 py-2 rounded-lg h-10 flex items-center justify-center font-semibold text-[#2c6472] whitespace-nowrap flex-shrink-0"
                            >
                                {company}
                            </li>
                        ))}
                    </ul>
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