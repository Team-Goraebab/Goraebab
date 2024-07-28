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
      <div className="relative bg-white p-6 rounded-lg w-11/12 max-w-4xl mx-4 md:mx-0 h-4/5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-grey_4 hover:text-grey_4 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mt-4 text-center">
          <span className="text-blue_2">
            이미지
            <span className="text-black">를 불러올 방식을 선택하세요.</span>
          </span>
        </h2>
        <p className="text-center text-black mb-6">
          Please choose a method to upload the image.
        </p>
        <div
          className="flex justify-around gap-6"
          style={{ height: 'calc(100% - 6rem)' }}
        >
          <div className="flex flex-col items-center border border-grey_3 rounded-lg p-6 text-center cursor-pointer hover:border-grey_4 w-1/2 h-full">
            <FaFolderOpen className="text-grey_4 mb-4" size={50} />
            <p className="font-semibold text-grey_4">Local Path</p>
            <p className="text-sm text-grey_4 mt-2">
              내 컴퓨터에서 도커 이미지를 가져옵니다.
            </p>
          </div>
          <div className="flex flex-col items-center border border-grey_3 rounded-lg p-6 text-center cursor-pointer hover:border-grey_4 w-1/2 h-full">
            <FaDocker className="text-grey_4 mb-4" size={50} />
            <p className="font-semibold text-grey_4">Docker Hub</p>
            <p className="text-sm text-grey_4 mt-2">
              도커 허브에서 이미지를 가져옵니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
