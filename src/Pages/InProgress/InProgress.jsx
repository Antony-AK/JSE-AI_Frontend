import React from 'react';

const InProgress = () => {
  return (
    <div
      className="flex flex-col items-center justify-center bg-gray-50 px-4 text-center"
      style={{ height: 'calc(100vh - 64px)' }} // adjust 64px to your actual navbar height
    >
      <div
        className="text-6xl mb-4"
        style={{
          animation: 'rhythmicJump 1.5s ease-in-out infinite',
        }}
      >
        🚧
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">We're working on it</h1>
      <p className="text-gray-600 max-w-md mx-auto">
        This feature is currently under development. Please check back soon!
      </p>

      <style>{`
        @keyframes rhythmicJump {
          0% { transform: translateY(0); }
          10% { transform: translateY(-12px); }
          20% { transform: translateY(0); }
          40% { transform: translateY(-12px); }
          50% { transform: translateY(0); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default InProgress;
