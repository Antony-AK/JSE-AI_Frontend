import React, { useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import tick from "../../assets/green-tick.png";

const plans = [
  {
    name: "Advanced",
    label: "Essential Features",
    price: {
      monthly: "€ 35",
      quarterly: "€ 95",
    },
    features: {
      monthly: [
        "CV & CL Automation: 240 Included",
        "External CV/CL Automation:35",
        "Application Tracker",
        "Recommended Jobs",
        "Language Filter",
        "Priority Support",
        "Job Research: 9",
      ],
      quarterly: [
        "CV & CL Automation: 720 Included",
        "External CV/CL Automation:105",
        "Application Tracker",
        "Recommended Jobs",
        "Language Filter",
        "Priority Support",
        "Job Research: 9",
      ],
    },
    buttonText: "Coming Soon",
    isAvailable: false,
  },
  {
    name: "Basic",
    label: "Include Benefits",
    price: {
      monthly: "€ 25",
      quarterly: "€ 68",
    },
    features: {
      monthly: [
        "CV & CL Automation: 5 Included",
        "External CV/CL Automation:2",
        "Application Tracker",
        "Recommended Jobs",
        "Language Filter",
        "Basic Support",
      ],
      quarterly: [
        "CV & CL Automation: 450 Included",
        "External CV/CL Automation:60",
        "Application Tracker",
        "Recommended Jobs",
        "Language Filter",
        "Basic Support",
      ],
    },
    buttonText: "Get Started",
    isAvailable: true,
    isPopular: true,
  },
  {
    name: "Premium",
    label: "For Extra Benefits",
    price: {
      monthly: "€ 35",
      quarterly: "€ 149",
    },
    features: {
      monthly: [
        "CV & CL Automation: 360 Included",
        "External CV/CL Automation:75",
        "Learning Roadmap Skills",
        "Autofill tools for external Jobforms",
        "Priority Support",
        "Job Research: 15",
      ],
      quarterly: [
        "CV & CL Automation: 1080 Included",
        "External CV/CL Automation:225",
        "Learning Roadmap Skills",
        "Autofill tools for external Jobforms",
        "Priority Support",
        "Job Research: 15",
      ],
    },
    buttonText: "Coming Soon",
    isAvailable: false,
  },
];

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("quarterly");

  return (
    <div id="pricing" className="flex flex-col gap-5 px-4 py-12">
      <div className="flex flex-col justify-center gap-5 text-center mb-10">
        <h2 className="text-2xl font-semibold">Choose Your Perfect Plan</h2>
        <p className="text-gray-500 font-semibold">
          Start with our 7-day free trial, then choose the plan <br />
          that fits your career goals.
        </p>

        {/* Toggle Buttons with Framer Motion */}
        <LayoutGroup>
          <div className="relative flex bg-gray-200 p-1 rounded-md w-fit mx-auto">
            {["monthly", "quarterly"].map((type) => (
              <button
                key={type}
                onClick={() => setBillingCycle(type)}
                className={`relative px-14 py-2 text-sm font-semibold rounded-md z-10 ${
                  billingCycle === type ? "text-black" : "text-gray-500"
                }`}
              >
                {billingCycle === type && (
                  <motion.div
                    layoutId="pill"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute inset-0 bg-white shadow rounded-md z-0"
                  />
                )}
                <span className="relative z-10 capitalize">{type}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 px-4">
        {plans.map((plan, idx) => (
          <div key={idx} className="perspective h-[500px] relative">
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2c6472] font-semibold text-white text-xs px-3 py-1 rounded-full shadow-md z-50">
                Most Popular
              </div>
            )}

            <motion.div
              animate={{
                rotateY: billingCycle === "monthly" ? 0 : 180,
              }}
              transition={{ duration: 0.1, ease: "linear" }}
              className={`relative w-full h-full preserve-3d rounded-xl border hover:shadow-md transition-all duration-300 ${
                plan.isPopular
                  ? "scale-110 border-[#2c6472] bg-white"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden p-6">
                <h3 className="text-lg font-bold text-center">{plan.name}</h3>
                <p className="text-center text-lg font-bold my-2">
                  {plan.price.monthly}
                  <span className="text-sm font-medium text-gray-500">
                    {" "}
                    / monthly
                  </span>
                </p>
                <ul className="flex flex-col gap-2 text-sm text-gray-700 mb-6 mt-8 space-y-2">
                  {plan.features.monthly.map((feature, i) => (
                    <li
                      key={i}
                      className="flex justify-start items-center px-5"
                    >
                      <img
                        src={tick}
                        alt="tick"
                        className="w-5 h-5 mr-3 mt-1"
                      />
                      <span className="font-medium text-gray-500 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  disabled={!plan.isAvailable}
                  className={`w-full py-2 text-sm font-medium rounded-md ${
                    plan.isAvailable
                      ? "bg-[#2c6472] text-white hover:bg-[#265864] mt-12"
                      : "bg-black text-white opacity-70 mt-2"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 p-6">
                <h3 className="text-lg font-bold text-center">{plan.name}</h3>
                <p className="text-center text-lg font-bold my-2">
                  {plan.price.quarterly}
                  <span className="text-sm font-medium text-gray-500">
                    {" "}
                    / quarterly
                  </span>
                </p>
                <ul className="flex flex-col gap-2 text-sm text-gray-700 mb-6 mt-8 space-y-2">
                  {plan.features.quarterly.map((feature, i) => (
                    <li
                      key={i}
                      className="flex justify-start items-center px-5"
                    >
                      <img
                        src={tick}
                        alt="tick"
                        className="w-5 h-5 mr-3 mt-1"
                      />
                      <span className="font-medium text-gray-500 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  disabled={!plan.isAvailable}
                  className={`w-full py-2 text-sm font-medium rounded-md ${
                    plan.isAvailable
                      ? "bg-[#2c6472] text-white hover:bg-[#265864] mt-12"
                      : "bg-black text-white opacity-70 mt-2"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;