import React from 'react';
import { HiPlus } from 'react-icons/hi';

interface BtnProps {
  title: string;
  onClick: () => void;
}

/**
 *
 * @param title 버튼 텍스트
 * @param color 버튼 색상 (옵션)
 * @param onClick 클릭 핸들러
 * @returns
 */
const LargeButton = ({ title, onClick }: BtnProps) => {
  return (
    <>
      <button
        onClick={onClick}
        className={`
        p-2 w-full text-blue_6 rounded-lg font-bold 
        border border-blue_6 font-pretendard
        transition-all duration-100 ease-in-out
        active:transform active:scale-90
      `}
      >
        <div className="flex gap-2 items-center justify-center">
          <HiPlus size={20} className="font-bold" />
          <span>{title}</span>
        </div>
      </button>
    </>
  );
};

export default LargeButton;
