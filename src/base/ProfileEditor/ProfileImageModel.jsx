import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../utils/api';
import imageCompression from 'browser-image-compression'; // 👈 import it


const ProfileImageModal = ({ imageUrl, onClose, onUpload }) => {
    const [preview, setPreview] = useState(imageUrl || null);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const fileInputRef = useRef();

    const handleImageSelect = async (e) => {
    const file = e.target.files[0];

    if (!file) {
        toast.error("No file selected.");
        return;
    }

    if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
    }

    const options = {
        maxSizeMB: 1,              // ⬅️ Target size ~1MB
        maxWidthOrHeight: 1024,    // ⬅️ Resize to max 1024px
        useWebWorker: true         // ✅ faster performance
    };

    try {
        // 👇 Compress the image
        const compressedFile = await imageCompression(file, options);

        console.log("Original:", file.size / 1024, "KB");
        console.log("Compressed:", compressedFile.size / 1024, "KB");

        const compressedPreview = URL.createObjectURL(compressedFile);
        setPreview(compressedPreview);

        uploadImage(compressedFile); // 👈 Upload compressed version
    } catch (error) {
        console.error("Compression Error:", error);
        toast.error("Failed to compress image.");
    }
};


    const uploadImage = async (file) => {
        try {
            setLoading(true);

            const token = sessionStorage.getItem('authToken'); // 👈 get your Bearer token

            if (!token) {
                toast.error("User not logged in.");
                return;
            }

            const formData = new FormData();
            formData.append('photo', file); // ✅ field name must be exactly 'photo'

            const response = await fetch(`${BASE_URL}/photo/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Add token only
                    // ❌ Do NOT set Content-Type manually!
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.issue || "Upload failed");
            }

            const data = await response.json();
            toast.success("Profile image updated!");
            onUpload(data.photo_url); // update the parent
            onClose();
            setRefreshTrigger(prev => !prev); // ✅ this will re-fetch profile data

        } catch (err) {
            console.error("Image Upload Error:", err);
            toast.error("Upload failed. " + err.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-xl p-6 w-[90%] max-w-md text-center relative shadow-lg"
                    initial={{ scale: 0.85 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.85 }}
                >
                    {preview ? (
                        <img
                            src={preview}
                            className="rounded-full w-40 h-40 object-cover mx-auto border"
                            alt="Preview"
                        />
                    ) : (
                        <div className="rounded-full w-40 h-40 mx-auto border flex items-center justify-center text-gray-500">
                            Preview
                        </div>
                    )}
                    <button
                        className={`mt-6 px-5 py-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2c6472] hover:scale-95'
                            } text-white rounded-lg transition-all`}
                        onClick={() => fileInputRef.current.click()}
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Edit Image"}
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProfileImageModal;
