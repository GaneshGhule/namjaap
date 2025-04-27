import React from 'react';
import { SvgIcon } from '@mui/material';

const Logo = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 100 100">
      {/* Base Circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3"
      />

      {/* Inner Ripples */}
      <circle 
        cx="50" 
        cy="50" 
        r="35" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        opacity="0.8"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="25" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        opacity="0.6"
      />

      {/* Lotus Petals */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <path
          key={angle}
          d={`M50 50 
             L${50 + 20 * Math.cos((angle * Math.PI) / 180)} ${50 + 20 * Math.sin((angle * Math.PI) / 180)}
             A20 20 0 0 1 ${50 + 20 * Math.cos(((angle + 60) * Math.PI) / 180)} ${50 + 20 * Math.sin(((angle + 60) * Math.PI) / 180)}
             Z`}
          fill="currentColor"
          opacity="0.2"
        />
      ))}

      {/* Center Dot */}
      <circle 
        cx="50" 
        cy="50" 
        r="5" 
        fill="currentColor"
      />

      {/* Smile Arc */}
      <path
        d="M30 40 A25 25 0 0 1 70 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
};

export default Logo;
