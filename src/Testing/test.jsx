import React, { useEffect, useState } from "react";
import axios from "axios";

function test() {
  const [profileData, setProfileData] = useState(null);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDM4MjI0OWYtM2JlMS00YmMyLWI2ZDgtYzVkYTI4YWQ5YWUwIiwiZW1haWwiOiJrb3VzaGlrYmFidWZvcndvcmtAZ21haWwuY29tIiwicm9sZSI6InNlZWtlciIsImV4cCI6MTc0NDgyMDUyNn0.JSjG8wXl0_IQJCMHet2XfKsbJQwihjo_-thpK0omY9U";

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get("https://raasbackend-production.up.railway.app/profile", { headers })
      .then((res) => {
        setProfileData(res.data.profile); // ✅ Fix: access .profile from response
        console.log("Fetched Profile:", res.data.profile);
      })
      .catch((err) => {
        console.error("Error fetching profile data:", err);
      });
  }, []);

  const userInfo = profileData?.firstName;
  const languages = profileData?.languages || [];
  const certificates = profileData?.certificates || [];
  const workExperience = profileData?.workExperience || {};
  const entryProgress = profileData?.entryProgress;
  const jobs = profileData?.jobs || [];
  const selectedJobs = profileData?.selectedJobs || [];

  return (
    <div>
      <h1>Welcome, {userInfo || "Loading..."}</h1>

      <h2>Skills:</h2>
      <ul>
        {profileData?.skills?.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>

      <h2>Preferred Job Title: {profileData?.preferredJobTitle}</h2>
      <h3>Profile Completion: {profileData?.profileCompletion}%</h3>
      <h3>Total Experience: {Math.floor(profileData?.totalExperienceInMonths / 12)} years {profileData?.totalExperienceInMonths % 12} months</h3>

      <h2>Certificates:</h2>
      {certificates.length > 0 ? (
        <ul>
          {certificates.map((cert, index) => (
            <li key={index}>{cert}</li>
          ))}
        </ul>
      ) : (
        <p>No certificates added.</p>
      )}
    </div>
  );
}

export default test;
