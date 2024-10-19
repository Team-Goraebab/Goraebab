import React from 'react';

interface ContainerBarProps {
  rotate?: number | 0;
  length?: string;
  themeColor: {
    label: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  };
}

const ConnectBar = ({ rotate, length, themeColor }: ContainerBarProps) => {
  const rotationStyle = {
    transform: `rotate(${rotate}deg)`,
  };

  return (
    <div className={`flex items-start mt-0.5`} style={rotationStyle}>
      <div
        className="h-6 rounded-br rounded-tr w-1"
        style={{ backgroundColor: `${themeColor.borderColor}` }}
      />
      <div
        className="h-[1px] mt-3"
        style={{
          backgroundColor: `${themeColor.borderColor}`,
          width: `${length}` === 'long' ? '72px' : '24px',
          marginRight: `${length}` === 'long' ? '55px' : '0px',
        }}
      />
    </div>
  );
};

export default ConnectBar;
