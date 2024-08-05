import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="mb-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-base font-semibold">{progress}%</span>
      </div>
      <div className="w-full bg-grey_1 rounded-full h-3">
        <div
          className="bg-grey_6 h-3 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
