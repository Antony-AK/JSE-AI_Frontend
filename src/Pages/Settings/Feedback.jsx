import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Feedback = () => {
  const [selected, setSelected] = useState('Bug');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.warn("Please enter your message ✍️");
      return;
    }

    const token = sessionStorage.getItem("authToken"); // if your API needs it

    const payload = {
      subject: selected.toLowerCase(), // "bug", "request", "feedback"
      body: message.trim(),
    };

    try {
      setLoading(true);

      const response = await fetch("https://dev.arshan.digital/b1/settings/givefeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Remove this if token isn't needed
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Something went wrong 😓");
      }

      toast.success(result?.issue || "Feedback received, thank you! 🙌");
      setMessage("");
    } catch (err) {
      toast.error(err.message || "Something went wrong 💀");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-full flex flex-col justify-center items-center gap-10'>
      <div className="flex justify-center items-center gap-10">
        {["Bug", "Request", "Feedback"].map((type) => (
          <button
            key={type}
            onClick={() => setSelected(type)}
            className={`w-32 text-sm font-medium border border-[#2c6472] rounded-lg py-1.5 px-2 transition-all
              ${selected === type
                ? 'bg-[#2c6472] text-white hover:scale-105 duration-200'
                : 'bg-transparent text-[#2c6472] hover:scale-105 duration-200'}`}
          >
            {type}
          </button>
        ))}
      </div>

      <textarea
        className="border border-gray-300 rounded-md w-1/2 h-56 p-3 placeholder-gray-400 focus:outline-none resize-none"
        placeholder={`Describe your ${selected.toLowerCase()}...`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-32 text-white text-sm font-medium border border-[#2c6472] rounded-lg py-1.5 px-2 transition-all duration-200
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2c6472] hover:scale-105'}`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default Feedback;
