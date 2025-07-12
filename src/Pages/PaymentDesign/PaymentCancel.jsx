import React, { useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { useNavigate } from 'react-router-dom';
import cancel from "../../assets/Cancel.json";

const PaymentCancel = () => {
  const navigate = useNavigate();

  // ⏱ Auto-redirect after 5 seconds to /user/settings with "Explore Plans" active
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/user/settings', {
        state: { section: 'Explore Plans' }, // 👈 tell settings to open this section
      });
    }, 3000);

    return () => clearTimeout(timeout); // cleanup on unmount
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-[#fef2f2] flex flex-col items-center justify-center px-4 ">
      {/* Lottie Animation */}
      <Player
        autoplay
        loop={false}
        src={cancel}
        style={{ height: '400px', width: '400px' }}
        className=""
      />

      {/* Message Box */}
      <div className=" bg-white border border-gray-200 -mt-20 shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-3xl font-semibold text-red-600 mb-2">Payment Cancelled</h1>
        <p className="text-gray-700 text-base mb-6">
          Your payment wasn’t completed.
        </p>


      </div>
    </div>
  );
};

export default PaymentCancel;
