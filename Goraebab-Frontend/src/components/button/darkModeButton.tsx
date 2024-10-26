'use client';

import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const DarkModeButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="p-3 bg-navy_0 rounded-full shadow-lg transition-colors dark:bg-yellow_0"
      >
        {isDarkMode ? (
          <FiSun className="text-yellow_5 text-xl" />
        ) : (
          <FiMoon className="text-blue_4 text-xl" />
        )}
      </button>
    </div>
  );
};

export default DarkModeButton;
