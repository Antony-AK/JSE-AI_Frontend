// src/context/JobContext.js
import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/api";
export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pagination, setPagination] = useState({});
  const [jobLoading, setJobLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const perPage = 20;
  const selectedJobRef = useRef(null);

  const fetchSelectedJobs = async (customOffset = offset) => {
    const cachedJobs = sessionStorage.getItem("jobCache");
    const cachedPagination = sessionStorage.getItem("jobPagination");
    const savedSelectedJobId = sessionStorage.getItem("selectedJobId");

    let usedCache = false;

    if (cachedJobs && cachedPagination) {
      const parsedJobs = JSON.parse(cachedJobs);
      const parsedPagination = JSON.parse(cachedPagination);

      setSelectedJobs(parsedJobs);
      setPagination(parsedPagination);

      const jobToSelect = parsedJobs.find((job) => job.id === savedSelectedJobId);
      setSelectedJob(jobToSelect || parsedJobs[0]);
      usedCache = true;
    }

    if (!usedCache) {
      setJobLoading(true);
    }

    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.get(`${BASE_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { offset: customOffset, limit: perPage },
      });

      const fetchedJobs = response.data.jobs || [];
      const paginationInfo = response.data.pagination || {};
      const totalItems = paginationInfo.total || 0;
      const currentPage = Math.floor(customOffset / perPage) + 1;

      const mappedJobs = fetchedJobs.map((job) => ({
        id: job.job_id || job.id,
        jobTitle: job.job_title || job.title || "Untitled Job",
        title: job.title || job.job_title,
        companyName: job.company || "Unknown Company",
        company: job.company || "Unknown Company",
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
        selected: job.selected || false,
        cvGenerated: job.cv_generated || false,
        coverLetterGenerated: job.cover_letter_generated || false,
        viewLink: job.view_link || "#",
      }));

      // ✅ Save to sessionStorage
      sessionStorage.setItem("jobCache", JSON.stringify(mappedJobs));
      sessionStorage.setItem("jobPagination", JSON.stringify({
        current: currentPage,
        total: totalItems,
        per_page: paginationInfo.per_page || perPage,
        next: paginationInfo.next || null,
        prev: paginationInfo.prev || null,
      }));
      sessionStorage.setItem("jobPaginationOffset", customOffset);

      setSelectedJobs(mappedJobs);

      const savedSelectedJobId = sessionStorage.getItem("selectedJobId");
      if (savedSelectedJobId) {
        const jobToSelect = mappedJobs.find((job) => job.id === savedSelectedJobId);
        setSelectedJob(jobToSelect || mappedJobs[0]);
      } else {
        setSelectedJob(mappedJobs[0]);
      }

      setTimeout(() => {
        if (selectedJobRef.current) {
          selectedJobRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);

      setPagination({
        current: currentPage,
        total: totalItems,
        per_page: paginationInfo.per_page || perPage,
        next: paginationInfo.next || null,
        prev: paginationInfo.prev || null,
      });

      setOffset(customOffset);
    } catch (error) {
      const errMsg = error.response?.data?.message || "⚠ Failed to fetch jobs.";
      setError(errMsg);
    } finally {
      setJobLoading(false);
    }
  };

  return (
    <JobContext.Provider
      value={{
         selectedJobs,
        setSelectedJobs,
        selectedJob,
        setSelectedJob,
        pagination,
        setPagination,
        offset,
        setOffset,
        jobLoading,
        setJobLoading,
        fetchSelectedJobs,
        selectedJobRef,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
