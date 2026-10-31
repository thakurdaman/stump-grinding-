import React from 'react';

interface TreeRingProps {
  className?: string;
  size?: number;
  strokeColor?: string;
  opacity?: number;
}

export const TreeRing: React.FC<TreeRingProps> = ({
  className = '',
  size = 64,
  strokeColor = 'currentColor',
  opacity = 0.85,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Outer bark boundary */}
      <path
        d="M50 5 C75 4, 94 22, 95 48 C96 74, 78 95, 52 95 C24 95, 5 76, 5 50 C5 24, 25 6, 50 5 Z"
        stroke={strokeColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ring 1 */}
      <path
        d="M50 14 C70 13, 85 28, 86 49 C87 70, 72 86, 51 86 C29 86, 14 71, 14 50 C14 29, 30 15, 50 14 Z"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Ring 2 */}
      <path
        d="M49 24 C64 23, 76 34, 77 49 C78 64, 66 76, 50 76 C34 76, 23 64, 23 49 C23 34, 34 25, 49 24 Z"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Ring 3 */}
      <path
        d="M49 33 C60 32, 68 41, 69 50 C70 59, 61 68, 50 68 C38 68, 31 59, 31 50 C31 41, 38 34, 49 33 Z"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Core pith & heartwood crack */}
      <circle cx="50" cy="50" r="7" stroke={strokeColor} strokeWidth="1.8" />
      <path
        d="M50 50 L58 35 M50 50 L42 63"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
