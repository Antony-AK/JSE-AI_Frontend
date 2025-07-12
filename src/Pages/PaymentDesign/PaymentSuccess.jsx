import React, { useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { useNavigate } from 'react-router-dom';
import successAnim from "../../assets/Success.json";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    // 🕒 Redirect after 5 seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate("/user/settings", {
                state: { section: "Explore Plans" } // 👈 pass desired tab
            });
        }, 3000);

        return () => clearTimeout(timeout);
    }, [navigate]);

    return (
        <div className="min-h-screen w-full bg-[#f9fdfa] flex flex-col items-center justify-center px-4 py-10">
            {/* Lottie animation */}
            <Player
                autoplay
                loop={false}
                src={successAnim}
                style={{ height: '200px', width: '200px' }}
                className="mb-4"
            />

            {/* Success Message Box */}
            <div className="  border border-gray-200 shadow-lg rounded-xl p-6 text-center">
                <h1 className="text-3xl font-semibold text-[#2c6472] mb-2">Payment Successful</h1>
                <p className="text-gray-700 text-base mb-6">
                    Thank you . Your payment has been processed successfully.
                </p>

                


            </div>
        </div>
    );
};

export default PaymentSuccess;
