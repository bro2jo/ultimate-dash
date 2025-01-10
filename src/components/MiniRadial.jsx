// src/components/MiniRadial.jsx

import React from 'react';

// The ring color can be a gradient or solid color for the "filled" portion
// We'll do a conic gradient from 0 to (score/10)*360 degrees.

function MiniRadial({ score, icon, isActive }) {
  // Score out of 10. If your scale is different, adjust accordingly.
  const percentage = (score / 10) * 100; // 0 to 100
  const deg = (360 * percentage) / 100;  // 0 to 360

  // Active ring color vs. inactive ring color
  const ringColorActive = "rgba(16,185,129,1)";  // emerald-500
  const ringColorInactive = "rgba(107,114,128,1)"; // gray-500

  // Decide color: if isActive is true, use emerald-500, else maybe a duller color
  const ringColor = isActive ? ringColorActive : ringColorInactive;

  // Construct the conic gradient
  const ringStyle = {
    background: `
      conic-gradient(
        ${ringColor} 0deg,
        ${ringColor} ${deg}deg,
        rgba(75,85,99,0.2) ${deg}deg,
        rgba(75,85,99,0.2) 360deg
      )
    `,
  };

  return (
    <div className="relative w-12 h-12">
      {/* Outer ring */}
      <div
        className="w-12 h-12 rounded-full"
        style={ringStyle}
      ></div>

      {/* Inner circle (white or gray background) */}
      <div className="absolute top-[4px] left-[4px] w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}

export default MiniRadial;
