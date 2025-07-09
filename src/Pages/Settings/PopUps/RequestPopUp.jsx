import React from 'react';
import { X } from 'lucide-react';

const RequestPopUp = ({ isOpen, onClose, icon, title, message, actionText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative text-center shadow-lg">

        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black">
          <X size={20} />
        </button>

        {icon && <div className="mb-4">{icon}</div>}

        <h2 className="font-semibold mb-2">{title}</h2>
        <p className="font-semibold mb-5">{message}</p>

        <textarea className="w-full min-h-[100px] border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2c6472] mb-5"/>

        <button
          onClick={() => {
            onClose();
          }}
          className="w-full bg-[#2c6472] text-white py-2 rounded-lg hover:bg-[#24545d] transition"
        >
          {actionText}
        </button>
      </div>
    </div>
  );
};

export default RequestPopUp;