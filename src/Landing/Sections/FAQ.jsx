import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import arrow from "../../assets/arrow-right.svg";

const faqs = [
  {
    question: "What is JSE AI and how does it work?",
    answer:
      "JSE AI is an advanced job platform that uses artificial intelligence to match job seekers with precise opportunities. Our AI analyzes your profile, skills, and preferences to recommend jobs that align with your career goals. The platform automates application processes and provides personalized career insights.",
  },
  {
    question: "How accurate is the AI job matching?",
    answer:
      "Our AI matching system has a 92% success rate. It continuously learns from user's experience and projects to improve recommendations.",
  },
  {
    question: "What’s included in the 7-day free trial?",
    answer:
      "During your free trial, you get limited access to all Basic plan features including CV & Cover Letter automation, job recommendations, language filters, and our AI matching system. No credit card required to start.",
  },
  {
    question: "How does the CV and Cover Letter automation work?",
    answer:
      "Our AI automatically tailors your CV and cover letter for each job application based on the job requirements and your profile. You can review, edit & change format before downloading.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access to paid features until the end of your billing period.",
  },
];

const FAQ = () => {
  const [openStates, setOpenStates] = useState(faqs.map(() => false));

  const toggleFAQ = (index) => {
    setOpenStates((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  return (
    <section className="max-w-[1100px] mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-5">
        Frequently Asked Questions
      </h2>
      <p className="mb-10 text-gray-500 font-medium">
        Got questions? We’ve got answers. <br /> Find everything you need to
        know about JSE AI.
      </p>

      <div className="space-y-4 px-10">
        {faqs.map((faq, index) => {
          const isOpen = openStates[index];
          return (
            <motion.div
              key={index}
              layout
              initial={{ borderRadius: 10 }}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              <motion.button
                layout
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-8 py-6 text-lg text-left font-bold text-black"
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

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, maxHeight: 0 }}
                    animate={{ opacity: 1, maxHeight: 500 }} // set max height to a big enough number
                    exit={{ opacity: 0, maxHeight: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="px-8 pb-4 text-sm text-gray-500 font-medium overflow-hidden"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;