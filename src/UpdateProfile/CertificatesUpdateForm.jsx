import React, { useState, useEffect, useCallback } from 'react'
import trash from "../assets/trash2.png"
import axios from 'axios';


const CertificatesUpdateForm = ({ onclose }) => {
    const [certificateFile, setCertificateFile] = useState(null);
    const [selectedCertificateFileName, setSelectedCertificateFileName] = useState('');
    const [certificates, setCertificates] = useState([]);
    const [formData, setFormData] = useState({
        certificate_name: '',
        certificate_number: '',
    });
    const [loading, setLoading] = useState(false);

    const apiUrl = "https://jse.arshan.digital/b1/certificates";
    const token = sessionStorage.getItem('authToken');


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCertificateFile(file); // ✅ Save raw file directly
            setSelectedCertificateFileName(''); // Clear previously selected file name

        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCertificate = async (e) => {
        const token = sessionStorage.getItem('authToken'); // ✅ Moved to the top

        if (!token) {
            console.error('Error: No token found in session storage.');
            alert("You are not authenticated. Please login.");
            return;
        }

        if (!formData.certificate_name || !certificateFile) {
            alert('Please fill all fields and upload a certificate file.');
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("certificate_name", formData.certificate_name);
            formDataToSend.append("certificate_number", formData.certificate_number);
            formDataToSend.append("file", certificateFile);

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Upload failed");
            }

            alert(`✅ Certificates uploaded successfully`);
            setFormData({
                certificate_name: '',
                certificate_number: '',
            });
            setCertificateFile(null);

            await fetchCertificates();

        } catch (error) {
            console.error("Error uploading certificate:", error);
            alert("Failed to upload certificate.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCertificates = useCallback(async () => {


        try {
            const res = await axios.get(`${apiUrl}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched certificates response:", res.data);
            const rawData = Array.isArray(res.data)
                ? res.data : Array.isArray(res.data?.certificates)
                    ? res.data.certificates
                    : [];

            const dataWithId = rawData.map((cer, index) => ({ ...cer, tempId: index + 1 }));
            setCertificates(dataWithId);

        } catch (err) {
            console.error("Failed to fetch Certificates", err);
        }
    }, [token]);

    useEffect(() => {
        fetchCertificates();
    }, [fetchCertificates]);


    const [activeId, setActiveId] = useState(null); // track which one is active

    const handleSelectCertificates = (cer) => {
        setFormData({
            certificate_name: cer.certificate_name || "",
            certificate_number: cer.certificate_number || "",
        });
        setCertificateFile(null); // Clear manually uploaded file
        setSelectedCertificateFileName(cer.certificate_file?.split('/').pop() || '');
        setActiveId(cer.tempId);
    };

    const handleSaveCertificate = async () => {
        const selectedCertificate = certificates.find(cert => cert.tempId === activeId);
        if (!selectedCertificate) return alert("Selected certificate not found.");

        const certificateIndex = selectedCertificate.tempId;

        const formDataToSend = new FormData();
        formDataToSend.append("certificate_name", formData.certificate_name);
        formDataToSend.append("certificate_number", formData.certificate_number);

        // Only append new file if uploaded
        if (certificateFile) {
            formDataToSend.append("file", certificateFile);
        }

        try {
            const res = await axios.put(`${apiUrl}/${certificateIndex}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200) {
                await fetchCertificates(); // refresh the updated list
                alert("✅ Certificate updated successfully!");
            } else {
                alert("❌ Failed to update certificate.");
            }
        } catch (error) {
            console.error("Update failed:", error);
            alert("❌ Error while updating certificate.");
        }
    };


    const handleDeleteCertificate = async () => {
        if (!activeId) return alert("Please select a certificate to delete!");

        const selectedCertificate = certificates.find(cert => cert.tempId === activeId);
        if (!selectedCertificate) return;

        try {
            await axios.delete(`${apiUrl}/${selectedCertificate.tempId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("✅ Certificate deleted!");
            await fetchCertificates();

            // Reset form after delete
            setFormData({
                certificate_name: "",
                certificate_number: "",
                certificateFile: ""
            });
            setActiveId(null);
        } catch (err) {
            console.error("Delete failed", err);
            alert("❌ Failed to delete certificate.");
        }
    };


    return (
        <div className='fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center trasnfrom ease-in-out duration-200'>
            <div className='w-[700px] h-[570px] bg-white flex flex-col shadow rounded-xl px-10 py-5 ' >

                <div className="flex justify-between w-full mt-3">
                    <h3 className='text-lg font-semibold'>Certificates & Courses</h3>
                    <p onClick={onclose} className='text-lg font-semibold cursor-pointer transform ease-in-out duration-200 hover:scale-95'>X</p>
                </div>

                <div className="expereince-title flex gap-4 mt-7 mb-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                    {certificates.map((cer) => (
                        <div
                            key={cer.tempId}
                            onClick={() => handleSelectCertificates(cer)}
                            className={`flex-shrink-0  h-8 px-3 py-1.5 text-sm rounded snap-start cursor-pointer 
                                ${activeId === cer.tempId ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20'} 
                                hover:bg-[#2c6472] hover:text-white transition-all duration-200`}
                        >
                            {cer?.certificate_name}
                        </div>
                    ))}
                </div>

                <div className="form-fields flex flex-col gap-4">
                    <div className="flex flex-col w-full gap-4">
                        <label htmlFor="certificate_name" className='text-[15px] text-gray-500'>Certificate Name  <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="certificate_name"
                            placeholder=" "
                            value={formData.certificate_name}
                            onChange={handleChange}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none' />
                    </div>


                    <div className='flex gap-4'>
                        <div className="flex flex-col w-full gap-3">
                            <label htmlFor="certificateUpload" className='text-[15px] text-gray-500' >Completion Certificate  <span className="text-red-500">*</span></label>
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
                            <label htmlFor="certificate_number" className='text-[15px] text-gray-500' >Certificate Number</label>
                            <input
                                type="text"
                                name="certificate_number"
                                placeholder=" "
                                value={formData.certificate_number}
                                onChange={handleChange}
                                className='border border-gray-500/30 px-4 py-2 rounded outline-none' />
                        </div>


                    </div>

                    <div className="flex justify-between w-full mt-2">
                        <button 
                        onClick={activeId === null ? handleAddCertificate : null}
                        disabled={activeId !== null} className={`text-sm ${activeId !== null ? 'text-gray-500/60 cursor-not-allowed' : 'text-[#2c6472]'} font-medium hover:scale-95`}>+ Add Certificate</button>
                        <button onClick={activeId !== null ? handleDeleteCertificate : null}
                        disabled={activeId === null}
                         className={`text-sm flex ${activeId !== null ? 'text-red-500' : 'text-gray-500/60 cursor-not-allowed'} font-medium hover:scale-95`}> 
                        <img src={trash} alt="trash icon" className="w-4 h-3.5 mt-0.5 text-red-500 me-1 object-contain " />
                            Remove</button>
                    </div>

                    <div className='flex justify-center items-center gap-4 mt-3'>
                        <button onClick={activeId !== null ? handleSaveCertificate : null}
                        disabled={activeId === null}
                        className={` ${activeId !== null ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20 cursor-not-allowed'} w-32 text-sm px-2 py-2 rounded-xl mb-2 hover:scale-95 transition`}
                        >Save Changes</button>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CertificatesUpdateForm
