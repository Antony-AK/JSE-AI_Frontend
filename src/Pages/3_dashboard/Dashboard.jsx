import React, { useEffect, useState } from 'react'
import profile from "../../assets/profile1.png"
import total_app_icon from "../../assets/total-app.svg"
// import jobs_available_icon from "../../assets/jobs-available.svg"
// import selectable_jobs_icon from '../../assets/selectable-jobs.svg'
// import total_experience_icon from '../../assets/total-experience.svg'
import complete from '../../assets/complete.svg'
import incomplete from '../../assets/incomplete.svg'
import announcements from '../../assets/announcements-icon.svg'
import AOS from "aos";
import "aos/dist/aos.css";

const Dashboard = () => {

  const designations = [
    "Ui/Ux designer",
    "Frontend Developer",
    "Data Analyst"
  ];

  const statusList = [
    { label: "Work Experience — Incomplete", isComplete: false },
    { label: "Projects — Incomplete", isComplete: false },
    { label: "Certificates / Awards — Incomplete", isComplete: false },
    { label: "Designation — Complete", isComplete: true },
    { label: "Education — Complete", isComplete: true },
    { label: "Personal Information — Completed", isComplete: true }
  ];

  const jobs = [
    {
      title: "Ui/Ux Designer",
      company: "UST Global",
      location: "Trivandrum, Kerala, India",
      profileMatch: 70
    },
    {
      title: "Frontend Developer",
      company: "Infosys",
      location: "Bangalore, Karnataka, India",
      profileMatch: 50
    },
    {
      title: "Data Analyst",
      company: "TCS",
      location: "Hyderabad, Telangana, India",
      profileMatch: 85
    }
  ];    

  const [animatedCompletion, setAnimatedCompletion] = useState(0);

  const [animatedCompletions, setAnimatedCompletions] = useState(
    jobs.map(() => 0) // Initialize each to 0
  );

  const targetCompletion = Math.round(
    (statusList.filter(item => item.isComplete).length / statusList.length) * 100
  );

  useEffect(() => {
    const duration = 500;
    const intervalTime = 5;
    const intervals = [];

    // Animate animatedCompletions (job match scores)
    jobs.forEach((job, index) => {
      let start = 0;
      const step = job.profileMatch / (duration / intervalTime);

      const interval = setInterval(() => {
        start += step;
        if (start >= job.profileMatch) {
          start = job.profileMatch;
          clearInterval(interval);
        }

        setAnimatedCompletions(prev => {
          const updated = [...prev];
          updated[index] = Math.round(start);
          return updated;
        });
      }, intervalTime);

      intervals.push(interval);
    });

    // ✅ Animate main profile completion
    const target = targetCompletion; // Set your actual profile completion percentage here
    let mainStart = 0;
    const mainStep = targetCompletion / (duration / intervalTime);
    const mainInterval = setInterval(() => {
      mainStart += mainStep;
      if (mainStart >= target) {
        mainStart = target;
        clearInterval(mainInterval);
      }
      setAnimatedCompletion(Math.round(mainStart));
    }, intervalTime);

    intervals.push(mainInterval);

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="flex flex-col gap-5 bg-gray-100 p-5 ps-7">

      <div className="flex justify-between items-center w-full pl-5 pr-5">

        <div className="relative flex bg-gradient-to-br from-[#FFC2B0] to-[#FF9AA2] h-[100px] w-[230px] text-black p-4 rounded-xl">
          <div className="flex flex-col justify-start items-start gap-5">
            <p className="font-bold">Total Application</p>          
            <h3 className="font-bold">250</h3>
          </div>
          <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm w-fit h-fit">
            <img width="22px" height="22px" className="p-1" src={total_app_icon} alt="" />
          </div>
        </div>

        <div className="relative flex bg-gradient-to-br from-[#FDA67B] to-[#FF9D6B] h-[100px] w-[230px] text-black p-4 rounded-xl">
          <div className="flex flex-col justify-start items-start gap-5">
            <p className="font-bold">Weekly Applied Jobs</p>          
            <h3 className="font-bold">250</h3>
          </div>
          <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm w-fit h-fit">
            <img width="22px" height="22px" className="p-1" src={total_app_icon} alt="" />
          </div>
        </div> 

        <div className="relative flex bg-gradient-to-br from-[#BDE4FB] to-[#A3C7FD] h-[100px] w-[230px] text-black p-4 rounded-xl">
          <div className="flex flex-col justify-start items-start gap-5">
            <p className="font-bold">Top Jobs For You</p>          
            <h3 className="font-bold">250</h3>
          </div>
          <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm w-fit h-fit">
            <img width="22px" height="22px" className="p-1" src={total_app_icon} alt="" />
          </div>
        </div> 

        <div className="relative flex bg-gradient-to-br from-[#6FE297] to-[#48D77A] h-[100px] w-[230px] text-black p-4 rounded-xl">
          <div className="flex flex-col justify-start items-start">
            <p className="font-bold">Remaining Application</p> 
            <p className='font-semibold'>18 / 20</p>         
            <h3 className="font-semibold">Silver Package</h3>
          </div>
          <div className="absolute bottom-3 right-3 flex rounded-full p-1.5 bg-gray-200/30 backdrop-blur-sm w-fit h-fit">
            <img width="22px" height="22px" className="p-1" src={total_app_icon} alt="" />
          </div>
        </div>        

      </div>   

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Grid - 1 */}
        <div className="flex flex-col lg:col-span-2 space-y-2">

          {/* Box - 1 */}
          <div className="flex flex-col gap-2 border rounded-xl p-5 bg-white space-y-3">
                 
            {/* Profile Header Section */}
            <div className="flex items-center justify-between">
              {/* Image + Name/Title */}
              <div className="flex items-center space-x-4">
                <img
                  src={profile}
                  alt=''
                  className="w-14 h-14 rounded-full bg-white object-cover  "
                />
                <div className="flex flex-col">
                  <h3 className="text-[15px] font-bold">Steve</h3>
                  <p className="text-sm text-gray-500">FullStack Developer</p>
                </div>
              </div>

              {/* Profile Completion Circle */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14">
                  <svg className="absolute top-0 left-0 w-full h-full">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="#2c6472"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="150"
                      strokeDashoffset={150 - (150 * animatedCompletion) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 28 28)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                    {animatedCompletion}%
                  </div>
              </div>
              <span className="text-xs font-medium text-gray-600">Profile Complete</span>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-t-[#0000000F]"></div>

          {/* Designation */}
          <div className="flex flex-col gap-2">
            <h2 className='font-bold text-[15px]'>Designation</h2>

            <div className="flex flex-wrap gap-2">
              {designations.map((title, index) => (
                <p
                  key={index}
                  className='text-sm font-medium px-3.5 py-1.5 rounded-xl bg-[#F8F8F8] w-fit'
                >
                  {title}
                </p>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <h2 className='font-bold text-[15px]'>Complete every section to make JSE AI work</h2>

            <div className="flex flex-col gap-2 px-3 py-3 h-[98px] rounded-lg bg-[#F8F8F8] overflow-y-auto hide-scrollbar">
              {statusList.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <img width="18px" src={item.isComplete ? complete : incomplete} alt="" />
                  <p className='font-medium text-sm'>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Box - 2 */}
        <div className="border rounded-xl p-5 bg-white space-y-3">

          <h2 className='font-bold text-[15px]'>Proficiency Test Details</h2>

          <div className="flex items-center gap-4">

            <p className='text-sm'>Remaining Attempts:</p>
            <span className='font-bold'>2 / 5</span>
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-[#2c6472]"></div>
              <div className="w-4 h-4 rounded-full bg-[#2c6472]"></div>
              <div className="w-4 h-4 rounded-full bg-[#0000001A]"></div>
              <div className="w-4 h-4 rounded-full bg-[#0000001A]"></div>
              <div className="w-4 h-4 rounded-full bg-[#0000001A]"></div>
            </div>

          </div>

          <div className="flex flex-col gap-2">
            <div className="flex text-sm">
              <div className="flex text-sm items-center">
                <p className='font-semibold w-40'>Language:</p>
                <select
                  className="px-2 py-1 bg-[#0000000F] rounded-md text-sm font-semibold outline-none"
                  defaultValue="German"
                >
                  <option value="English">English</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>
            </div>

            <div className="flex text-sm">
              <p className='font-semibold w-40'>Grade:</p>
              <p className='font-semibold'>B1</p>
            </div>

            <div className="flex text-sm">
              <p className='font-semibold w-40'>Proficiency Level:</p>
              <p className='font-semibold'>Intermediate</p>
            </div>
          </div>

        </div>

      </div>

      {/* Grid - 2 */}
      <div className="lg:col-span-3 space-y-2">

        {/* Box - 3 */}
        <div className="flex flex-col gap-2.5 border rounded-xl p-5 bg-white space-y-3">
          <div className="flex justify-between">
            <h2 className='font-bold text-[15px]'>New Jobs for you</h2>
            <a className='text-[#2c6472] font-medium' href="#">View All</a>
          </div>

          {jobs.map((job, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between">
                <div className="flex flex-col gap-1">
                  <h2 className='font-semibold text-[#2c6472]'>{job.title}</h2>
                  <p className='font-medium text-sm'>{job.company}</p>
                  <p className='text-sm'>{job.location}</p>
                </div>

                {/* Profile Completion Circle */}
                <div className="flex flex-col items-center mr-5">
                  <div className="relative w-14 h-14">
                    <svg className="absolute top-0 left-0 w-full h-full">
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="#E5E7EB"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="#2c6472"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="150"
                        strokeDashoffset={150 - (150 * animatedCompletions[index]) / 100}
                        strokeLinecap="round"
                        transform="rotate(-90 28 28)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                      {animatedCompletions[index]}%
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 mt-1">Profile Match</span>
                </div>
              </div>

              {/* Divider */}
              {index !== jobs.length - 1 && (
                <div className="mx-auto border-t border-t-[#0000000F] w-[97%]"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Box - 4 */}
        <div className="border rounded-xl p-5 bg-white space-y-3">
          <div className="flex justify-between">
            <div className="flex gap-4">
              <h2 className='font-bold text-[15px]'>Announcements</h2>
              <img src={announcements} alt="" />
            </div>
            <div className="">
              <a className='text-[#2c6472] font-medium' href="">View All</a>
            </div>
          </div>

          <p className='text-[#000000A1] font-medium text-sm'>The new version of <span className='text-[#2c6472] font-semibold'>JSE AI </span>
          brings major improvements across the
          platform. With advanced AI matching, optimized performance, and a
          refreshed UI, the app is now smarter and faster than ever before.
          These upgrades aim to make your job search smoother and more
          effective. </p>
        </div>

      </div>

      </div>
    </div>
  )
}

export default Dashboard