'use client';

import React from 'react';

interface OptionModalProps {
  onTopHandler?: () => void;
  onMiddleHandler?: () => void;
  onBottomHandler?: () => void;
}

/**
 * 옵션 모달
 * @param onTopHandler 첫 번째 옵션 핸들러
 * @param onMiddleHandler 두 번째 옵션 핸들러
 * @param onBottomHandler 세 번째 옵션 핸들러
 * @returns
 */
const BarOptionModal = ({
  onTopHandler,
  onMiddleHandler,
  onBottomHandler,
}: OptionModalProps) => {
  return (
    <div className="flex flex-col z-50 items-center border border-grey_3 rounded-xl w-32 absolute bg-white shadow-lg">
      <button
        className="w-full py-1 text-black_6 border-b border-grey_3 text-xs font-semibold hover:bg-grey_0 rounded-t-xl transition-colors"
        onClick={onTopHandler}
      >
        {'버전 정보'}
      </button>
      {/* <button
        className="w-full py-1 text-black_6 border-b border-grey_3 text-xs font-semibold hover:bg-grey_0 transition-colors"
        onClick={onMiddleHandler}
      >
        {'시스템 정보'}
      </button> */}
      <button
        className="w-full py-1 text-black_6 text-xs font-semibold hover:bg-grey_0 rounded-b-xl transition-colors"
        onClick={onBottomHandler}
      >
        {'시스템 정보'}
      </button>
    </div>
  );
};

export default BarOptionModal;
