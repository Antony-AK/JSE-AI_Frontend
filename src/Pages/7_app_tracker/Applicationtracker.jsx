import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../base/loader/Loader.jsx";
import defaultLocationImg from "./../../assets/locationicon.png";

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
  const [activeStatusIndex, setActiveStatusIndex] = useState({}); // 🔥 Track status click per card

  const dummyApplications = [
    {
      title: "Frontend Developer",
      company: "PixelWaves",
      remote: true,
      location: "Chennai",
    },
    {
      title: "Backend Engineer",
      company: "CloudNova",
      remote: false,
      location: "Bangalore",
    },
    {
      title: "UI/UX Designer",
      company: "DesignZilla",
      remote: true,
      location: "Remote",
    },
  ];

  const token = sessionStorage.getItem("authToken") || "your-fallback-token";

  useEffect(() => {
    setLoading(true);
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "https://arshan.digital/selected-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const jobs = response?.data?.selected_jobs;

        if (Array.isArray(jobs) && jobs.length > 0) {
          setApplications(jobs);
        } else {
          setApplications(dummyApplications);
        }
        setLoading(false);

      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications(dummyApplications);
        setLoading(false);

      }
    };

    fetchApplications();
  }, []);

  const handleStatusClick = (appIndex, status) => {
    setActiveStatusIndex((prev) => ({
      ...prev,
      [appIndex]: prev[appIndex] === status ? null : status, // toggle if same
    }));
  };

  const statusOptions = [
    { label: "Application", color: "bg-blue-300" },
    { label: "Selected", color: "bg-green-300" },
    { label: "Underreview", color: "bg-amber-400" },
    { label: "Rejected", color: "bg-red-300" },
  ];

  const comingSoon = true;

if (comingSoon) {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] bg-gray-100">
      <div className="animate-bounce text-4xl mb-4">🚧</div>
      <h1 className="text-2xl font-bold text-gray-700 mb-2">Feature Coming Soon!</h1>
      <p className="text-gray-500 text-sm">We’re working hard to launch this. Stay tuned 😄</p>
    </div>
  );
}

  if (loading) return <Loader />;

  return (
    <div className="flex h-screen bg-gray-50 p-5">
      <div className="flex flex-col w-[1300px] min-h-screen bg-gray-40">
        <main className="flex-1 p-6">
          <p className="mb-5 text-gray-700 font-medium  ">
            Total <span className="font-bold text-gray-500">{applications.length}</span> Application
          </p>
          <div className="space-y-6 mx-auto">
            {applications.map((app, index) => (
              <div
                key={index}
                className="w-[1001px] h-[170px] mx-auto flex justify-between items-start bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
              >
                {/* Job Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded font-bold text-lg">
                    {app.company?.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="flex flex-col -space-y-4">
                    <h3 className="font-semibold text-xl text-[#2C6472]">{app.title}</h3><br />
                    <p className="text-gray-600">{app.company}</p><br />
                    <p className="text-gray-600 text-base">{app.remote ? "Remote" : "On-site"}</p><br />
                    <div className="flex items-center gap-2">
                      <img src={defaultLocationImg} alt="Location" />
                      <p className="text-[#00000091] text-base">{app.location}</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-l h-full mx-6"></div>

                {/* Status Section */}
                <div className="flex gap-10 justify-center items-center">
                  <h3 className="font-semibold text-gray-800 text-lg -mt-5">Status</h3>
                  <div className="grid grid-cols-2 gap-3 mt-5 me-5">
                    {statusOptions.map((statusObj, statusIdx) => (
                      <div
                        key={statusIdx}
                        className={`cursor-pointer flex items-center gap-3 px-4 py-2 w-[165px] h-[45px] ${statusObj.color} text-white rounded-xl font-medium`}
                        onClick={() => handleStatusClick(index, statusObj.label)}
                      >  <span className="w-4 h-4 bg-white rounded-full flex justify-center items-center">

                          {activeStatusIndex[index] === statusObj.label ? (
                            <span className={`w-1.5 h-1.5 ${statusObj.color} rounded-full`} />
                        ) : (
                        <span className="w-4 h-4 bg-transparent rounded-full"></span>
                        )}
                        </span>
                        {statusObj.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicationTracker;
