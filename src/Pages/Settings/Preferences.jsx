import React from 'react'
import right_arrow from "../../assets/arrow-right.svg"

const Preferences = () => {
    return (
        <div className='flex flex-col gap-5 py-3'>
            {/* Language */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className='font-semibold'>Language</h2>
                    <p className='text-[#000000b0] text-sm'>Change the language used in the user interface.</p>
                </div>
                <p className='text-[#00000047] text-sm font-semibold py-1 px-2'>
                    English
                </p>
            </div>

            {/* Timezone */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className='font-semibold'>Timezone</h2>
                    <p className='text-[#000000b0] text-sm'>Custom timezone setting.</p>
                </div>
                <p className='text-[#00000047] text-sm font-semibold py-1 px-2'>
                    (GMT+2:00) Berlin
                </p>
            </div>

            {/* Privacy */}
            <div className="">
                <h2 className='text-lg font-bold'>Privacy</h2>

                <div className="border border-b-gray-200 h-px my-3"></div>

                <div className="flex flex-col gap-5 py-3">

                    {/* Cookie Policy */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className='font-semibold'>Cookie Policy</h2>
                            <p className='text-[#000000b0] text-sm'>We use cookies to improve your experience. By continuing, you agree to our Cookie Policy.</p>
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

                    {/* Terms & Conditions */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className='font-semibold'>Terms & Conditions</h2>
                            <p className='text-[#000000b0] text-sm'>By using this platform, you agree to abide by our Terms & Conditions.</p>
                        </div>
                        <img width="8px" src={right_arrow} className='mr-5' alt="" />
                    </div>

                    {/* Privacy Policy */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className='font-semibold'>Privacy Policy</h2>
                            <p className='text-[#000000b0] text-sm'>Your data is safe with us. Learn more in our Privacy Policy.</p>
                        </div>
                        <img width="8px" src={right_arrow} className='mr-5' alt="" />
                    </div>

                    {/* Data Policy */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className='font-semibold'>Data Policy</h2>
                            <p className='text-[#000000b0] text-sm'>We handle your personal information in accordance with our Data Policy.</p>
                        </div>
                        <img width="8px" src={right_arrow} className='mr-5' alt="" />
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Preferences