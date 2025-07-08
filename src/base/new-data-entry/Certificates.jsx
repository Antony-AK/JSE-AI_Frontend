import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import right_arrow from '../../assets/left-arrow.png'
import { BASE_URL } from '../../utils/api';
import Calendar from '../Calender/Calender';
import { format } from 'date-fns';
import warning from "../../assets/carbon_warning.png"



const Certificates = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        certificate_name: '',
        certificate_type: '',
        provider: '',
        completion_date: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [addedCompanies, setAddedCompanies] = useState([]);
    const [certificateList, setCertificateList] = useState([]);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
  const stored = sessionStorage.getItem("extractedResume");
  if (stored) {
    const parsed = JSON.parse(stored)?.data;
    const firstCert = parsed?.certifications?.[0]; // Only first

    if (firstCert) {
      const filledCert = {
        id: Date.now(),
        certificate_name: firstCert.certificate_name || '',
        certificate_type: '', // default blank unless you want to auto-detect
        provider: firstCert.platform || '',
        completion_date: firstCert.end_date || '',
      };

      setFormData(filledCert);       // 👈 populate only formData
      setActiveId(filledCert.id);    // 👈 for future reference
      setCertificateList([]);        // ❌ don't populate the card list from SS
    }
  }
}, []);






    const handleSelectCertificate = (cert) => {
        setFormData(cert);
        setActiveId(cert.id);
        setErrors({});
    };






    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.certificate_name.trim()) newErrors.certificate_name = 'Certificate name is required';
        if (!formData.certificate_type.trim()) newErrors.certificate_type = 'Certificate type is required';
        if (!formData.completion_date.trim()) newErrors.completion_date = 'Completion date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleAddCertificate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const token = sessionStorage.getItem('authToken');
        if (!token) {
            navigate('/user/login');
            toast.error("User not found. Please log in.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                certificate_name: formData.certificate_name,
                certificate_type: formData.certificate_type,
                provider: formData.provider,
                completion_date: new Date(formData.completion_date).toISOString(),
            };

            const response = await fetch(`${BASE_URL}/certificates`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Upload failed");
            }

            const updatedList = certificateList.map((c) =>
                c.id === activeId ? { ...c, ...formData } : c
            );

            const found = certificateList.some((c) => c.id === activeId);
            const finalList = found
                ? updatedList
                : [...certificateList, { ...formData, id: Date.now() }];

            setCertificateList(finalList);
            setFormData({
                certificate_name: '',
                certificate_type: '',
                provider: '',
                completion_date: '',
            });
            setActiveId(null);
            setErrors({});

        } catch (error) {
            console.error("Error uploading certificate:", error);
            toast.error("Failed to upload certificate." + error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleNext = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const token = sessionStorage.getItem('authToken');
        if (!token) {
            navigate('/user/login');
            toast.error('User not found. Please log in');
            return;
        }


        completion_date: new Date(formData.completion_date).toISOString()


        setLoading(true);
        try {
            const payload = {
                certificate_name: formData.certificate_name,
                certificate_type: formData.certificate_type,
                provider: formData.provider,
                completion_date: new Date(formData.completion_date).toISOString(),
            };




            const response = await fetch(`${BASE_URL}/certificates`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // ✅ No need to set Content-Type for FormData
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Upload failed");
            }

            setFormData({
                certificate_name: '',
                certificate_type: '',
                provider: '',
                completion_date: '',
            });



            navigate('/user/onboarding/jobtitles');

        } catch (error) {
            console.error("Error uploading certificate:", error);
            toast.error("Failed to upload certificate. \n\n" + error.issue);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className='w-full  p-5 ml-5  text-black'>
            <div className="flex flex-col">
                <div className='flex w-full justify-end items-center'>


                    <div className="flex items-center cursor-pointer hover:scale-95 transition-transform duration-200 ease-in-out" onClick={() => navigate('/user/onboarding/jobtitles')}>
                        <p className='me-10  text-lg font-medium text-[#00000057]'>Skip</p>
                    </div>
                </div>

                <div>
                    <p className=' flex font-semibold text-[#2c6472] -mt-8'>STEP 6 OF 8</p>
                </div>

                <div>
                    <h1 className='text-2xl font-semibold mt-3 mb-4'>List your certificates / Awards.</h1>
                </div>

                {certificateList.length > 0 && (
                    <div className="flex gap-3 px-6 py-4 -m-3 w-[90%] rounded-lg overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                        {certificateList
                            .filter((cert) => cert.certificate_name.trim() !== '')
                            .map((cert) => (
                                <div
                                    key={cert.id}
                                    onClick={() => handleSelectCertificate(cert)}
                                    className={`flex-shrink-0 w-[200px] px-4 py-3 rounded-xl snap-start cursor-pointer 
            text-sm flex flex-col items-start justify-center gap-1 font-semibold whitespace-nowrap transition-all duration-200
            ${activeId === cert.id ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20 text-[#2c6472]'}
            hover:bg-[#2c6472] hover:text-white`}
                                >
                                    <p className="text-base font-bold truncate w-full">{cert.certificate_name}</p>
                                    <p className="text-xs font-medium opacity-90 truncate w-full">{cert.provider || 'No Company'}</p>
                                </div>
                            ))}
                    </div>
                )}



                <form className="flex flex-col gap-3 mt-5 ms-6" onSubmit={handleAddCertificate}>
                    {/* Certificate Name */}
                    <div className="mb-4">
                        <label className="block font-medium text-lg">Certificate Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="certificate_name"
                            value={formData.certificate_name}
                            onChange={handleChange}
                            className={`w-[70%] px-4 py-4 flex border rounded-lg ${errors.certificate_name ? 'border-red-500 animate-shake' : 'border-gray-300'}`}
                        />
                        {errors.certificate_name && <span className="text-red-500 text-sm">{errors.certificate_name}</span>}
                    </div>

                    {/* Certificate Type Dropdown */}
                    <div className="mb-4">
                        <label className="block font-medium text-lg">Certificate Type <span className="text-red-500">*</span></label>
                        <select
                            name="certificate_type"
                            value={formData.certificate_type}
                            onChange={handleChange}
                            className={`
                             w-[70%] px-4 py-4 border rounded-lg text-gray-700
                             transition-all duration-200 ease-in-out z-10 flex
                             ${errors.certificate_type ? 'border-red-500 animate-shake' : 'border-gray-300 focus:border-[#2c6472]'}
                            bg-white  
                             cursor-pointer outline-none
                           `}
                        >
                            <option value="" disabled className="text-gray-400 bg-white">Select Type</option>
                            <option value="certification" className="bg-white">Certification</option>
                            <option value="participation" className="bg-white">Participation</option>
                            <option value="completion" className="bg-white">Completion</option>
                        </select>

                        {errors.certificate_type && <span className="text-red-500 text-sm">{errors.certificate_type}</span>}
                    </div>

                    {/* Provider */}
                    <div className="mb-4">
                        <label className="block font-medium text-lg">Company</label>
                        <input
                            type="text"
                            name="provider"
                            value={formData.provider}
                            onChange={handleChange}
                            className={`w-[70%] px-4 py-4 border rounded-lg ${errors.provider ? 'border-red-500 animate-shake' : 'border-gray-300'}`}
                        />
                        {errors.provider && <span className="text-red-500 text-sm">{errors.provider}</span>}
                    </div>

                    {/* Completion Date */}
                    <div className="mb-4 w-[70%]">
                        <label className="block font-medium text-lg">
                            Completion Date <span className="text-red-500">*</span>
                        </label>

                        <Calendar
                            selectedDate={formData.completion_date ? new Date(formData.completion_date) : null}
                            onDateChange={(date) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    completion_date: format(date, 'yyyy-MM-dd'),
                                }))
                            }
                        />

                        {errors.completion_date && (
                            <span className="text-red-500 text-sm">{errors.completion_date}</span>
                        )}
                    </div>

                    <div className='text-xs flex items-center justify-start text-center  '><p><span className='font-medium'>Please note:</span><span className='text-[#2c6472] ms-1'>Enter your details carefully , you can  only edit them later.</span></p></div>




                    {/* Buttons */}
                    <div className="flex w-[70%]  justify-between items-center gap-4 mt-4 mb-10">
                        <button
                            type="submit"
                            className=" py-2 w-[180px] bg-white text-[#2c6472]  h-[43px]  font-semibold cursor-pointer mt-1 hover:scale-95 transition-transform duration-200 ease-in-out"
                        >
                            +Add Another
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={loading}
                            className={`teal-button px-6 py-2 h-[40px] rounded-xl focus:outline-none transition-transform duration-200 ease-in-out
                                flex items-center justify-center
                                ${loading ? 'bg-[#2c6472]/70 cursor-not-allowed' : 'bg-[#2c6472]'} text-white w-[150px]`}
                            >
                            {loading ? (
                                <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Save & Next'
                            )}
                        </button>
                    </div>

                </form>


            </div>

            {showSavePopup && (
                <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 bg-white border-b-4 border-[#2C6472] text-black rounded-md shadow-lg transform transition-all duration-500 ease-in-out animate-toast-in`}>
                    <div className="relative px-3 py-1">
                        <span>✅ Certificates saved successfully!</span>
                        <div className="absolute bottom-0 left-0 h-[3px] bg-white animate-progress w-full" />
                    </div>
                </div>
            )}

            <div className="flex justify-start gap-2 text-[#2c6472] font-medium text-sm mt-8">
                <img src={warning} className="w-5 ms-5 h-5 object-cover" alt="" />
                AI is not perfect. Make sure your data is accurate before saving.            </div>
        </div>
    )
}

export default Certificates
