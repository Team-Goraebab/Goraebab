import React from 'react';
import { FaFolderOpen, FaDocker } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg w-11/12 max-w-4xl mx-4 md:mx-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4 text-center">
          <span className="text-blue-500">
            이미지를 불러올 방식을 선택하세요.
          </span>
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please choose a method to upload the image.
        </p>
        <div className="flex justify-around">
          <div className="flex flex-col items-center border border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 w-1/3">
            <FaFolderOpen className="text-gray-600 mb-4" size={50} />
            <p className="font-semibold">Local Path</p>
            <p className="text-sm text-gray-500 mt-2">
              내 컴퓨터에서 도커 이미지를 가져옵니다.
            </p>
          </div>
          <div className="flex flex-col items-center border border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 w-1/3">
            <FaDocker className="text-gray-600 mb-4" size={50} />
            <p className="font-semibold">Docker Hub</p>
            <p className="text-sm text-gray-500 mt-2">
              도커 허브에서 이미지를 가져옵니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
