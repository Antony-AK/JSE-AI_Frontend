import React from "react";
import { FaStar } from "react-icons/fa";
import profile from "../../assets/profile.jpg";
import avatar_1 from '../../assets/avatar-1.png'
import avatar_2 from '../../assets/avatar-2.png'
import avatar_3 from '../../assets/avatar-3.png'
import avatar_4 from '../../assets/avatar-4.png'
import avatar_5 from '../../assets/avatar-5.png'

const testimonials = [
  {
    name: "Andrew",
    role: "Product Designer",
    image: avatar_1,
    rating: 5,
    feedback:
      "AI made the job hunt effortless. Applied to 30+ roles in one week and landed interviews!",
  },
  {
    name: "Steve",
    role: "Frontend Developer",
    image: avatar_2,
    rating: 5,
    feedback:
      "The AI-generated CV and tracking dashboard gave me clarity I never had before. Highly recommended!",
  },
  {
    name: "Frank",
    role: "Backend Developer",
    image: avatar_3,
    rating: 5,
    feedback:
      "The internal & external job options are super useful. JSE AI’s AI-powered system shows exactly what fits me.",
  },
  // repeat to make scroll smooth
  {
    name: "Andrew",
    role: "Product Designer",
    image: avatar_4,
    rating: 5,
    feedback:
      "AI made the job hunt effortless. Applied to 30+ roles in one week and landed interviews!",
  },
  {
    name: "Steve",
    role: "Frontend Developer",
    image: avatar_5,
    rating: 5,
    feedback:
      "The AI-generated CV and tracking dashboard gave me clarity I never had before. Highly recommended!",
  },
];

const Testimonial = () => {
  return (
    <section className="py-12 h-[60vh] relative z-[999] bg-white px-4">
      {/* Title & Subheading */}
      <div className="mb-14 max-w-[1100px] mx-auto px-4">
        <h2 className="text-2xl font-semibold">What Our Users Say</h2>
        <p className="text-gray-400 mt-1 text-[15px] font-semibold">
          Join thousands of professionals who have transformed their careers
          <br /> with JSE AI.
        </p>
      </div>

      {/* Scrollable testimonials */}
      <div className="w-full overflow-hidden">
        <div className="flex gap-6 animate-marquee w-max">
          {[...testimonials, ...testimonials].map((user, index) => (
            <div
              key={index}
              className="w-[380px] h-[180px] border rounded-lg p-6 shadow-sm flex-shrink-0"
            >
              <div className="flex items-center mb-4">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-14 h-14 rounded-full mr-4 object-cover"
                />

                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-bold">{user.name}</p>
                    <div className="flex gap-1 text-[#2c6472]">
                      {[...Array(user.rating)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {user.role}
                  </p>
                </div>
              </div>

              <p className="text-sm font-medium">{user.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;