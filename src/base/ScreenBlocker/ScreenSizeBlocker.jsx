// src/components/ScreenSizeBlocker.jsx
import React, { useEffect, useState } from 'react';

const ScreenSizeBlocker = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      // 👇 You can tweak this breakpoint as needed
      setIsMobile(width < 1024); // Treat <1024px as mobile/tablet
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);

    return () => {
      window.removeEventListener('resize', checkScreen);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100 px-6 text-center">
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            🚫 Not Supported on Mobile
          </h2>
          <p className="text-gray-700 text-lg">
            This app is only available on <span className="font-semibold">Laptop/Desktop</span>.
            <br />
            Please switch to a larger screen.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ScreenSizeBlocker;
