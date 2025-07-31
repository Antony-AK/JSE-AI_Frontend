import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import tick from '../../assets/tick.svg'
import { BASE_URL } from '../../utils/api'
import { t } from "../../utils/i18n";

const ExplorePlans = () => {

    const [data, setData] = useState(null);
    const [selected, setSelected] = useState("monthly");
    const [loadingPlans, setLoadingPlans] = useState(true); // 🆕


    const token = sessionStorage.getItem("authToken");

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");

        if (!token) {
            console.warn("No token found.");
            return;
        }

        const fetchPlans = async () => {
            setLoadingPlans(true); // 🔄 Start loading
            try {
                const res = await fetch(`${BASE_URL}/settings/explore-plans`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const result = await res.json();
                setData(result);
            } catch (err) {
                console.error("Failed to fetch plans", err);
            } finally {
                setLoadingPlans(false); // ✅ Stop loading
            }
        };

        fetchPlans();
    }, []);


    const handlePlanSelect = async (planId) => {
        try {
            const token = sessionStorage.getItem("authToken");
            if (!token) {
                toast.error("Please login first.");
                return;
            }

            const url = `${BASE_URL.replace(/\/$/, '')}/payment/checkout?plan=${planId}`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (response.ok && data?.url) {
                window.open(data.url, "_blank");
            } else {
                toast.success(data.message || "Something went wrong.");
            }
        } catch (err) {
            console.error("Checkout error:", err);
            toast.error("Checkout failed.");
        }
    };

     const highlightsData = {
       monthly: [
         {
           plan: t("plans.free"),
           items: [
             t("features.targetedJob"),
             `${t("features.cvAutomation")}/${t("features.clAutomation")}: 5 included`,
             `${t("features.externalCvCl")}: 2 included`,
             t("features.applicationTracker"),
           ],
         },
         {
           plan: t("plans.basic"),
           items: [
             `${t("features.cvAutomation")}/${t("features.clAutomation")}: 150 Included`,
             `${t("features.externalCvCl")}: 20 Included`,
             t("features.recommendedJobs"),
             t("features.languageFilter"),
             t("features.basicSupport"),
           ],
         },
         {
           plan: t("plans.advanced"),
           items: [
              `${t("features.cvAutomation")}/${t("features.clAutomation")}: 240 Included`,
             `${t("features.externalCvCl")}: 35 Included`,
             `${t("features.jobResearch")}: 9 Included`,
             t("features.languageProficiency"),
             t("features.spokenTest"),
             t("features.prioritySupport"),
           ],
         },
         {
           plan: t("plans.premium"),
           items: [
             `${t("features.cvAutomation")}/${t("features.clAutomation")}: 360 Included`,
             `${t("features.externalCvCl")}: 75 Included`,
             `${t("features.jobResearch")}: 15 Included`,
             t("features.learningSkills"),
             t("features.autofill"),
             t("features.prioritySupport"),
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
    { name: t("features.targetedJob"), monthly: [true, true, true, true], quarterly: [true, true, true, true] },
    { name: t("features.cvAutomation"), monthly: [5, 150, 240, 360], quarterly: [5, 450, 720, 1080] },
    { name: t("features.clAutomation"), monthly: [5, 150, 240, 360], quarterly: [5, 450, 720, 1080] },
    { name: t("features.externalCvCl"), monthly: [2, 20, 35, 75], quarterly: [2, 60, 105, 225] },
    { name: t("features.applicationTracker"), monthly: [true, true, true, true], quarterly: [true, true, true, true] },
    { name: t("features.jobSuitability"), monthly: [true, true, true, true], quarterly: [true, true, true, true] },
    { name: t("features.targetedJob"), monthly: [false, false, true, true], quarterly: [false, false, true, true] },
    { name: t("features.languageProficiency"), monthly: [false, false, '€10', 1], quarterly: [false, false, '€10', 3] },
    { name: t("features.languageFilter"), monthly: [false, true, true, true], quarterly: [false, true, true, true] },
    { name: t("features.recommendedJobs"), monthly: [false, true, true, true], quarterly: [false, true, true, true] },
    { name: t("features.jobResearch"), monthly: [false, false, 3, 5], quarterly: [false, false, 9, 15] },
    { name: t("features.learningSkills"), monthly: [false, false, false, true], quarterly: [false, false, false, true] },
    { name: t("features.autofill"), monthly: [false, false, false, true], quarterly: [false, false, false, true] },
    { name: t("features.support"), monthly: [false, false, false, true], quarterly: [false, false, false, true] },
  ];

   const activePlan = (() => {
  if (!data?.plans) return null;

  const allPlans = [
    ...(data.plans.monthly ?? []),
    ...(data.plans.quarterly ?? []),
  ];

  return allPlans.find(
    (p) => p.status === "active" || p.status === "cancel"
  );
})();



    return (
        <div className='flex flex-col gap-5'>

            {/* Active Plans */}
            <div className="flex flex-col gap-5">
                <h2 className="text-lg font-bold">{t("upgrade.activePlan")}</h2>

                {loadingPlans ? (
                    // 👻 Skeleton while loading
                    <div className="flex flex-col h-[120px] gap-3 rounded-xl animate-pulse bg-[#2c6472] p-5">
                        <div className="h-5 w-24 bg-gray-400 rounded-md"></div>
                        <div className="h-4 w-52 bg-gray-400 rounded-md"></div>
                        <div className="h-3 w-36 bg-gray-400 rounded-md"></div>
                    </div>
                ) : activePlan ? (
                    <div className="flex flex-col h-[120px] gap-1 rounded-xl bg-[#2c6472] p-5">
                        <h2 className="text-white text-lg font-semibold capitalize">
                            {activePlan.plan.charAt(0).toUpperCase() + activePlan.plan.slice(1)}
                        </h2>
                        <p className="text-white text-base">
                            {activePlan.plan === "free"
                                ? t("upgrade.enjoyFree")
                                : `Enjoy ${activePlan.plan} plan benefits`
                            }
                        </p>
                        <p className="text-gray-300 text-sm">
                            € {activePlan?.price ?? "0"} / {activePlan?.period ?? ""}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">{t("upgrade.noActivePlan")}</p>
                )}

            </div>


            {/* All Plans */}
            <div className="flex flex-col gap-5">
                <h2 className='text-lg font-bold'>{t("upgrade.allPlans")}</h2>

                <div className="flex border border-[#2F6C73] rounded-2xl w-fit overflow-hidden mx-auto mb-5">
                    <button
                        onClick={() => setSelected("monthly")}
                        className={`px-16 py-2 text-sm font-medium ${selected === "monthly"
                            ? "bg-[#2F6C73] text-white"
                            : "text-[#2F6C73] bg-white"
                            }`}
                    >
                        {t("upgrade.monthly")}
                    </button>
                    <button
                        onClick={() => setSelected("quarterly")}
                        className={`px-16 py-2 text-sm font-medium text-center ${selected === "quarterly"
                            ? "bg-[#2F6C73] text-white"
                            : "text-[#2F6C73] bg-white"
                            }`}
                    >
                        <p className="text-[10px] leading-none">{t("upgrade.save")}</p>
                        <h2 className="text-sm font-medium">{t("upgrade.quarterly")}</h2>
                    </button>
                </div>

                <div className="flex">
                    <div className="flex-1"></div>

                    {/* Conditionally show Free plan title if it's missing and Basic exists */}
                    {(() => {
                        const hasFree = data?.plans?.[selected]?.some(p => p.plan.toLowerCase() === "free");
                        const hasBasic = data?.plans?.[selected]?.some(p => p.plan.toLowerCase() === "basic");

                        if (!hasFree && hasBasic) {
                            return (
                                <div className="flex-1 flex flex-col gap-4">
                                    <h2 className="font-bold text-lg capitalize">{t("plans.free")}</h2>
                                    <p className=" text-base flex text-gray-500"><span className='text-center flex justify-center items-center -mt-5 text-3xl me-1'>.</span>{t("upgrade.expired")}</p>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    {loadingPlans ? (
                        // 👻 Skeletons for plan cards
                        <div className="flex gap-24">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="flex-1 flex flex-col gap-4 animate-pulse">
                                    <div className="h-5 w-20 bg-gray-300 rounded-md"></div>
                                    <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
                                    <div className="h-8 w-24 bg-gray-300 rounded-md"></div>
                                </div>
                            ))}
                        </div>
                    ) : (<>{data?.plans?.[selected]?.length > 0 ? (
                        data.plans[selected].map((plan, i) => {
                            const isActive = plan.status === "active";
                            const isComing = plan.status === "coming soon";
                            const isUpgrade = plan.status === "upgrade";

                            const btn = isComing
                                ? { label: t("upgrade.comingSoon"), style: "bg-transparent text-[#2c6472] border-[#00000047] cursor-not-allowed opacity-50", disabled: true }
                                : isUpgrade
                                    ? { label: t("upgrade.upgrade"), style: "text-white bg-[#2c6472] border-[#2c6472]" }
                                    : null;

                            return (
                                <div key={i} className="flex-1 flex flex-col gap-4">
                                    <h2 className="font-bold text-lg capitalize">{plan.plan}</h2>
                                    <p className="text-sm">€ {plan.price} / {plan.period}</p>

                                    {plan.status === "cancel" && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const token = sessionStorage.getItem("authToken");
                                                    if (!token) {
                                                        toast.error("Please login first.");
                                                        return;
                                                    }

                                                    const response = await fetch(`${BASE_URL}/settings/cancel/active-plan`, {
                                                        method: "GET",
                                                        headers: {
                                                            "Authorization": `Bearer ${token}`,
                                                            "Content-Type": "application/json"
                                                        }
                                                    });

                                                    const data = await response.json();

                                                    if (response.ok && data.url) {
                                                        window.open(data.url, "_blank"); // open in new tab
                                                        // OR use this to redirect in same tab:
                                                        // window.location.href = data.url;
                                                    } else {
                                                        toast.error("Failed to retrieve cancel link.");
                                                    }
                                                } catch (error) {
                                                    console.error("❌ Cancel plan error:", error);
                                                    toast.error("Something went wrong while cancelling.");
                                                }
                                            }}
                                            className="text-sm flex items-center gap-2 text-[#2c6472] px-4 py-1 w-24 justify-center rounded-xl border-2 border-[#2c6472] cursor-pointer hover:bg-[#2c6472]/5"
                                        >
                                            {t("upgrade.cancel")}
                                        </button>
                                    )}


                                    {btn && (
                                        <button
                                            onClick={() =>
                                                !btn.disabled && handlePlanSelect(`${plan.plan.toLowerCase()}_${selected}`)
                                            }
                                            disabled={btn.disabled}
                                            className={`w-32 text-sm font-medium border rounded-xl py-1.5 px-2 hover:scale-105 duration-200 ${btn.style} ${btn.disabled ? '' : 'hover:scale-105'}`}
                                        >
                                            {btn.label}
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-gray-500 text-center flex-1">No plans available.</p>
                    )}
                    </>
                    )}
                      </div>

            </div>

            {/* Highlights */}
            <div className="bg-[#2C647221] flex flex-col gap-5 mt-10 p-5">
                <h2 className='font-semibold pl-5'>{t("upgrade.highlights")}</h2>

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

                <h2 className='text-lg font-bold'>{t("upgrade.features")}</h2>

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

            {/* <div className="flex flex-col gap-5">

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

            </div> */}

        </div>
    )
}

export default ExplorePlans
