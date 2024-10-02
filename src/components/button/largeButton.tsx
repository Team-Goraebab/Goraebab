import React from 'react';
import { HiPlus } from 'react-icons/hi';

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
const LargeButton = ({ title, color, onClick }: BtnProps) => {
  return (
    <button
      onClick={onClick}
      className="mt-4 p-2 w-full text-blue_6 rounded font-bold border border-blue_6"
    >
      <div className="flex gap-2 items-center justify-center">
        <HiPlus size={20} className="font-bold" />
        <span>{title}</span>
      </div>
    </button>
  );
};

export default LargeButton;
