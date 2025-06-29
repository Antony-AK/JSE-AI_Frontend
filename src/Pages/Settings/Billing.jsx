import React from 'react'

const Billing = () => {
  return (
    <div className='flex flex-col gap-5 py-3'>

        {/* Plan */}
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
                <h2 className='font-semibold'>Plan</h2>
                <p className='text-[#000000b0] text-sm'>Basic</p>
            </div>
            <button className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2'>
                Change Plan
            </button>
        </div>

        {/* Billing Period */}
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
                <h2 className='font-semibold'>Billing Period</h2>
                <p className='text-[#000000b0] text-sm'>Monthly</p>
            </div>
            <button className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2'>
                Edit Period
            </button>
        </div>

        {/* Payment Details */}
        <div className="">
            <h2 className='text-lg font-bold'>Payment Details</h2>

            <div className="border border-b-gray-200 h-px my-3"></div>

            <div className="flex flex-col gap-5 py-3">

                {/* Payment Method */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h2 className='font-semibold'>Payment Method</h2>
                        <p className='text-[#000000b0] text-sm'>Credit Card</p>
                    </div>
                    <button className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2'>
                        Edit Method
                    </button>
                </div>

                {/* Billed to */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h2 className='font-semibold'>Billed to</h2>
                        <p className='text-[#000000b0] text-sm'>Steve,Linkstre 2,DE</p>
                    </div>
                    <button className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2'>
                        Edit Information
                    </button>
                </div>

                {/* Billing Email */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h2 className='font-semibold'>Billing Email</h2>
                        <p className='text-[#000000b0] text-sm'>Steve@gmail.com</p>
                    </div>
                    <button className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2'>
                        Edit Email
                    </button>
                </div>

            </div>

        </div> 

        {/* Invoices */}
        <div className="">
            <h2 className='text-lg font-bold'>Invoices</h2>

            <div className="border border-b-gray-200 h-px my-3"></div>

            <div className="flex flex-col gap-5 py-3">

                {/* Invoice detail */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h2 className='font-semibold'>May 22,2025</h2>
                        <p className='text-[#000000b0] text-sm'>Paid • €</p>
                    </div>
                    <button className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2'>
                        View Invoice
                    </button>
                </div>

                {/* Invoice detail */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h2 className='font-semibold'>May 22,2025</h2>
                        <p className='text-[#000000b0] text-sm'>Paid • €</p>
                    </div>
                    <button className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2'>
                        View Invoice
                    </button>
                </div>

            </div>

        </div>       

    </div>
  )
}

export default Billing