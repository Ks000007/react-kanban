import React from 'react';

export const CircularProgressMeter = ({ progress }) => {
  const normalizedProgress = progress || 0;
  const strokeDashoffset = 251 - (251 * normalizedProgress) / 100; // 251 is circumference for r=40

  return (
    <div className="relative w-32 h-32 mx-auto mb-4">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-neutral-600 stroke-current"
          strokeWidth="10"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
        ></circle>
        {/* Progress circle */}
        <circle
          className="text-yellow-500 stroke-current transition-all duration-500 ease-in-out"
          strokeWidth="10"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          strokeDasharray="251"
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        ></circle>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-neutral-100">{normalizedProgress}%</span>
      </div>
    </div>
  );
};