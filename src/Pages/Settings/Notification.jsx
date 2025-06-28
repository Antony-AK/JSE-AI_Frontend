import React from 'react'

const Notification = () => {
  return (
    <div className='flex flex-col gap-5 py-3'>
        {/* Subscription Notification */}
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
                <h2 className='font-semibold'>Subscription Notification</h2>
                <p className='text-[#000000b0] text-sm'>Get alerts about your plan status, renewals, and package updates.</p>
            </div>
            <label className="relative inline-block w-10 h-6">
                <input
                    type="checkbox"
                    // checked={checked}
                    // onChange={onChange}
                    className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#2c6472] transition-colors duration-300" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4 shadow" />
            </label>
        </div>

        {/* Recommended Jobs */}
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
                <h2 className='font-semibold'>Recommended Jobs</h2>
                <p className='text-[#000000b0] text-sm'>Receive job suggestions based on your profile and preferences.</p>
            </div>
            <label className="relative inline-block w-10 h-6">
                <input
                    type="checkbox"
                    // checked={checked}
                    // onChange={onChange}
                    className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#2c6472] transition-colors duration-300" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4 shadow" />
            </label>
        </div>

        {/* German Test */}
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
                <h2 className='font-semibold'>German Test</h2>
                <p className='text-[#000000b0] text-sm'>Stay updated on your German proficiency test schedules and results.</p>
            </div>
            <label className="relative inline-block w-10 h-6">
                <input
                    type="checkbox"
                    // checked={checked}
                    // onChange={onChange}
                    className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#2c6472] transition-colors duration-300" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4 shadow" />
            </label>
        </div>

        {/* Announcement */}
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
                <h2 className='font-semibold'>Timezone</h2>
                <p className='text-[#000000b0] text-sm'>Get notified about important announcements, feature updates, and policy changes.</p>
            </div>
            <label className="relative inline-block w-10 h-6">
                <input
                    type="checkbox"
                    // checked={checked}
                    // onChange={onChange}
                    className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#2c6472] transition-colors duration-300" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4 shadow" />
            </label>
        </div>
    </div>
  )
}

export default Notification