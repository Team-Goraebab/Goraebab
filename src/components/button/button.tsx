import React from 'react';

interface BtnProps {
  title: string;
  color?: string;
}

/**
 *
 * @param title 버튼 텍스트
 * @param color 버튼 색상
 * @returns
 */
const Button = ({ title, color }: BtnProps) => {
  return (
    <button
      className={`mt-4 p-2 w-full text-white rounded font-bold ${
        color ? `bg-${color}` : 'bg-blue_6'
      }`}
    >
      {title}
    </button>
  );
};

export default Button;
