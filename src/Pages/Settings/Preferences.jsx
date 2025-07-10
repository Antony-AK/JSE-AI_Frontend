import React, { useEffect, useState } from 'react';
import right_arrow from "../../assets/arrow-right.svg";
import { BASE_URL } from '../../utils/api';
import { motion, AnimatePresence } from "framer-motion";
import arrow_down from "../../assets/arrow-down-drop.png"; // 👈 your dropdown arrow
import { changeLanguageGoogleTranslate } from '../../utils/translate';



const Preferences = () => {
    const [preferences, setPreferences] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);

    const langMap = {
  english: "en",
  german: "de",
};

const handleLanguageChange = (lang) => {
  changeLanguageGoogleTranslate(langMap[lang]); // dynamic!
  const updated = { ...preferences, language: lang };
  setPreferences(updated);
  handleUpdate(updated);
};


    useEffect(() => {
        const fetchPreferences = async () => {
            const token = sessionStorage.getItem("authToken");

            try {
                const response = await fetch(`${BASE_URL}/settings/getpreferences`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch preferences");
                }

                const data = await response.json();
                setPreferences(data);
            } catch (error) {
                console.error("❌ Error fetching preferences:", error.message);
            }
        };

        fetchPreferences();
    }, []);

    const handleUpdate = async (updatedData) => {
        const token = sessionStorage.getItem("authToken");
        setUpdating(true);

        console.log("📡 PUT API CALLED with data:", updatedData);


        try {
            const response = await fetch(`${BASE_URL}/settings/editpreferences`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    language: updatedData.language,
                    timezone: updatedData.timezone,
                    cookie_policy: updatedData.cookie_policy,
                }),
            });

            if (!response.ok) {
                throw new Error("Update failed");
            }

            const newData = await response.json();
            console.log("✅ Preferences updated:", newData);
            setPreferences(updatedData);
        } catch (error) {
            console.error("❌ Error updating preferences:", error.message);
        } finally {
            setUpdating(false);
        }
    };


    const handleTimezoneChange = (e) => {
        const updated = { ...preferences, timezone: e.target.value };
        setPreferences(updated);
        handleUpdate(updated);
    };

    const handleCookieToggle = () => {
        const updated = { ...preferences, cookie_policy: !preferences.cookie_policy };
        setPreferences(updated);
        handleUpdate(updated);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".lang-dropdown")) {
                setShowLangDropdown(false);
            }
            if (!e.target.closest(".timezone-dropdown")) {
                setShowTimezoneDropdown(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

 


    return (
        <div className='flex flex-col gap-5 py-3'>
            {/* Language */}
            {/* Language */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold">Language</h2>
                    <p className="text-[#000000b0] text-sm">Change the language used in the user interface.</p>
                </div>

                <div className="relative lang-dropdown w-[150px]">
                    <button
                        onClick={() => setShowLangDropdown(!showLangDropdown)}
                        className="flex justify-center items-center w-full px-4 py-1 text-sm font-semibold rounded cursor-pointer bg-white "
                    >
                        {preferences?.language === "german" ? "German" : "English"}
                        <motion.img
                            src={arrow_down}
                            alt="arrow"
                            className="w-4 ml-2"
                            animate={{ rotate: showLangDropdown ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </button>

                    <AnimatePresence>
                        {showLangDropdown && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-10 overflow-hidden"
                            >
                                {["english", "german"].map((lang) => (
                                    <div
                                        key={lang}
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${preferences?.language === lang ? "bg-gray-100 font-bold" : ""}`}
                                        onClick={() => {
                                            handleLanguageChange(lang);
                                            setShowLangDropdown(false);
                                        }}
                                    >
                                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>


            {/* Timezone */}
            {/* Timezone */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold">Timezone</h2>
                    <p className="text-[#000000b0] text-sm">Custom timezone setting.</p>
                </div>

                <div className="relative timezone-dropdown w-[200px]">
                    <button
                        onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                        className="flex justify-center items-center w-full px-4 py-1 text-sm font-semibold rounded cursor-pointer bg-white "
                    >
                        {preferences?.timezone === "Asia/Kolkata"
                            ? "(GMT+5:30) Asia/Kolkata"
                            : "(GMT+2:00) Berlin"}
                        <motion.img
                            src={arrow_down}
                            alt="arrow"
                            className="w-4 ml-2"
                            animate={{ rotate: showTimezoneDropdown ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </button>

                    <AnimatePresence>
                        {showTimezoneDropdown && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-10 overflow-hidden"
                            >
                                <div
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${preferences?.timezone === "CET" ? "bg-gray-100 font-bold" : ""}`}
                                    onClick={() => {
                                        handleTimezoneChange({ target: { value: "CET" } });
                                        setShowTimezoneDropdown(false);
                                    }}
                                >
                                    (GMT+2:00) Berlin
                                </div>
                                <div
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${preferences?.timezone === "Asia/Kolkata" ? "bg-gray-100 font-bold" : ""}`}
                                    onClick={() => {
                                        handleTimezoneChange({ target: { value: "Asia/Kolkata" } });
                                        setShowTimezoneDropdown(false);
                                    }}
                                >
                                    (GMT+5:30) Asia/Kolkata
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>


            {/* Privacy */}
            <div className="">
                <h2 className='text-lg font-bold'>Privacy</h2>
                <div className="border border-b-gray-200 h-px my-3"></div>

                <div className="flex flex-col gap-5 py-3">

                    {/* Cookie Policy */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className='font-semibold'>Cookie Policy</h2>
                            <p className='text-[#000000b0] text-sm'>We use cookies to improve your experience. By continuing, you agree to our Cookie Policy.</p>
                        </div>
                        <label className="relative inline-block w-10 h-6">
                            <input
                                type="checkbox"
                                checked={preferences?.cookie_policy || false}
                                onChange={handleCookieToggle}
                                className="sr-only peer"
                            />
                            <div className="w-10 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#2c6472] transition-colors duration-300" />
                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4 shadow" />
                        </label>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className='font-semibold'>Terms & Conditions</h2>
                            <p className='text-[#000000b0] text-sm'>By using this platform, you agree to abide by our Terms & Conditions.</p>
                        </div>
                        <img width="8px" src={right_arrow} className='mr-5' alt="arrow" />
                    </div>

                    {/* Privacy Policy */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className='font-semibold'>Privacy Policy</h2>
                            <p className='text-[#000000b0] text-sm'>Your data is safe with us. Learn more in our Privacy Policy.</p>
                        </div>
                        <img width="8px" src={right_arrow} className='mr-5' alt="arrow" />
                    </div>

                    {/* Data Policy */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className='font-semibold'>Data Policy</h2>
                            <p className='text-[#000000b0] text-sm'>We handle your personal information in accordance with our Data Policy.</p>
                        </div>
                        <img width="8px" src={right_arrow} className='mr-5' alt="arrow" />
                    </div>

                </div>
            </div>

            {/* Optional: Show updating loader */}
            {updating && <p className='text-xs text-blue-500 italic'>Updating preferences...</p>}
        </div>
    );
};

export default Preferences;
