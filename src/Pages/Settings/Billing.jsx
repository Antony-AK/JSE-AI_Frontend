import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../utils/api';
import { t } from '../../utils/i18n'; // Make sure this points to your t() utility


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
                    <h2 className="font-semibold">{t("billing.plan")}</h2>
                    <p className="text-[#000000b0] text-sm">{billingData?.subscription_tier || '-'}</p>
                </div>
                <button className="text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2">
                    {t("billing.changePlan")}
                </button>
            </div>

            {/* Billing Period */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold">{t("billing.billingPeriod")}</h2>
                    <p className="text-[#000000b0] text-sm">{billingData?.subscription_period || '-'}</p>
                </div>
                <button className="text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2">
                    {t("billing.editPeriod")}
                </button>
            </div>

            {/* Subscription Dates */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold">{t("billing.subscriptionDates")}</h2>
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
                <h2 className="text-lg font-bold">{t("billing.paymentDetails")}</h2>
                <div className="border border-b-gray-200 h-px my-3"></div>

                <div className="flex flex-col gap-5 py-3">
                    {/* Payment Method */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-semibold">{t("billing.paymentMethod")}</h2>
                            <p className="text-[#000000b0] text-sm">{billingData?.payment_method || '-'}</p>
                        </div>
                        <button className="text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2">
                             {t("billing.editMethod")}
                        </button>
                    </div>

                    {/* Billed To */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-semibold">{t("billing.billedTo")}</h2>
                            <p className="text-[#000000b0] text-sm">{billingData?.billed_to || '-'}</p>
                        </div>
                        <button className="text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2">
                            {t("billing.editInfo")}
                        </button>
                    </div>

                    {/* Billing Email */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-semibold">{t("billing.billingEmail")}</h2>
                            <p className="text-[#000000b0] text-sm">{billingData?.billing_email || '-'}</p>
                        </div>
                        <button className="text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2">
                            {t("billing.editEmail")}
                        </button>
                    </div>
                </div>
            </div>

            {/* Invoices */}
            <div>
                <h2 className="text-lg font-bold">{t("billing.invoices")}</h2>
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
                                            : `${t("billing.invoice")} #${index + 1}`}
                                    </h2>
                                    <p className="text-[#000000b0] text-sm">
                                        {t("billing.paid")} • € {invoice.amount_paid || '€-'}
                                    </p>
                                </div>
                                <a
                                    href={invoice.link_invoice}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2"
                                >
                                    {t("billing.viewInvoice")}
                                </a>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">{t("billing.noInvoices")}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Billing;
