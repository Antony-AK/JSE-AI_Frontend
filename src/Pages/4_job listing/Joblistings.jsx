import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cards from "./Cards.jsx";
import Loader from "../../base/loader/Loader.jsx";
import arrow_right from '../../assets/arrow-right.svg'
import filter_icon from '../../assets/filter-icon.svg'

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [filters, setFilters] = useState({
    salaryMin: "",
    salaryMax: "",
    location: ""
  });
  const [offset, setOffset] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    per_page: 10,
    total: 0,
    next: null,
    prev: null
  });

  const fetchJobs = async (customOffset = offset) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        const response = await axios.get(
          "https://jse.arshan.digital/b1/api/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { ...filters, title: selectedJobTitle, offset: customOffset, limit: pagination.per_page }, // Send filters with the request
          }
        );
  
        const fetchedJobs = response.data.jobs || []; // Ensure jobs is always an array
        const fetchedPagination = response.data.pagination || {}; // Ensure pagination is always an object
        setJobs(fetchedJobs);
        setPagination(fetchedPagination); // Set pagination data
        sessionStorage.setItem("jobsData", JSON.stringify(fetchedJobs));
        setOffset(customOffset); // Update offset state

      } else {
        console.error("No token found. Please log in.");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    setLoading(false);
  };



  useEffect(() => {
    const storedJobs = sessionStorage.getItem("jobsData");
    const storedPagination = sessionStorage.getItem("paginationData");

    if (storedJobs && storedPagination) {
      setJobs(JSON.parse(storedJobs));
      setPagination(JSON.parse(storedPagination));
      setLoading(false);
    } else {
      fetchJobs(0);
    }


  }, [filters, selectedJobTitle]); // Fetch data when filters or selectedJobTitle change

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };


  const handleJobTitleClick = (title) => {
    setSelectedJobTitle(title);
    console.log("Selected title:", title) // Set the selected job title for filtering
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  if (loading) return <Loader />;

  const jobData = (jobs || []).map((job) => ({
    ...job,
    title: job.title,
    company: job.company,
    postedDate: "3 Days ago",
    location: job.location || "Location not specified",
    description: job.description,
    skillData: [
      { label: "Required Skills", value: `${job.skills}` },
      { label: "Your Skills", value: `${job.user_skills}` },
      {
        label: "Expected Salary",
        value: `${job.expected_salary?.min} - ${job.expected_salary?.max}`,
      },
    ],
    matchValue: job.match_score,
  }));

  return (
    <div className="flex flex-col bg-gray-40 ms-2">
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <div className="flex flex-wrap gap-3 p-5">
          {/* Job title buttons with dynamic active state */}
          {/* {["Software Engineer", "DevOps Engineer", "Backend Developer"].map((title) => (
            <button
              key={title}
              className={`px-2 py-1.5 font-medium text-[13px] rounded ${selectedJobTitle === title ? 'bg-[#2C6472] text-white' : 'bg-[#e4e2e2] text-black'} hover:scale-105`}
              onClick={() => handleJobTitleClick(title)}
            >
              {title}
            </button>
          ))} */}

          {/* Filter Button */}
          {/* <button
            onClick={toggleDropdown}
            className="flex items-center gap-x-2 px-2 py-1.5 bg-white font-medium text-[13px] rounded text-black hover:scale-105 shadow-md"
          >
            <img src={filter_icon} alt="" />
            Filter
          </button> */}

          <Link to={'/user/selected-applications'} className="ml-auto">
            <button className="flex items-center gap-x-2 px-2 py-1.5 bg-transparent font-medium text-[13px] rounded text-[#2C6472] border border-[#2C6472] hover:scale-105">
              Go to Selected Application
              <img src={arrow_right} alt="" />
            </button>
          </Link>
        </div>

        {/* {dropdownVisible && (
          <div className="absolute bg-white p-4 rounded shadow-md z-30">
            <h3 className="font-semibold text-lg">Filter Options</h3>
            <div className="mt-2">
              <label className="block text-sm">Salary Range</label>
              <input
                type="number"
                name="salaryMin"
                placeholder="Min Salary"
                value={filters.salaryMin}
                onChange={handleFilterChange}
                className="border p-2 rounded mt-1 w-full"
              />
              <input
                type="number"
                name="salaryMax"
                placeholder="Max Salary"
                value={filters.salaryMax}
                onChange={handleFilterChange}
                className="border p-2 rounded mt-1 w-full"
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm">Location</label>
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleFilterChange}
                className="border p-2 rounded mt-1 w-full"
              />
            </div>
          </div>
        )} */}


        {jobs.length === 0 ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "calc(264px + 40%)",
              transform: "translate(-50%, -50%)",
            }}
            className="text-center"
          >
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              No jobs available.
            </h2>
            <p className="text-gray-500">
              Please check back later or adjust your filters.
            </p>
          </div>
        ) : (
          <>
            <hr />
            <div className="p-5 pt-4">
              <h2 className="text-sm font-semibold">Showing {pagination.total} Jobs</h2>
              <p className="text-sm text-gray-400 mt-1">Based on your preferences</p>
              <div className="flex flex-col justify-around gap-2 pt-5">
                {jobData.map((job, index) => (
                  <Cards key={index} {...job} />
                ))}
              </div>
            </div>
          </>
        )}

        {jobs.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8 mb-10">
            <button
              disabled={offset === 0}
              onClick={() => fetchJobs(offset - pagination.per_page)}
              className={`px-3 py-1 rounded text-sm ${offset === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#2C6472] text-white'}`}
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {Math.floor(offset / pagination.per_page) + 1} of {Math.ceil(pagination.total / pagination.per_page)}
            </span>
            <button
              disabled={(offset + pagination.per_page) >= pagination.total}
              onClick={() => fetchJobs(offset + pagination.per_page)}
              className={`px-3 py-1 rounded text-sm ${(offset + pagination.per_page) >= pagination.total ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#2C6472] text-white'}`}
            >
              Next
            </button>
          </div>
        )}


      </main>
    </div>
  );
}

export default App;
