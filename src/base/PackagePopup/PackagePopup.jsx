import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const PackagePopup = ({ isOpen, onClose, infoBlock }) => {

  const navigate = useNavigate();

  const {
    subscriptionStart,
    subscriptionEnd,
    tier,
    internalApps,
    externalApps,
    proficiencyTests
  } = infoBlock || {};

  const formatDate = (dateStr) =>
    dateStr ? format(new Date(dateStr), 'dd MMM yyyy') : '--';

  const calcPercent = (used, max) =>
    Math.round((used / max) * 100);

  const progressItems = [
    {
      title: 'Internal',
      remaining: `${internalApps}/${tier === 'free' ? 5 : 150}`,
      percentage: calcPercent(internalApps, tier === 'free' ? 5 : 150),
    },
    {
      title: 'External',
      remaining: `${externalApps}/${tier === 'free' ? 2 : 20}`,
      percentage: calcPercent(externalApps, tier === 'free' ? 2 : 20),
    },
    {
      title: 'Proficiency Test',
      remaining: `${proficiencyTests}`,
      percentage: calcPercent(proficiencyTests, 5),
    }
  ];

  const handleUpgradeClick = () => {
    onClose(); // close the popup
    navigate('/user/settings', { state: { section: 'Explore Plans' } }); // ✅ navigate with state
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-10">
        <Dialog.Panel className="relative bg-white p-6 rounded-lg shadow-xl w-[550px] z-50 border border-blue-300">
          <button onClick={onClose} className="absolute top-4 right-4">
            <X className="text-gray-500 hover:text-black" />
          </button>

          <div className="text-center mb-3">
            <h2 className="text-lg font-bold">Package</h2>
            <p className="text-sm mt-1">
              {formatDate(subscriptionStart)} - {formatDate(subscriptionEnd)}
            </p>
            <p className="text-xs text-gray-500 mt-1 capitalize">Plan: {tier}</p>
          </div>

          <div className="mt-6 divide-y">
            {progressItems.map((item, idx) => (
              <div key={idx} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">Remaining: {item.remaining}</p>
                </div>

                <div className="flex items-center gap-4">
                  {/* ✅ Circle Progress Indicator */}
                  <div className="relative w-14 h-14">
                    <svg className="absolute top-0 left-0 w-full h-full">
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="#E5E7EB"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="#2c6472"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="150"
                        strokeDashoffset={150 - (150 * item.percentage) / 100}
                        strokeLinecap="round"
                        transform="rotate(-90 28 28)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                      {item.percentage}%
                    </div>
                  </div>

                  <button onClick={handleUpgradeClick} className="border border-gray-300 rounded-full px-4 py-1 text-sm hover:bg-gray-100 transition">
                    Upgrade
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-[#24525f] text-white text-sm rounded-lg flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between px-4 py-3">
            <p className="font-medium">Unlock premium benefits — upgrade to the Gold Package now.</p>
            <button onClick={handleUpgradeClick} className="bg-white text-[#24525f] rounded-full px-4 py-1 font-medium text-sm">
              Upgrade
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PackagePopup;