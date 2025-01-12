import React, { useState } from 'react';
import { Milestone } from 'lucide-react';

const FloatingActionButton = ({ onClick }) => {
  const [ripple, setRipple] = useState({ active: false, x: 0, y: 0 });

  const handleClick = (e) => {
    // Get click coordinates relative to button
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Trigger ripple
    setRipple({ active: true, x, y });
    
    // Reset ripple after animation
    setTimeout(() => setRipple({ active: false, x: 0, y: 0 }), 600);
    
    // Call the original onClick handler
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full shadow-lg z-50 transition-colors duration-200 flex items-center justify-center overflow-hidden"
      aria-label="View Development Path"
    >
      <Milestone className="w-6 h-6" />
      {ripple.active && (
        <span
          className="absolute animate-ripple rounded-full bg-white/30"
          style={{
            left: ripple.x - 50,  // Center the 100px wide ripple
            top: ripple.y - 50,   // Center the 100px tall ripple
            width: '100px',
            height: '100px',
          }}
        />
      )}
    </button>
  );
};

export default FloatingActionButton;