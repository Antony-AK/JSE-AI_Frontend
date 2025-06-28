import React from 'react'

const AccountSecurity = () => {
  return (
    <div className='flex flex-col gap-5 py-3'>
        {/* Email */}
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
                <h2 className='font-semibold'>Email</h2>
                <p className='text-[#000000b0] text-sm'>Steve@gmail.com</p>
            </div>
            <button className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2 hover:scale-105 hover:text-white hover:bg-[#2c6472]  transition-all duration-200'>
                Sent Request
            </button>
        </div>

        {/* Password */}
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
                <h2 className='font-semibold'>Password</h2>
                <p className='text-[#000000b0] text-sm'>Set a permanent password to login to your account.</p>
            </div>
            <button className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2 hover:scale-105 hover:text-white hover:bg-[#2c6472]  transition-all duration-200'>
                Add Password
            </button>
        </div>

        {/* Verification */}
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
                <h2 className='font-semibold'>2-step vertification</h2>
                <p className='text-[#000000b0] text-sm'>Add an additional layer of security to your account during login.</p>
            </div>
            <button className='text-[#00000047] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2'>
                Add Vertification Method
            </button>
        </div>

        <div className="">
            <h2 className='text-lg font-bold'>Support</h2>

            <div className="border border-b-gray-200 h-px my-3"></div>

            <div className="flex flex-col gap-5 py-3">

                {/* Job Title */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h2 className='font-semibold'>Change Job Title</h2>
                        <p className='text-[#000000b0] text-sm'>Your request will be sent to our support team via email.</p>
                    </div>
                    <button className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2 hover:scale-105 hover:text-white hover:bg-[#2c6472]  transition-all duration-200'>
                        Sent Request
                    </button>
                </div>

                {/* Delete Account */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h2 className='font-semibold text-red-500'>Delete my Account</h2>
                        <p className='text-[#000000b0] text-sm'>After deleting your account, the same email cannot be used to log in or register again for the next 5 months.</p>
                    </div>
                </div>

            </div>

        </div>        

    </div>
  )
}

export default AccountSecurity