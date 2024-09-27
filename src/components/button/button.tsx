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
      className={`px-4 py-2 text-white rounded-md ${
        color ? `bg-grey_3 hover:bg-grey_4` : 'bg-blue_4 hover:bg-blue_5'
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
