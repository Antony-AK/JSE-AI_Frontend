// src/context/ProfileImageContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/api";

const ProfileImageContext = createContext();

export const useProfileImage = () => useContext(ProfileImageContext);

export const ProfileImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [token, setToken] = useState(null); // ✅ token managed with state

  // ✅ Fetch token from session storage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const fetchProfileImage = async (authToken = token) => {
    if (!authToken) return;

    try {
      const res = await axios.get(`${BASE_URL}/photo`, {
        headers: { Authorization: `Bearer ${authToken}` },
        responseType: "blob",
      });

      // ✅ Clean up previous blob
      if (profileImage?.startsWith("blob:")) {
        URL.revokeObjectURL(profileImage);
      }

      const imageUrl = URL.createObjectURL(res.data);
      setProfileImage(imageUrl); // ✅ No ?t=timestamp here
      console.log("✅ Profile image fetched from context:", imageUrl);
    } catch (error) {
      console.error("❌ Failed to fetch profile image:", error);
      setProfileImage(null);
    }
  };
  // ✅ Re-fetch profile image whenever token is available
  useEffect(() => {
    if (token) {
      fetchProfileImage(token);
    }
  }, [token]);

  return (
    <ProfileImageContext.Provider
      value={{
        profileImage,
        setProfileImage,
        fetchProfileImage,
      }}
    >
      {children}
    </ProfileImageContext.Provider>
  );
};