import React from "react";
import { FaStar } from "react-icons/fa";
import avatar_1 from '../../assets/avatar-1.png'
import avatar_2 from '../../assets/avatar-2.png'
import avatar_3 from '../../assets/avatar-3.png'
import avatar_4 from '../../assets/avatar-4.png'
import avatar_5 from '../../assets/avatar-5.png'

const testimonials = [
  {
    name: "Ravi Menon",
    role: "Data Analyst",
    image: avatar_1,
    rating: 5,
    feedback:
      "This platform gave me complete visibility into my job applications. Within 10 days, I got 3 callbacks!",
  },
  {
    name: "Daniel Cruz",
    role: "Frontend Engineer",
    image: avatar_2,
    rating: 5,
    feedback:
      "Loved the way it organized my skills and resume! Everything looked so professional and clean.",
  },
  {
    name: "Mehul Sinha",
    role: "AI Research Intern",
    image: avatar_3,
    rating: 5,
    feedback:
      "Being new to the field, I was confused where to start. JSE AI guided me step-by-step. I finally feel confident!",
  },
  {
    name: "Karthik Sharma",
    role: "DevOps Engineer",
    image: avatar_4,
    rating: 5,
    feedback:
      "I didn’t expect much, but wow! The automated job matching and resume tracking blew my mind. Super efficient.",
  },
  {
    name: "Jay Patel",
    role: "UX Designer",
    image: avatar_5,
    rating: 5,
    feedback:
      "The design, ease of use, and how everything flows—this feels built for job seekers like me. Total game changer!",
  },
];



const Testimonial = () => {
  return (
    <section className=" h-[70vh]   bg-white px-4">
      {/* Title & Subheading */}
      <div className="mb-14 max-w-[1200px] mt-20 mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-semibold">What Our Users Say</h2>
        <p className="text-sm sm:text-[15px] text-gray-400 mt-1 font-semibold">
          Join thousands of professionals who have transformed their careers
          <br className="hidden sm:block" /> with JSE AI.
        </p>
      </div>

      {/* Scrollable testimonials */}
      <div className="w-full overflow-hidden">
        <div className="flex gap-6 animate-marquee w-max">
          {[...testimonials, ...testimonials].map((user, index) => (
            <div
              key={index}
              className="w-[300px] h-[160px] sm:w-[380px] sm:h-[180px] border rounded-lg p-5 sm:p-6 shadow-sm flex-shrink-0"
            >
              <div className="flex items-center mb-4">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-4 object-cover"
                />

                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-bold text-sm sm:text-base">{user.name}</p>
                    <div className="flex gap-1 text-[#2c6472]">
                      {[...Array(user.rating)].map((_, i) => (
                        <FaStar key={i} className="w-3 h-3 sm:w-4 sm:h-4" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-800">
                    {user.role}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-medium">{user.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
