import React from 'react';

interface BtnProps {
  title: string;
  color?: string;
  onClick: () => void;
}

/**
 *
 * @param title 버튼 텍스트
 * @param color 버튼 색상
 * @param onClick 클릭 핸들러
 * @returns
 */
const Button = ({ title, color, onClick }: BtnProps) => {
  return (
    <button
      className={`px-6 py-1.5 rounded-md ${
        color === 'grey'
          ? `bg-grey_1 text-grey_6 hover:bg-grey_2`
          : color === 'red'
          ? `bg-red_1 text-red_6 hover:bg-red_2`
          : 'bg-blue_1 text-blue_6 hover:bg-blue_2'
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
