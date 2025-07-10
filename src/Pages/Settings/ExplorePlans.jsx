import React, { useState, useEffect } from 'react'
import tick from '../../assets/tick.svg'
import { BASE_URL } from '../../utils/api'

const ExplorePlans = () => {

    const [data, setData] = useState(null);
    const [selected, setSelected] = useState("monthly");

    const token = sessionStorage.getItem("authToken");

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");

        if (!token) {
            console.warn("No token found.");
            return;
        }

        fetch(`${BASE_URL}/settings/explore-plans`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error("Failed to fetch plans", err));
    }, []);

    const highlightsData = {
        monthly: [
            {
            plan: 'Free',
            items: [
                'Targeted Job',
                'CV & CL Automation:5 included',
                'External CV/CL:2 included',
                'Application Tracker',
            ],
            },
            {
            plan: 'Basic',
            items: [
                'CV & CL Automation: 150 Included',
                'External CV/CL Automation: 20 Included',
                'Recommended Jobs',
                'Language Filter',
                'Basic Support',
            ],
            },
            {
            plan: 'Advanced',
            items: [
                'CV & CL Automation: 240 Included',
                'External CV/CL Automation: 35',
                'Job Research: 9 included',
                'Language Test Free MCQ’s',
                'Spoken Test',
                'Priority Support',
            ],
            },
            {
            plan: 'Premium',
            items: [
                'CV & CL Automation: 360 Included',
                'External CV/CL Automation: 75',
                'Job Research: 15 Included',
                'Learning Roadmap & Skills',
                'Autofill Tools for External Jobforms',
                'Priority Support',
            ],
            },
        ],
        quarterly: [
            {
            plan: 'Free',
            items: [
                'Targeted Job',
                'CV & CL Automation:5 included',
                'External CV/CL:2 included',
                'Application Tracker',
            ],
            },
            {
            plan: 'Basic',
            items: [
                'CV & CL Automation: 450 Included',
                'External CV/CL Automation: 60 Included',
                'Recommended Jobs',
                'Language Filter',
                'Basic Support',
            ],
            },
            {
            plan: 'Advanced',
            items: [
                'CV & CL Automation: 720 Included',
                'External CV/CL Automation: 105 Docs',
                'Job Research: 9 included',
                'Language Test Free MCQ’s',
                'Spoken Test',
                'Priority Support',
            ],
            },
            {
            plan: 'Premium',
            items: [
                'CV & CL Automation: 1080 Included',
                'External CV/CL Automation: 225',
                'Job Research: 15 Included',
                'Learning Roadmap & Skills',
                'Autofill Tools for External Jobforms',
                'Priority Support',
            ],
            },
        ],
    };    

    const features = [
        { name: 'Targeted Job', monthly: [true, true, true, true], quarterly: [true, true, true, true] },
        { name: 'CV Automation', monthly: [5, 150, 240, 360], quarterly: [5, 450, 720, 1080] },
        { name: 'CL Automation', monthly: [5, 150, 240, 360], quarterly: [5, 450, 720, 1080] },
        { name: 'External CV/CL', monthly: [2, 20, 35, 75], quarterly: [2, 60, 105, 225] },
        { name: 'Application Tracker', monthly: [true, true, true, true], quarterly: [true, true, true, true] },
        { name: 'Job Suitability', monthly: [true, true, true, true], quarterly: [true, true, true, true] },
        { name: 'Language Proficiency Test', monthly: [false, false, true, true], quarterly: [false, false, true, true] },
        { name: 'Language Spoken Test', monthly: [false, false, '€10', 1], quarterly: [false, false, '€10', 3] },
        { name: 'Language Filter', monthly: [false, true, true, true], quarterly: [false, true, true, true] },
        { name: 'Recommended Jobs', monthly: [false, true, true, true], quarterly: [false, true, true, true] },
        { name: 'Job Research', monthly: [false, false, 3, 5], quarterly: [false, false, 9, 15] },
        { name: 'Learning Skills', monthly: [false, false, false, true], quarterly: [false, false, false, true] },
        { name: 'Autofill tools', monthly: [false, false, false, true], quarterly: [false, false, false, true] },
        { name: 'Support', monthly: [false, false, false, true], quarterly: [false, false, false, true] },
    ];


    const activePlan =
        data?.plans?.monthly?.find(p => p.status === "active") ||
        data?.plans?.quarterly?.find(p => p.status === "active");


    return (
        <div className='flex flex-col gap-5'>

            {/* Active Plans */}
            {/* Active Plans */}
            <div className="flex flex-col gap-5">
                <h2 className="text-lg font-bold">Active Plan</h2>

                {activePlan ? (
                    <div className="flex flex-col h-[120px] gap-1 rounded-xl bg-[#2c6472] p-5">
                        <h2 className="text-white text-lg font-semibold capitalize">{activePlan.plan}</h2>
                        <p className="text-white text-base">
                            {activePlan.plan === "Free"
                                ? "Enjoy free features at no cost"
                                : `Enjoy ${activePlan.plan} plan benefits`}
                        </p>
                        <p className="text-gray-400 text-sm">
                            € {activePlan.price || "0"} / {activePlan.period}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Loading active plan...</p>
                )}
            </div>


            {/* All Plans */}
            <div className="flex flex-col gap-5">
                <h2 className='text-lg font-bold'>All Plans</h2>

                <div className="flex border border-[#2F6C73] rounded-2xl w-fit overflow-hidden mx-auto mb-5">
                    <button
                        onClick={() => setSelected("monthly")}
                        className={`px-16 py-2 text-sm font-medium ${selected === "monthly"
                            ? "bg-[#2F6C73] text-white"
                            : "text-[#2F6C73] bg-white"
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setSelected("quarterly")}
                        className={`px-16 py-2 text-sm font-medium text-center ${selected === "quarterly"
                            ? "bg-[#2F6C73] text-white"
                            : "text-[#2F6C73] bg-white"
                            }`}
                    >
                        <p className="text-[10px] leading-none">Save 10%</p>
                        <h2 className="text-sm font-medium">Quarterly</h2>
                    </button>
                </div>

                <div className="flex">
                    <div className="flex-1"></div>

                    {data?.plans[selected].map((plan, i) => {
                        const isActive = plan.status === "active";
                        const isComing = plan.status === "coming soon";
                        const isUpgrade = plan.status === "upgrade";

                        const btn = isComing
                            ? { label: "Coming Soon", style: "bg-transparent text-[#2c6472] border-[#00000047]" }
                            : isUpgrade
                                ? { label: "Upgrade", style: "text-white bg-[#2c6472] border-[#2c6472]" }
                                : null;

                        return (
                            <div key={i} className="flex-1 flex flex-col gap-4">
                                <h2 className="font-bold text-lg capitalize">{plan.plan}</h2>
                                <p className="text-sm">€ {plan.price} / {plan.period}</p>

                                {isActive && (
                                    <p className="text-sm flex items-center gap-2 text-[#2c6472]">
                                        <span className="w-2 h-2 bg-[#2c6472] rounded-full" />
                                        Active
                                    </p>
                                )}

                                {btn && (
                                    <button className={`w-32 text-sm font-medium border rounded-xl py-1.5 px-2 hover:scale-105 duration-200 ${btn.style}`}>
                                        {btn.label}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>

           {/* Highlights */}
            <div className="bg-[#2C647221] flex flex-col gap-5 mt-10 p-5">
                <h2 className='font-semibold pl-5'>Highlights</h2>

                <div className="flex">
                    <div className="flex-1"></div>
                    {highlightsData[selected].map((plan, index) => (
                    <div key={index} className="flex flex-col gap-3 flex-1 text-sm font-medium p-1.5">
                        {plan.items.map((item, idx) => (
                        <div key={idx} className="flex gap-1.5">
                            <img src={tick} width="15px" alt="tick" />
                            <p>{item}</p>
                        </div>
                        ))}
                    </div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="w-full flex flex-col gap-2 text-sm font-medium">

                <h2 className='text-lg font-bold'>Features</h2>

                <div className="border border-b-gray-200 h-px my-3"></div>

                {/* Rows */}
                {features.map((feature, i) => (
                    <div
                        key={i}
                        className={`flex py-2.5 px-3 ${i % 2 === 0 ? 'bg-[#2C647221]' : 'bg-white'}`}
                    >
                        <div className="flex-1 font-semibold">{feature.name}</div>
                        {feature[selected].map((value, j) => (
                            <div key={j} className="flex-1 text-center">
                                {value === true ? (
                                    <img src={tick} alt="tick" className="w-4 h-4 mx-auto" />
                                ) : value === false ? (
                                    <span className="text-gray-400">--</span>
                                ) : (
                                    <span className="text-[#2c6472] font-medium">{value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                ))}

            </div>

            <div className="border border-b-gray-200 h-px my-3"></div>

            <div className="flex flex-col gap-5">

                <h2 className='text-lg font-bold'>Other Upgrades</h2>

                <div className="bg-[#2c6472] text-white rounded-xl p-6 flex items-center justify-between w-full mx-auto">
                    <div className='flex flex-col gap-2'>
                        <h2 className="font-bold text-lg">CV & CL Automation</h2>
                        <p className="mt-1 font-medium text-sm">Is your monthly automation completed?</p>
                        <p className="mt-1 text-xs text-gray-200">For 50 CV's & CL's</p>
                    </div>
                    <button className="bg-white text-[#2c6472] text-sm font-semibold px-4 py-2 rounded-md shadow hover:scale-105 transition">
                        Upgrade&nbsp;&nbsp;€&nbsp;15
                    </button>
                </div>

                <div className="bg-[#2c6472] text-white rounded-xl p-6 flex items-center justify-between w-full mx-auto">
                    <div className='flex flex-col gap-2'>
                        <h2 className="font-bold text-lg">External Jobs</h2>
                        <p className="mt-1 font-medium text-sm">Is your monthly external automation completed?</p>
                        <p className="mt-1 text-xs text-gray-200">For 50 CV's & CL's</p>
                    </div>
                    <button className="bg-white text-[#2c6472] text-sm font-semibold px-4 py-2 rounded-md shadow hover:scale-105 transition">
                        Upgrade&nbsp;&nbsp;€&nbsp;15
                    </button>
                </div>

                <div className="bg-[#2c6472] text-white rounded-xl p-6 flex items-center justify-between w-full mx-auto">
                    <div className='flex flex-col gap-2'>
                        <h2 className="font-bold text-lg">Job Research</h2>
                        <p className="mt-1 font-medium text-sm">Do you want more job research?</p>
                        <p className="mt-1 text-xs text-gray-200">For 4 Job Research?</p>
                    </div>
                    <button className="bg-white text-[#2c6472] text-sm font-semibold px-4 py-2 rounded-md shadow hover:scale-105 transition">
                        Upgrade&nbsp;&nbsp;€&nbsp;15
                    </button>
                </div>

            </div>

        </div>
    )
}

export default ExplorePlans