import React, { useState } from 'react'

const Feedback = () => {

    const [selected, setSelected] = useState('Bug');

  return (
    <div className='w-full h-full flex flex-col justify-center items-center gap-10'>
        <div className="flex justify-center items-center gap-10">
            <button
             onClick={() => setSelected('Bug')}
             className={`w-32 text-sm font-medium border border-[#2c6472] rounded-lg py-1.5 px-2 transition-all 
                 ${selected === 'Bug' ? 'bg-[#2c6472] text-white hover:scale-105 duration-200' : 'bg-transparent text-[#2c6472] hover:scale-105 duration-200'}`}
            >
                Bug
            </button>  

            <button
             onClick={() => setSelected('Request')}
             className={`w-32 text-sm font-medium border border-[#2c6472] rounded-lg py-1.5 px-2 transition-all
                 ${selected === 'Request' ? 'bg-[#2c6472] text-white hover:scale-105 duration-200' : 'bg-transparent text-[#2c6472] hover:scale-105 duration-200'}`}
            >
                Request
            </button>

            <button
             onClick={() => setSelected('Feedback')}
             className={`w-32 text-sm font-medium border border-[#2c6472] rounded-lg py-1.5 px-2 transition-all
                ${selected === 'Feedback' ? 'bg-[#2c6472] text-white hover:scale-105 duration-200' : 'bg-transparent text-[#2c6472] hover:scale-105 duration-200'}`}
            >
                Feedback
            </button>
        </div>


        <textarea
            className="border border-gray-300 rounded-md w-1/2 h-1/2 p-3 placeholder-gray-400 focus:outline-none resize-none"
            placeholder="Describe the issue that you encountered..."
        />

        <button className='w-32 text-white bg-[#2c6472] text-sm font-medium border border-[#2c6472] rounded-lg py-1.5 px-2 transition-all hover:scale-105 duration-200'>Submit</button>
    </div>
  )
}

export default Feedback