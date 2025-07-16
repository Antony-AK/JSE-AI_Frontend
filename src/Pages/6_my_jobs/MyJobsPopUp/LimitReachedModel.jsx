import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

const LimitReachedModal = ({ isOpen, onClose, type }) => {

  const navigate = useNavigate();

  const goToExplorePlans = () => {
    navigate("/user/settings", { state: { section: "Explore Plans" } });
  };

  const messageMap = {
    internal: "internal applications",
    external: "external applications",
    proficiency: "proficiency tests"
  };

  const typeText = messageMap[type] || "usage";

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative flex flex-col gap-3 w-full max-w-md bg-white rounded-lg shadow-xl p-6 border border-blue-300 z-50">
          {/* Close button */}
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
            <X />
          </button>

          {/* Title & Message */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#24525f] mb-5">Upgrade Plan</h3>
            <p className="mt-2 text-gray-700">
              You’ve reached your limit for <strong>{typeText}</strong> on the current plan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-[#2c6472] text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition w-40"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                navigate("/user/settings", { state: { section: "Explore Plans" } });
              }}
              className="px-4 py-2 text-sm text-white bg-[#24525f] rounded hover:bg-[#1d424c] transition w-40"
            >
              Upgrade Now
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default LimitReachedModal;
