import React, { useState, useEffect } from 'react';
// import trash from "../assets/trash2.png";
import axios from 'axios';

const PersonalnfoUpdateForm = ({ onclose }) => {
    const [formData, setFormData] = useState({
        first_name: "",
        second_name: "",
        date_of_birth: "",
        address: "",
        linkedin_profile: ""
    });


    const apiUrl = "https://jse.arshan.digital/b1/personal-info";
    const token = sessionStorage.getItem("authToken");

    const fetchProfileInfo = async () => {
        try {
            const res = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });



            let info = {};

            if (Array.isArray(res.data)) {
                info = res.data[0] || {};
            } else if (Array.isArray(res.data?.personal_info)) {
                info = res.data.personal_info[0] || {};
            } else if (typeof res.data?.personal_info === 'object') {
                info = res.data.personal_info;
            } else if (typeof res.data === 'object') {
                info = res.data;
            }


            setFormData({
                first_name: (info.first_name || "").trim(),
                second_name: (info.second_name || "").trim(),
                date_of_birth: info.date_of_birth || "",
                address: info.address || "",
                linkedin_profile: info.linkedin_profile || ""
            });
        } catch (err) {
            console.error("Failed to fetch personal info", err);
        }
    };

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    // 🔄 Handle PUT (update)
    const handleSubmit = async () => {
        try {
            const res = await axios.put(`${apiUrl}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            alert("Personal info updated successfully ✅");
            onclose();
        } catch (err) {
            console.error("Update failed", err);
            alert("Update failed ❌");
        }
    };

    // 🗑️ Handle DELETE
    const handleDelete = async () => {
        try {
            await axios.delete(`${apiUrl}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Personal info deleted ✅");
            onclose();
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete ❌");
        }
    };

    return (
        <div className='fixed inset-0 bg-white overflow-y-auto hide-scrollbar bg-opacity-70 z-50 flex items-center justify-center'>
            <div className='w-[700px] mt-10 mb-10 bg-white flex flex-col shadow rounded-xl px-10 py-5'>
                <div className="flex justify-between w-full mt-3">
                    <h3 className='text-lg font-semibold'>Personal Information</h3>
                    <p onClick={onclose} className='text-lg font-semibold cursor-pointer hover:scale-95'>X</p>
                </div>

                <div className="form-fields flex flex-col gap-4 mt-5">
                    {/* First Name */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>First Name  <span className="text-red-500">*</span> </label>
                        <input
                            type="text"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                        />
                    </div>

                    {/* Second Name */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>Second Name</label>
                        <input
                            type="text"
                            value={formData.second_name}
                            onChange={(e) => setFormData({ ...formData, second_name: e.target.value })}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                        />
                    </div>

                    {/* DOB */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>Date Of Birth  <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                            className='border border-gray-500/30 px-4 py-2 text-gray-500 rounded outline-none'
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>Current Address  <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                        />
                    </div>

                    {/* LinkedIn */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>Linkedin Profile</label>
                        <input
                            type="text"
                            value={formData.linkedin_profile}
                            onChange={(e) => setFormData({ ...formData, linkedin_profile: e.target.value })}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                        />
                    </div>

                    {/* Remove Button */}
                    {/* <div className="flex justify-end w-full mt-2">
                        <button
                            onClick={handleDelete}
                            className='text-sm flex text-red-500 font-medium hover:scale-95'
                        >
                            <img src={trash} alt="trash icon" className="w-4 h-3.5 mt-0.5 me-1 object-contain" />
                            Remove
                        </button>
                    </div> */}

                    {/* Save Button */}
                    <div className='flex justify-center items-center gap-4 mt-5 mb-5'>
                        <button
                            onClick={handleSubmit}
                            className='bg-[#2c6472] w-32 text-sm text-white px-2 py-2 rounded-xl hover:scale-95'
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalnfoUpdateForm;
