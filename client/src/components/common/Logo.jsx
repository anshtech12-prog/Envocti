import React from 'react';

export default function Logo({ className = "h-6 w-6" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      {/* Outer Leaf shape with gradient */}
      <path 
        d="M12 2C6.5 7.5 7.5 15 12 22C16.5 15 17.5 7.5 12 2Z" 
        fill="url(#logoGrad)" 
        stroke="url(#logoStrokeGrad)" 
        strokeWidth="1.5" 
      />
      {/* Center Circuit stem */}
      <path 
        d="M12 7V17" 
        stroke="#ffffff" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        opacity="0.95" 
      />
      {/* Circuit Nodes */}
      <circle cx="12" cy="11" r="2" fill="#a7f3d0" stroke="#047857" strokeWidth="1" />
      
      <path 
        d="M12 11L16 8" 
        stroke="#ffffff" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        opacity="0.95" 
      />
      <circle cx="16" cy="8" r="1.5" fill="#34d399" />
      
      <path 
        d="M12 14L8 17" 
        stroke="#ffffff" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        opacity="0.95" 
      />
      <circle cx="8" cy="17" r="1.5" fill="#34d399" />
      
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="logoStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}
