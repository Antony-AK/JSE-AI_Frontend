import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PasswordPopUp = ({ isOpen, onClose, title, message, onSubmit, icon }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setConfirm('');
    }
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

        {/* Inputs */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start gap-3 w-full">
            <label className="text-sm font-medium text-gray-700">Enter a new password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg outline-none text-sm bg-gray-100"
            />
          </div>

          <div className="flex flex-col items-start gap-1 w-full">
            <label className="text-sm font-medium text-gray-700">Confirm your new password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg outline-none text-sm bg-gray-100"
            />
          </div>

          <button
            className="w-full bg-[#2c6472] text-white py-2 rounded-lg hover:bg-[#24545d] transition text-sm font-semibold mt-2"
          >
            Set a password
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordPopUp;