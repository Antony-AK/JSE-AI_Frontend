import React from 'react'

const ProfileDesign = () => {
  return (
     <div className='flex flex-col w-[calc(99vw-264px)] gap-3 bg-gray-100 px-6 py-4 animate-pulse'>

      {/* 💠 Dashboard Summary Section */}
      <div className="bg-[#215D69] rounded-md text-white p-7 mb-2 flex flex-col gap-5">
        <div className="flex gap-2">
          <div className="h-4 w-20 bg-white/40 rounded"></div>
        </div>

        <div className='flex w-full h-[150px] rounded-md p-4 justify-between items-center'>

          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 w-96">
              <div className="h-4 w-32 bg-white/50 rounded"></div>
              <div className="h-4 w-16 bg-white/30 rounded"></div>
              <div className="w-20 h-20 rounded-full border-4 border-white/40"></div>
              {/* <div className="h-4 w-12 bg-white/40 rounded"></div> */}
            </div>
          ))}

        </div>
      </div>

      {/* 🔲 Note */}
      <div className='w-full h-14 bg-white rounded-md flex justify-center items-center'>
        <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
      </div>

      {/* 🧍 Profile Header */}
      <div className="flex justify-between py-3 px-5  w-full bg-white rounded-md">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full" />

          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
            <div className="h-3 w-28 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-gray-200" />
          <div className="h-3 w-20 mt-2 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* 🔄 Repeatable Sections (Personal Info, Education, etc.) */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center py-5 px-6 w-full bg-white rounded-md"
        >
          <div className='flex flex-col gap-2 w-full'>
            <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
            {[...Array(2)].map((_, j) => (
              <div key={j} className="h-3 w-3/4 bg-gray-200 rounded mb-1"></div>
            ))}
          </div>
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export default ProfileDesign
