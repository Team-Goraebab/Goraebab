'use client';

import React from 'react';

interface OptionModalProps {
  topTitle?: string;
  middleTitle?: string;
  bottomTitle?: string;
  onTopHandler?: () => void;
  onMiddleHandler?: () => void;
  onBottomHandler?: () => void;
  btnVisible?: boolean;
}

/**
 * 옵션 모달
 * @param topTitle 첫 번째 옵션
 * @param middleTitle 두 번째 옵션
 * @param bottomTitle 세 번째 옵션
 * @param onTopHandler 첫 번째 옵션 핸들러
 * @param onMiddleHandler 두 번째 옵션 핸들러
 * @param onBottomHandler 세 번째 옵션 핸들러
 * @param btnVisible 중간 버튼 보임 여부 (기본값: true)
 * @returns
 */
const OptionModal = ({
  topTitle,
  middleTitle,
  bottomTitle,
  onTopHandler,
  onMiddleHandler,
  onBottomHandler,
  btnVisible = true,
}: OptionModalProps) => {
  return (
    <div className="flex flex-col z-50 items-center border border-grey_3 rounded-xl w-32 absolute bg-grey_0 shadow-lg">
      <button
        className="w-full py-1 text-black_6 border-b border-grey_3 text-xs font-semibold hover:bg-blue_0 rounded-t-xl transition-colors"
        onClick={onTopHandler}
      >
        {topTitle || '상세 정보'}
      </button>

      {btnVisible && (
        <button
          className="w-full py-1 text-black_6 border-b border-grey_3 text-xs font-semibold hover:bg-blue_0 transition-colors"
          onClick={onMiddleHandler}
        >
          {middleTitle || '실행'}
        </button>
      )}

      <button
        className="w-full py-1 text-danger text-xs font-semibold hover:bg-red_0 rounded-b-xl transition-colors"
        onClick={onBottomHandler}
      >
        {bottomTitle || '삭제'}
      </button>
    </div>
  );
};

export default OptionModal;
