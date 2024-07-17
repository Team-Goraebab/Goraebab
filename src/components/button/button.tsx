import React from 'react';

interface BtnProps {
  title: string;
  color?: string;
}

const Button: React.FC<BtnProps> = ({ title, color }) => {
  return (
    <button
      className={`mt-4 p-2 w-full text-white rounded font-bold ${
        color ? `bg-${color}` : 'bg-blue_2'
      }`}
    >
      {title}
    </button>
  );
};

export default Button;
