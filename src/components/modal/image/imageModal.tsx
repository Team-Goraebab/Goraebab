import { DockerHubContent, LocalPathContent } from '@/components';
import React, { useState } from 'react';
import { FaFolderOpen, FaDocker } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ isOpen, onClose }: ModalProps) => {
  const [activeTab, setActiveTab] = useState('local');

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'local':
        return <LocalPathContent />;
      case 'docker':
        return <DockerHubContent />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg w-11/12 max-w-4xl mx-4 md:mx-0 h-4/5 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl font-bold mt-4 mb-4 text-start">
          <span className="text-blue_2">
            이미지
            <span className="text-black">를 불러올 방식을 선택하세요.</span>
          </span>
        </h2>
        <div className="flex justify-start mb-4">
          <button
            onClick={() => setActiveTab('local')}
            className={`flex items-center p-2 mr-2 ${
              activeTab === 'local'
                ? 'bg-blue_2 text-white'
                : 'bg-gray-200 text-black'
            } rounded`}
          >
            <FaFolderOpen className="mr-2" />
            Local Path
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`flex items-center p-2 ${
              activeTab === 'docker'
                ? 'bg-blue_2 text-white'
                : 'bg-gray-200 text-black'
            } rounded`}
          >
            <FaDocker className="mr-2" />
            Docker Hub
          </button>
        </div>
        <div className="flex-grow flex">{renderTabContent()}</div>
        <div className="flex justify-between mt-4">
          <div>
            {activeTab === 'local' && (
              <button className="p-2 bg-gray-200 text-black rounded">
                파일 찾기
              </button>
            )}
          </div>
          <div>
            <button className="p-2 bg-blue_2 text-white rounded">
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
