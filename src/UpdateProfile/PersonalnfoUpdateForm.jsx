import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// import trash from "../assets/trash2.png";
import axios from 'axios';
import { BASE_URL } from '../utils/api'

const PersonalnfoUpdateForm = ({ onclose }) => {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: "",
        second_name: "",
        email: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        linkedin_profile: "",
        external_links: [
            { type: "website", url: "" },
            { type: "github", url: "" },
            { type: "blog", url: "" },
            { type: "social media", url: "" }
        ]
    });


    const apiUrl = `${BASE_URL}/personal-info`;
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
                email: info.email || "",
                phone: info.phone || "",
                country: info.country || "Germany",
                state: info.state || "",
                city: info.city || "",
                linkedin_profile: info.linkedin_profile || "",
                external_links: ["website", "github", "blog", "social media"].map((type) => {
                    const link = (info.external_links || []).find((l) => l.type === type);
                    return { type, url: link?.url || "" };
                })
            });
        } catch (err) {
            console.error("Failed to fetch personal info", err);
        }
    };

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    // 🔄 Handle POST (update)
    const handleSubmit = async () => {

        if (loading) return;

        setLoading(true);

        try {
            const res = await axios.post(`${apiUrl}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            toast.success("Personal info updated successfully.");
            onclose();
        } catch (err) {
            console.error("Update failed", err);
            toast.error("Update failed");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // 🗑️ Handle DELETE
    // const handleDelete = async () => {
    //     try {
    //         await axios.delete(`${apiUrl}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         alert("Personal info deleted ✅");
    //         onclose();
    //     } catch (err) {
    //         console.error("Delete failed", err);
    //         alert("Failed to delete ❌");
    //     }
    // };

    return (
        <div className='fixed inset-0 bg-white overflow-y-auto hide-scrollbar bg-opacity-70 z-50 flex items-center justify-center'>
            <div className='w-[700px] h-[90%] mt-10 mb-10 bg-white flex flex-col shadow rounded-xl px-10 py-5 scrollbar-custom'>
                <div className="flex justify-between w-full mt-3">
                    <h3 className='text-lg font-semibold'>Personal Information</h3>
                    <p onClick={onclose} className='text-lg font-semibold cursor-pointer hover:scale-95'>X</p>
                </div>

                <div className="form-fields overflow-auto flex flex-col gap-4 mt-5 pr-4">
                    {/* First Name */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>First Name  <span className="text-red-500">*</span> </label>
                        <input
                            type="text"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                            disabled
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
                            disabled
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>Email  <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                            disabled
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>Phone  <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                        />
                    </div>

                    {/* Country */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>Country <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                            disabled
                        />
                    </div>

                    {/* State */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>State <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                        />
                    </div>

                    {/* City */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>City <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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

                    {/* Website */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>Website</label>
                        <input
                            type="text"
                            value={formData.external_links[0]?.url || ""}
                            onChange={(e) => {
                                const updatedLinks = [...formData.external_links];
                                updatedLinks[0].url = e.target.value;
                                setFormData({ ...formData, external_links: updatedLinks });
                            }}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                        />
                    </div>

                    {/* Github */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>Github</label>
                        <input
                            type="text"
                            value={formData.external_links[1]?.url || ""}
                            onChange={(e) => {
                                const updatedLinks = [...formData.external_links];
                                updatedLinks[1].url = e.target.value;
                                setFormData({ ...formData, external_links: updatedLinks });
                            }}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                        />
                    </div>

                    {/* Blog */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>Blog</label>
                        <input
                            type="text"
                            value={formData.external_links[2]?.url || ""}
                            onChange={(e) => {
                                const updatedLinks = [...formData.external_links];
                                updatedLinks[2].url = e.target.value;
                                setFormData({ ...formData, external_links: updatedLinks });
                            }}
                            className='border border-gray-500/30 px-4 py-2 rounded outline-none'
                        />
                    </div>

                    {/* Social Media */}
                    <div className="flex flex-col w-full gap-3">
                        <label className='text-[15px] text-gray-500'>Social Media</label>
                        <input
                            type="text"
                            value={formData.external_links[3]?.url || ""}
                            onChange={(e) => {
                                const updatedLinks = [...formData.external_links];
                                updatedLinks[3].url = e.target.value;
                                setFormData({ ...formData, external_links: updatedLinks });
                            }}
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
                            disabled={loading}
                            className={`bg-[#2c6472] w-32 text-sm text-white px-2 py-2 rounded-xl hover:scale-105 flex justify-center items-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalnfoUpdateForm;
