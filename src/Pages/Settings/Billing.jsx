import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../utils/api';

const Billing = () => {
    const [billingData, setBillingData] = useState(null);

    useEffect(() => {
        const fetchBilling = async () => {
            const token = sessionStorage.getItem('authToken');

            try {
                const res = await fetch(`${BASE_URL}/settings/view/billing`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch billing data');

                const data = await res.json();
                setBillingData(data);
            } catch (err) {
                console.error('❌ Billing Fetch Error:', err.message);
            }
        };

        fetchBilling();
    }, []);

    return (
        <div className="flex flex-col gap-5 py-3">
            {/* Plan */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold">Plan</h2>
                    <p className="text-[#000000b0] text-sm">{billingData?.subscription_tier || '-'}</p>
                </div>
                <button className="text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2">
                    Change Plan
                </button>
            </div>

            {/* Billing Period */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold">Billing Period</h2>
                    <p className="text-[#000000b0] text-sm">{billingData?.subscription_period || '-'}</p>
                </div>
                <button className="text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2">
                    Edit Period
                </button>
            </div>

            {/* Subscription Dates */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold">Subscription Period</h2>
                    <p className="text-[#000000b0] text-sm">
                        {billingData?.subscription_interval_start
                            ? `${new Date(billingData.subscription_interval_start).toLocaleDateString()} → ${new Date(
                                billingData.subscription_interval_end
                            ).toLocaleDateString()}`
                            : '-'}
                    </p>
                </div>
            </div>

            {/* Payment Details */}
            <div>
                <h2 className="text-lg font-bold">Payment Details</h2>
                <div className="border border-b-gray-200 h-px my-3"></div>

                <div className="flex flex-col gap-5 py-3">
                    {/* Payment Method */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-semibold">Payment Method</h2>
                            <p className="text-[#000000b0] text-sm">{billingData?.payment_method || '-'}</p>
                        </div>
                        <button className="text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2">
                            Edit Method
                        </button>
                    </div>

                    {/* Billed To */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-semibold">Billed To</h2>
                            <p className="text-[#000000b0] text-sm">{billingData?.billed_to || '-'}</p>
                        </div>
                        <button className="text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2">
                            Edit Information
                        </button>
                    </div>

                    {/* Billing Email */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-semibold">Billing Email</h2>
                            <p className="text-[#000000b0] text-sm">{billingData?.billing_email || '-'}</p>
                        </div>
                        <button className="text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2">
                            Edit Email
                        </button>
                    </div>
                </div>
            </div>

            {/* Invoices */}
            <div>
                <h2 className="text-lg font-bold">Invoices</h2>
                <div className="border border-b-gray-200 h-px my-3"></div>

                <div className="flex flex-col gap-5 py-3">
                    {billingData?.invoices && billingData.invoices.length > 0 ? (
                        billingData.invoices.map((invoice, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div className="flex flex-col gap-1">
                                    <h2 className="font-semibold">
                                        {invoice.date_paid
                                            ? new Date(invoice.date_paid).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })
                                            : `Invoice #${index + 1}`}
                                    </h2>
                                    <p className="text-[#000000b0] text-sm">
                                        Paid • € {invoice.amount_paid || '€-'}
                                    </p>
                                </div>
                                <a
                                    href={invoice.link_invoice}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2"
                                >
                                    View Invoice
                                </a>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No invoices available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Billing;
