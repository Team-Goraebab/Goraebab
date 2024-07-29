import React from 'react';
import { FaFolderOpen } from 'react-icons/fa';

interface LocalPathContentProps {
  onBack: () => void;
}

const LocalPathContent: React.FC<LocalPathContentProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full relative p-2">
      <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold text-left text-blue_2">
        Local Path
      </h2>
      <div className="flex flex-col items-center justify-center border border-grey_3 rounded-lg p-6 mt-4 w-full h-full">
        <FaFolderOpen className="text-grey_4 mb-4 w-20 h-20" />
        <p className="font-bold text-xl text-grey_4">Local Path</p>
        <p className="text-base text-grey_4 mt-2">
          내 컴퓨터에서 도커 이미지를 가져옵니다.
        </p>
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="mr-4 p-2 bg-blue_2 text-white rounded"
          onClick={onBack}
        >
          뒤로 가기
        </button>
        <button className="p-2 bg-blue_2 text-white rounded">확인</button>
      </div>
    </div>
  );
};

export default LocalPathContent;
