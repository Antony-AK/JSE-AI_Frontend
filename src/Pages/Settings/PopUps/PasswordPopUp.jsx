import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const PasswordPopUp = ({ isOpen, onClose, title, message, onSubmit, icon }) => {
  useEffect(() => {
    
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        {icon && (
          <div className="mb-4 text-center">
            <img width="35px" src={icon} alt="icon" className="mx-auto" />
          </div>
        )}

        {/* Title & Message */}
        <h2 className="font-bold mb-3 text-center">{title}</h2>
        <p className="font-semibold mb-5 text-center">{message}</p>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          className="w-full bg-[#2c6472] text-white py-2 rounded-lg hover:bg-[#24545d] transition text-sm font-semibold"
        >
          Send Password Reset Link
        </button>
      </div>
    </div>
  );
};

export default PasswordPopUp;