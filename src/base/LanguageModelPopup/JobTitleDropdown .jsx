import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../utils/api";

const JobSearchTitleDropdown = ({ onJobsFetched }) => {

    const dropdownRef = useRef(null);

    const [titles, setTitles] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState("Job Search Titles");

    const toggleDropdown = () => setShowDropdown((prev) => !prev);

    const fetchTitles = async () => {
        try {
            const token = sessionStorage.getItem("authToken");
            if (!token) {
                console.error("⚠ No auth token found.");
                return;
            }

            const res = await axios.get(`${BASE_URL}/jobtitles`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const { primary_title, secondary_title, tertiary_title } = res.data;
            setTitles([primary_title, secondary_title, tertiary_title].filter(Boolean));
        } catch (err) {
            console.error("❌ Failed to fetch job titles:", err.message);
        }
    };


    const handleTitleSelect = async (title) => {
        setSelectedTitle(title);
        setShowDropdown(false);

        try {
            const token = sessionStorage.getItem("authToken");
            if (!token) {
            console.error("⚠ No auth token found.");
            return;
            }

            const encodedTitle = encodeURIComponent(title);

            const res = await axios.get(`${BASE_URL}/api/jobs?title=${encodedTitle}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            });

            const jobs = res.data.jobs || [];

            if (jobs.length === 0) {
            console.warn(`No jobs found for title: ${title}`);
            onJobsFetched([], title); // ✅ Pass empty array and title for display
            return;
            }

            const mappedJobs = jobs.map((job) => ({
            id: job.job_id || job.id,
            jobTitle: job.job_title || job.title || "Untitled Job",
            title: job.title || job.job_title,
            companyName: job.company || "Unknown Company",
            location: job.location || "Location not specified",
            postedDate: job.posted_date || "Not specified",
            description: job.description?.slice(0, 100) + "...",
            Description: job.description || "No description available",
            matchValue: job.match_score || 50,
            skillData: [
                {
                label: "Required Skills",
                value: job.skills ? job.skills.split(",").map((s) => s.trim()) : [],
                },
                {
                label: "Your Skills",
                value: Array.isArray(job.user_skills) ? job.user_skills : [],
                },
                {
                label: "Job Type",
                value: job.job_type || "Not specified",
                },
            ],
            }));

            onJobsFetched(mappedJobs, title); // ✅ Pass title even when jobs exist
        } catch (error) {
            console.error("❌ Failed to fetch filtered jobs:", error.message);
            onJobsFetched([], title); // ✅ Also pass empty on failure
        }
    };

    useEffect(() => {
        fetchTitles();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-block text-left">
            <button
                onClick={toggleDropdown}
                className="px-6 py-1.5 font-medium text-[13px] rounded bg-white shadow-sm border border-gray-300 text-black hover:scale-105 flex items-center gap-2"
            >
                {selectedTitle}
                <motion.span
                    animate={{ rotate: showDropdown ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaChevronDown className="text-[12px] text-gray-600" />
                </motion.span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                    >
                        <div className="flex flex-col py-2 px-2">
                            {titles.map((title, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleTitleSelect(title)}
                                    className="text-sm text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                                >
                                    {title}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobSearchTitleDropdown;
