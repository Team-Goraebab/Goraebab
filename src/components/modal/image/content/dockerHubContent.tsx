import React from 'react';

const DockerHubContent = () => {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg w-full h-full p-6">
      <input
        type="text"
        placeholder="이미지를 검색하세요"
        className="border border-gray-300 rounded w-full p-2"
      />
    </div>
  );
};

export default DockerHubContent;
