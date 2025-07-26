import React from 'react'

const InternalRightDesignLoader = () => {
  return (
        <div className="flex mb-5 py-3 w-full mt-5 h-[870px] bg-white border border-gray-400/20 rounded-xl animate-pulse">
        <div className="w-full flex flex-col items-center p-6 space-y-4 overflow-y-auto scrollbar-custom rounded-xl bg-white">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-2">
              <div className="h-4 w-40 bg-gray-300 rounded"></div>
              <div className="h-5 w-64 bg-gray-300 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          </div>

          <div className="w-full space-y-4 mt-6">
            {[1, 2].map((_, i) => (
              <div key={i} className="grid grid-cols-[120px_1fr] gap-2">
                <div className="h-4 bg-gray-300 w-28 rounded"></div>
                <div className="h-4 bg-gray-200 w-full rounded"></div>
              </div>
            ))}
          </div>

          <div className="flex w-full gap-4 mt-4">
            <div className="h-[47px] w-[240px] rounded-3xl bg-gray-300"></div>
            <div className="h-[47px] w-[240px] rounded-3xl bg-gray-300"></div>
          </div>

          <div className="flex w-full gap-4 mt-3">
            <div className="h-[47px] w-full rounded-3xl bg-gray-200"></div>
          </div>

          <div className="w-full space-y-4 mt-6">
            <div className="h-5 w-32 bg-gray-300 rounded"></div>
            <div className="h-20 w-full bg-gray-200 rounded"></div>

            <div className="h-5 w-32 bg-gray-300 rounded"></div>
            <div className="h-24 w-full bg-gray-200 rounded"></div>

            <div className="h-5 w-32 bg-gray-300 rounded"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 w-2/3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default InternalRightDesignLoader
