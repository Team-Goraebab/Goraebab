'use client';

import React from 'react';

interface OptionModalProps {
  topTitle?: string;
  middleTitle?: string;
  bottomTitle?: string;
  onTopHandler: () => void;
  onMiddleHandler: () => void;
  onBottomHandler: () => void;
}

/**
 * 옵션 모달
 * @param topTitle 첫 번째 옵션
 * @param middleTitle 두 번째 옵션
 * @param bottomTitle 세 번째 옵션
 * @param onTopHandler 첫 번째 옵션 핸들러
 * @param onMiddleHandler 두 번쨰 옵션 핸들러
 * @param onBottomHandler 세 번째 옵션 핸들러
 * @returns
 */
const OptionModal = ({
  topTitle,
  middleTitle,
  bottomTitle,
  onTopHandler,
  onMiddleHandler,
  onBottomHandler,
}: OptionModalProps) => {
  return (
    <div className="flex flex-col z-50 items-center border border-grey_3 rounded-md w-40 absolute bg-white shadow-lg">
      <button
        className="w-full py-1.5 text-black border-b border-grey_3 text-xs font-semibold"
        onClick={onTopHandler}
      >
        {topTitle || '정보 가져오기'}
      </button>
      <button
        className="w-full py-1.5 text-black border-b border-grey_3 text-xs font-semibold"
        onClick={onMiddleHandler}
      >
        {middleTitle || '실행 시키기'}
      </button>
      <button
        className="w-full py-1.5 text-red-500 text-xs font-semibold"
        onClick={onBottomHandler}
      >
        {bottomTitle || '삭제하기'}
      </button>
    </div>
  );
};

export default OptionModal;
