import { DockerHubContent, LocalPathContent } from '@/components';
import React, { useState } from 'react';
import { FaFolderOpen, FaDocker } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ isOpen, onClose }: ModalProps) => {
  const [activeTab, setActiveTab] = useState('local');
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File | null) => {
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 150) {
        alert('파일 용량이 150MB를 초과했습니다.');
        setFile(null);
      } else {
        setFile(file);
      }
    } else {
      setFile(null);
    }
  };

  const handleSave = () => {
    if (file) {
      // 이미지 저장 로직
      console.log('이미지 저장:', file.name);
      // 업로드 후 추가 작업 (예: 컨테이너 실행)
    } else {
      alert('이미지를 선택하세요.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'local':
        return <LocalPathContent onFileChange={handleFileChange} file={file} />;
      case 'docker':
        return <DockerHubContent />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg w-11/12 max-w-4xl mx-4 md:mx-0 h-4/5 flex flex-col shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
        >
          &times;
        </button>
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 text-center">
          <span className="text-blue-500">이미지</span>
          <span className="text-black">를 불러올 방식을 선택하세요.</span>
        </h2>
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setActiveTab('local')}
            className={`flex items-center px-4 py-2 mr-2 ${
              activeTab === 'local'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            } rounded shadow`}
          >
            <FaFolderOpen className="mr-2" />
            Local Path
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`flex items-center px-4 py-2 ${
              activeTab === 'docker'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            } rounded shadow`}
          >
            <FaDocker className="mr-2" />
            Docker Hub
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          {renderTabContent()}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
