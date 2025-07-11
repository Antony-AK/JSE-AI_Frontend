// src/components/PopUps/PasswordRequestPopUp.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import PasswordRequestPopUp from './PopUps/PasswordRequestPopUp.jsx';


const PasswordRequestPopUp = ({ isOpen, onClose, onRequestReset }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) return;
    onRequestReset(email);
    setEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative text-center shadow-lg">

        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black">
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-2">Reset Your Password</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter your registered email to receive a password reset link.
        </p>

        <input
          type="email"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c6472] mb-5"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-[#2c6472] text-white py-2 rounded-lg hover:bg-[#24545d] transition"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
};

export default PasswordRequestPopUp;
