// PackagePopup.jsx
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

const progressItems = [
  {
    title: 'Internal',
    remaining: '15/20',
    percentage: 85,
  },
  {
    title: 'External',
    remaining: '15/20',
    percentage: 85,
  },
  {
    title: 'Proficiency Test',
    remaining: '15/20',
    percentage: 85,
  },
];

const PackagePopup = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />

        <div className="relative bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md z-50 border border-blue-400">
          <button onClick={onClose} className="absolute top-4 right-4">
            <X className="text-gray-500 hover:text-black" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold">Package</h2>
            <p className="text-sm mt-1">19 Jun 2025 - 19 Jul 2025</p>
          </div>

          <div className="mt-6 divide-y">
            {progressItems.map((item, idx) => (
              <div key={idx} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">Remaining : {item.remaining}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10">
                    <svg className="absolute top-0 left-0 w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="text-teal-600"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        strokeDasharray={`${item.percentage}, 100`}
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                      {item.percentage}%
                    </div>
                  </div>
                  <button className="border border-gray-300 rounded-full px-4 py-1 text-sm hover:bg-gray-100 transition">
                    Upgrade
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-[#24525f] text-white text-sm rounded-lg flex items-center justify-between px-4 py-3">
            <p className="font-medium">Unlock premium benefits — upgrade to the Gold Package now.</p>
            <button className="bg-white text-[#24525f] rounded-full px-4 py-1 font-medium text-sm">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PackagePopup;
