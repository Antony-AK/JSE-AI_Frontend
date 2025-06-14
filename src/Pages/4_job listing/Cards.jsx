import React, { useState } from "react";
import Location_Icon from "../../assets/location-icon.svg";
import { MoreVertical } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Cards(props) {
  const [menuOpen, setMenuOpen] = useState(false); // ✅ moved here
  const [expanded, setExpanded] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showSelectPopup, setShowSelectPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);


  useEffect(() => {
    let start = 0;
    const end = props.match_score;
    const duration = 500; // 1 second
    const frameRate = 10; // ms per frame
    const increment = (end / duration) * frameRate;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setAnimatedScore(Math.floor(start));
    }, frameRate);

    return () => clearInterval(timer); // cleanup
  }, [props.match_score]);

  const toggleSkills = () => setShowMoreSkills((prev) => !prev);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out', // add this for smoothness
    });

    AOS.refresh(); // This is key when rendering conditionally
  }, []);

  const token = sessionStorage.getItem("authToken") || "your-fallback-token";
  const axiosInstance = axios.create({
    baseURL: "https://jse.arshan.digital/b1/api",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const onSave = async () => {
    try {
      setIsSaved(true);
      setIsFadingOut(true);
      setShowSavePopup(true);

      // Delay the card disappearance & API call by 2 seconds
      setTimeout(async () => {
        setShowCard(false);



        try {
          const response = await axios.post(
            "https://jse.arshan.digital/b1/saved-jobs",
            { job_id: props.job_id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data;
        } catch (error) {
          console.error("Error saving job:", error);
        }

        setTimeout(() => setShowSavePopup(false), 1500);

      }, 2000);

    } catch (error) {
      console.error("Error in onSave:", error);
    }
  };

  const onSelect = async () => {
    const today = new Date().toLocaleDateString();
    let storedData = JSON.parse(localStorage.getItem("selectedJobs") || "{}");
  
    if (!storedData.date || storedData.date !== today) {
      storedData = { date: today, count: 0 };
    }
  
    if (storedData.count >= 10) {
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2000);
      return;
    }
  
    try {
      setIsSelected(true);
      setIsFadingOut(true);
      setShowSelectPopup(true);
  
      setTimeout(async () => {
        setShowCard(false);
  
        const jobPayload = {
          ...props,
          match_score: props.match_score,
          matchValue: props.match_score,
        };
  
        try {
          await axiosInstance.post("/selected-jobs", jobPayload);
  
          // ✅ Only update localStorage if the API call succeeds
          storedData.count += 1;
          localStorage.setItem("selectedJobs", JSON.stringify(storedData));
        } catch (error) {
          console.error("Error selecting job:", error);
  
          // ❌ Roll back UI if error
          setIsSelected(false);
          setIsFadingOut(false);
          setShowCard(true);
          setShowErrorPopup(true);
          setTimeout(() => setShowErrorPopup(false), 2000);
        }
  
        setTimeout(() => setShowSelectPopup(false), 1500);
      }, 2000);
    } catch (error) {
      console.error("Error in onSelect:", error);
    }
  };
  
  


  return (
    <div className="flex flex-wrap">
      {showCard &&
        (<div
          className={`relative w-full flex border border-gray-200 bg-white rounded-xl font-[Montserrat] transition-opacity duration-1000 ${isFadingOut ? "opacity-0" : "opacity-100"
            }`}        >
          <div className="relative w-full flex border border-gray-200 bg-white rounded-xl font-[Montserrat]">
            {/* Top-right 3-dots menu */}
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={toggleMenu}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="More options"
              >
                <MoreVertical size={20} />
              </button>

              {menuOpen && (
                <div className="absolute top-8 right-0 bg-white border shadow-lg p-1 z-10">
                  <button onClick={onSave} className="block w-full text-sm text-left px-2 py-1  hover:bg-[#2C6472] hover:text-white duration-300 ease-in-out">
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* Left Side - Job Info */}
            <div className="flex w-1/2 p-6 gap-6">
              <div className="flex flex-col justify-center gap-2">
                <h3 className="text-[#2C6472] font-bold text-[19px] leading-[100%]">
                  {props.title}
                </h3>
                <div>
                  <p className="font-semibold">
                    {props.company} &nbsp; • &nbsp;{" "}
                    <span className="text-[#2C6472] text-sm">
                      {props.postedDate}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <img src={Location_Icon} alt="Location" />
                  <p className="text-[#00000091] text-sm font-medium">
                    {props.location}
                  </p>
                </div>
                <p className="text-[#00000077] text-sm mt-3">
                  {expanded ? (
                    <>
                      {props.description}
                      &nbsp;
                      <button
                        onClick={() => setExpanded(false)}
                        className="text-[#2C6472] font-semibold text-sm underline text-justify"
                      >
                        show less
                      </button>
                    </>
                  ) : props.description.split(" ").length > 50 ? (
                    <>
                      {props.description.split(" ").slice(0, 50).join(" ")}
                      ... &nbsp;
                      <button
                        onClick={() => setExpanded(true)}
                        className="text-[#2C6472] font-semibold text-sm underline"
                      >
                        more
                      </button>
                    </>
                  ) : (
                    props.description
                  )}
                </p>

              </div>
            </div>

            <div className="mt-[32px] w-px h-[70%] bg-gray-200"></div>

            {/* Right Side - Skills + Match */}
            <div className="flex p-6 w-1/2">
              <div className="flex flex-col gap-4 w-1/2">
                {props.skillData.map((item, index) => (
                  <div key={index} className=" ">
                    <h3 className="font-semibold text-lg mb-1">{item.label}</h3>
                    {item.label === "Required Skills" ? (
                      <>
                        <p className="text-gray-700 leading-relaxed">
                          {showMoreSkills
                            ? item.value
                            : item.value.split(",").slice(0, 3).join(", ") +
                            (item.value.split(",").length > 3 ? "..." : "")}
                        </p>
                        {item.value.split(",").length > 4 && (
                          <button
                            onClick={toggleSkills}
                            className="text-[#2C6472] font-semibold text-sm underline"
                          >
                            {showMoreSkills ? "Show Less" : "more"}
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-700">{item.value}</p>
                    )}

                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-5 items-center w-1/2">
                <div className="relative w-24 h-24">
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute top-0 left-0 w-full h-full"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#E5E7EB"
                      strokeWidth="7"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#2c6472"
                      strokeWidth="7"
                      fill="none"
                      strokeDasharray="282"
                      strokeDashoffset={282 - (282 * animatedScore) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-gray-800">
                    {animatedScore}%
                  </div>
                </div>

                <p className="text-xs font-bold">Profile Match</p>
                <button
                  onClick={onSelect}
                  disabled={isSelected}
                  className={`px-7 py-1 text-sm border ${isSelected ? "bg-white border-[#2C6472]" : "text-white bg-[#2C6472] border-[#2C6472]"
                    } text-[#2C6472] rounded-2xl transition-transform hover:scale-105`}
                >
                  {isSelected ? "Selected" : "Select"}
                </button>

              </div>
            </div>
          </div>
        </div>)}

      {showSavePopup && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 bg-white border-b-4 border-[#2C6472] text-black rounded-md shadow-lg transform transition-all duration-500 ease-in-out animate-toast-in`}>
          <div className="relative px-3 py-1">
            <span>✅ Job saved successfully!</span>
            <div className="absolute bottom-0 left-0 h-[3px] bg-white animate-progress w-full" />
          </div>
        </div>
      )}

      {showSelectPopup && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-white border-b-4 border-green-600 text-black rounded-md shadow-lg transform transition-all duration-500 ease-in-out animate-toast-in">
          <div className="relative px-3 py-1">
            <span>✅ Job selected successfully!</span>
            <div className="absolute bottom-0 left-0 h-[3px] bg-white animate-progress w-full" />
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-white border-b-4 border-red-600 text-black rounded-md shadow-lg transform transition-all duration-500 ease-in-out animate-toast-in">
          <div className="relative px-3 py-1">
            <span>❌ Your daily job selection limit is over for today!
            </span>
            <div className="absolute bottom-0 left-0 h-[3px] bg-white animate-progress w-full" />
          </div>
        </div>
      )}



  



    </div>
  );
}

export default Cards;
