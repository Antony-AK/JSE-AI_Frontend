import React, { useState } from "react";
import { motion } from "framer-motion";
import arrow from "../../assets/arrow-right.svg";

const faqs = [
  {
    question: "What is JSE AI and how does it work?",
    answer:
      "JSE AI is an advanced job portal that uses artificial intelligence to match job seekers with perfect opportunities. Our AI analyzes your profile, skills, and preferences to recommend jobs that align with your career goals. The platform automates application processes and provides personalized career insights."
  },
  {
    question: "How accurate is the AI job matching?",
    answer:
      "Our AI job matching system, with a 95% success rate, is based on your skills, experience, and projects. It compares and analyzes job opportunities, displaying only those with a suitability score of 50% or higher. Jobs with an 80% or greater suitability score are prioritized in your recommended jobs list, ensuring highly relevant matches tailored to your profile. More Data you give more accurate it will get."
  },
  {
    question: "How does the AI improve my applications?",
    answer:
      "The AI analyzes your experience and professional details to highlight relevant skills and achievements, aligning them with job descriptions you provide. It adapts content to different industries and roles, saving you time while improving your application’s impact."
  },
  {
    question: "Can I customize my CVs and cover letters?",
    answer:
      "Absolutely! You can edit AI-generated drafts, add personal touches, rearrange sections, and choose from multiple design templates to match your style or industry standards."
  },
  {
    question: "How quickly can I create an application?",
    answer:
      "With JSE Ai, you can generate a draft CV or cover letter in minutes by entering your details. Editing, finalizing typically takes 5 - 10 minutes, depending on your customization needs."
  },
  {
    question: "Does JSE Ai offer support for job interviews?",
    answer:
      "While JSE Ai focuses on application materials, it provides tips within the platform based on your professional details to prepare for interviews, such as common questions for each company, background of the company and their current projects related to your experience."
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faqs"
      className="max-w-[1100px] h-[100vh] mx-auto px-4 sm:px-6 md:px-10 py-10"
    >
      <h2 className="text-xl sm:text-2xl font-semibold mb-5">
        Frequently Asked Questions
      </h2>
      <p className="mb-10 text-sm sm:text-base text-gray-500 font-medium">
        Got questions? We’ve got answers. <br /> Find everything you need to
        know about JSE AI.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              layout
              initial={{ borderRadius: 10 }}
              className="border rounded-lg overflow-hidden shadow-sm"
              transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
            >
              <motion.button
                layout="position"
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg text-left font-bold text-black"
              >
                <span>{faq.question}</span>
                <motion.img
                  src={arrow}
                  alt="arrow"
                  animate={{ rotate: isOpen ? 90 : -90 }}
                  transition={{ duration: 0.3 }}
                  className="w-4 h-3"
                />
              </motion.button>

              {isOpen && (
                <motion.div
                  layout
                  className="px-6 sm:px-8 pb-5 sm:pb-6 text-xs leading-relaxed sm:text-sm md:text-[15px] text-gray-600 font-medium"
                  transition={{
                    layout: { duration: 0.3, ease: "easeInOut" },
                  }}
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
