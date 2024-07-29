import React from 'react';

interface DockerHubContentProps {
  onBack: () => void;
}

const DockerHubContent: React.FC<DockerHubContentProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full relative p-2">
      <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold text-left text-blue_2">
        Docker Hub
      </h2>
      <div className="flex flex-col items-center mt-4 w-full h-full">
        <input
          type="text"
          placeholder="이미지를 검색하세요"
          className="border border-grey_3 rounded w-full p-2"
        />
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

export default DockerHubContent;
