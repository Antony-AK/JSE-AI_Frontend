import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from "react-toastify";
import RequestPopUp from './PopUps/RequestPopUp.jsx'
import DeletePopUp from './PopUps/DeletePopUp.jsx'
import PasswordPopUp from './PopUps/PasswordPopUp.jsx'
import mail_icon from '../../assets/mail-icon.svg';
import job_icon from '../../assets/job-listing-active-icon.svg';
import password_icon from '../../assets/password-icon.svg';
import { BASE_URL } from '../../utils/api.js'

const AccountSecurity = () => {

    const [popupType, setPopupType] = useState(null);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const token = sessionStorage.getItem('authToken');

                if (!token) {
                    console.warn("No auth token found.");
                    return;
                }

                const response = await fetch(`${BASE_URL}/settings/general`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch email');
                }

                const data = await response.json();
                setEmail(data.email);
            } catch (err) {
                console.error('Error fetching email:', err.message);
            }
        };

        fetchEmail();
    }, []);

    const handleDeleteAccount = async (password) => {
        try {
            const token = sessionStorage.getItem('authToken');

            await axios.delete(`${BASE_URL}/user/account`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: { password },
            });

            toast.success('Account deleted successfully!');
            sessionStorage.clear();
            window.location.href = '/';
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to delete account.');
        }
    };

    const handleChangeEmailRequest = async () => {
        try {
            const token = sessionStorage.getItem('authToken');

            const response = await axios.post(
                `${BASE_URL}/settings/change-email-request`,
                { body: "I'd like to change my email." },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            toast.success(response.data?.issue || "Email change request sent!");
            setPopupType(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to send email change request.");
        }
    };

    const handleChangeJobTitleRequest = async () => {
        try {
            const token = sessionStorage.getItem('authToken');

            const response = await axios.post(
                `${BASE_URL}/settings/change-job-title-request`,
                { body: "I'd like to change my job title." },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            toast.success(response.data?.issue || "Job title change request sent!");
            setPopupType(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to send job title change request.");
        }
    };



    return (
        <div className='flex flex-col gap-5 py-3'>
            {/* Email */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className='font-semibold'>Email</h2>
                    <p className='text-[#000000b0] text-sm'>{email || ''}</p>
                </div>
                <button onClick={() => setPopupType('email')} className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2 hover:scale-105 hover:text-white hover:bg-[#2c6472]  transition-all duration-200'>
                    Sent Request
                </button>
            </div>

            {/* Password */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className='font-semibold'>Password</h2>
                    <p className='text-[#000000b0] text-sm'>Set a permanent password to login to your account.</p>
                </div>
                <button onClick={() => setPopupType('password')} className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2 hover:scale-105 hover:text-white hover:bg-[#2c6472]  transition-all duration-200'>
                    Add Password
                </button>
            </div>

            {/* Verification */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className='font-semibold'>2-step Verification</h2>
                    <p className='text-[#000000b0] text-sm'>Add an additional layer of security to your account during login.</p>
                </div>
                <button className='text-[#00000047] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2'>
                    Add Verification Method
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
                        <button onClick={() => setPopupType('job')} className='text-[#2c6472] text-sm font-semibold border border-[#00000047] rounded-lg py-1 px-2 hover:scale-105 hover:text-white hover:bg-[#2c6472]  transition-all duration-200'>
                            Sent Request
                        </button>
                    </div>

                    {/* Delete Account */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 onClick={() => setPopupType('delete')} className='font-semibold text-red-500 cursor-pointer'>Delete my Account</h2>
                            <p className='text-[#000000b0] text-sm'>After deleting your account, the same email cannot be used to log in or register again for the next 5 months.</p>
                        </div>
                    </div>

                </div>

            </div>

            <RequestPopUp
                isOpen={popupType === 'email'}
                onClose={() => setPopupType(null)}
                icon={<img width="35px" src={mail_icon} alt="email" className="mx-auto" />}
                title="Sent request to change email"
                message="Our team will review and update it soon."
                actionText="Send Request"
                onAction={handleChangeEmailRequest}
            />

            <RequestPopUp
                isOpen={popupType === 'job'}
                onClose={() => setPopupType(null)}
                icon={<img src={job_icon} alt="job" className="w-6 h-6 mx-auto" />}
                title="Sent request to change job title"
                message="Our team will review and update it soon."
                actionText="Send Request"
                onAction={handleChangeJobTitleRequest}
            />

            <PasswordPopUp
                isOpen={popupType === 'password'}
                onClose={() => setPopupType(null)}
                icon={password_icon}
                title="Set a Password"
                message="Password must be at least 8 characters long and include at least one number and one special character."
            />

            <DeletePopUp
                isOpen={popupType === 'delete'}
                onClose={() => setPopupType(null)}
                onDelete={handleDeleteAccount}
            />

        </div>
    )
}

export default AccountSecurity