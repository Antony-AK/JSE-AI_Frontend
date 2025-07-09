import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DeletePopUp = ({ isOpen, onClose, onDelete }) => {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) setPassword('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative">

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black">
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-center mb-2 text-red-600">Delete Account</h2>
        <p className="text-sm text-center mb-6 text-gray-600">
          Enter your password to confirm. This action is <span className="font-semibold text-black">permanent</span>.
        </p>

        <div className="flex flex-col items-start gap-3 w-full">
          <label className='text-sm font-medium text-gray-700' htmlFor="">Enter your password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none mb-5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onDelete(password)}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopUp;