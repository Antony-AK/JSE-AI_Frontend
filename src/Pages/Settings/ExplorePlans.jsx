import React from 'react'
import tick from '../../assets/tick.svg'

const ExplorePlans = () => {

    const plan = ['Free', 'Basic', 'Advanced', 'Premium'];

    const plans = [
    {
        name: 'Free',
        price: '€ 0 Per Month',
        monthly: null,
        quarterly: null,
        isActive: true,
        button: null
    },
    {
        name: 'Basic',
        price: null,
        monthly: '€ 20 monthly Billed',
        quarterly: '€ 55 Quarterly Billed',
        isActive: false,
        button: {
        label: 'Upgrade',
        style: 'text-white bg-[#2c6472] border-[#2c6472]'
        }
    },
    {
        name: 'Advanced',
        price: null,
        monthly: '€ 35 monthly Billed',
        quarterly: '€ 94.50 Quarterly Billed',
        isActive: false,
        button: {
        label: 'Coming Soon',
        style: 'bg-transparent text-[#2c6472] border-[#00000047]'
        }
    },
    {
        name: 'Premium',
        price: null,
        monthly: '€ 55 monthly Billed',
        quarterly: '€ 148.50 Quarterly Billed',
        isActive: false,
        button: {
        label: 'Coming Soon',
        style: 'bg-transparent text-[#2c6472] border-[#00000047]'
        }
    }
    ];  
    
    const highlightsData = [
    {
        plan: 'Free',
        items: [
        'Targeted Job',
        'CV Automation',
        'CL Automation',
        'External CV/CL',
        'Job Suitability',
        ],
    },
    {
        plan: 'Basic',
        items: [
        'CV & CL Automation: 150 Docs Included',
        'External CV/CL Automation: 20 Docs',
        'Language Test MCQ',
        'Language Filter',
        ],
    },
    {
        plan: 'Advanced',
        items: [
        'CV & CL Automation: 240 Docs Included',
        'External CV/CL Automation: 35 Docs',
        'Language Filter',
        'Recommended Jobs',
        'Job Research',
        ],
    },
    {
        plan: 'Premium',
        items: [
        'CV & CL Automation: 360 Docs Included',
        'External CV/CL Automation: 75 Docs',
        'Job Search : 5',
        'Learning Roadmap & Skills',
        'Autofill Tools for External Jobforms',
        'Early Access to new features',
        ],
    },
    ];    

    const features = [
        { name: 'Targeted Job', values: [true, true, true, true] },
        { name: 'CV Automation', values: [5, 150, 240, 360] },
        { name: 'CL Automation', values: [5, 150, 240, 360] },
        { name: 'External CV/CL', values: [2, 20, 35, 75] },
        { name: 'Application Tracker', values: [true, true, true, true] },
        { name: 'Job Suitability', values: [true, true, true, true] },
        { name: 'Language Test MCQ', values: [false, true, true, true] },
        { name: 'Spoken Test', values: [false, false, true, true] },
        { name: 'Language Filter', values: [false, true, true, true] },
        { name: 'Recommended Jobs', values: [false, true, true, true] },
        { name: 'Job Research', values: [false, false, 3, 5] },
        { name: 'Learning Roadmap & Skills', values: [false, false, false, true] },
        { name: 'Autofill tools for external job forms', values: [false, false, false, true] },
        { name: 'Early access to new features', values: [false, false, false, true] },
    ];    

  return (
    <div className='flex flex-col gap-5'>

        {/* Active Plans */}
        <div className="flex flex-col gap-5">
            <h2 className='text-lg font-bold'>Active Plan</h2>
            <div className="flex flex-col gap-1.5 rounded-xl bg-[#2c6472] p-5">
                <h2 className='text-white text-xl font-bold'>Free</h2>
                <p className='text-white text-lg'>Enjoy free features at no cost</p>
                <p className='text-gray-400 text-sm'>€ 0 Per Month</p>
            </div>
        </div>

        {/* All Plans */}
        <div className="flex flex-col gap-5">
            <h2 className='text-lg font-bold'>All Plans</h2>

            <div className="flex">
                <div className="flex-1"></div>

                {plans.map((plan, index) => (
                <div key={index} className="flex-1 flex flex-col gap-4">
                    <h2 className='font-bold text-lg'>{plan.name}</h2>

                    {plan.price && <p className='text-sm'>{plan.price}</p>}

                    {plan.monthly && (
                    <div className="">
                        <p className='text-sm'>{plan.monthly}</p>
                        <p className='text-sm'>{plan.quarterly}</p>
                    </div>
                    )}

                    {plan.isActive && (
                    <p className='text-sm flex items-center gap-2 text-[#2c6472]'>
                        <span className="w-2 h-2 bg-[#2c6472] rounded-full inline-block" />
                        Active
                    </p>
                    )}

                    {plan.button && (
                    <button
                        className={`w-32 text-sm font-medium border rounded-xl py-1.5 px-2 hover:scale-105 duration-200 ${plan.button.style}`}
                    >
                        {plan.button.label}
                    </button>
                    )}
                </div>
                ))}
            </div>

        </div>

        {/* Highlights */}
        <div className="bg-[#2C647221] flex flex-col gap-5 p-5">
            <h2 className='font-semibold pl-5'>Highlights</h2>

            <div className="flex">
                <div className="flex-1"></div>
                {highlightsData.map((plan, index) => (
                    <div key={index} className="flex flex-col gap-3 flex-1 text-sm font-medium p-1.5">
                        {plan.items.map((item, idx) => (
                        <div key={idx} className="flex gap-1.5">
                            <img src={tick} width="15px" alt="✔" />
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
                {feature.values.map((value, j) => (
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

    </div>
  )
}

export default ExplorePlans