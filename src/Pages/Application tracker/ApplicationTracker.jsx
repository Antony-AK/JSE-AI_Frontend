import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApplicationCard from './ApplicationCard';
import { BASE_URL } from '../../utils/api';

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/api/application-tracker`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Fetched applications:", response.data);
      const realData = Array.isArray(response.data)
        ? response.data
        : response.data.applications || []; setApplications(realData);
    } catch (error) {
      console.error("Failed to fetch applications 🧨", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="w-[60%] mx-auto flex-col mt-32 flex items-center  text-center text-gray-600 text-base">
          <span className='text-red-500 mb-5 flex flex-1'>No applications found.</span><br/> Please generate your CV and Cover Letter, then search and apply for jobs using the job link to start tracking your application progress.
        </p>
      ) : (
        applications.map(({
          job_id,
          job_title,
          title,
          company,
          location,
          job_desc,
          description,
          key_skills,
          skills,
          match_score,
          status
        }, idx) => (
          <ApplicationCard
            key={job_id || idx}
            jobId={job_id} // 👈 ADD THIS
            title={job_title || title}
            company={company}
            location={location}
            description={job_desc || description || "No description provided"}
            yourSkills={key_skills?.join(', ') || 'N/A'}
            requiredSkills={skills || 'N/A'}
            profileMatch={match_score || 0}
            status={status || 'pending'}
          />
        ))
      )}
    </div>
  );
};

export default ApplicationTracker;
