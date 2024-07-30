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
        <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl font-bold mt-4 text-center">
          <span className="text-blue_2">
            이미지
            <span className="text-black">를 불러올 방식을 선택하세요.</span>
          </span>
        </h2>
        <p className="text-center text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl text-black mb-6">
          Please choose a method to upload the image.
        </p>
        <div
          className="flex justify-around gap-6"
          style={{ height: 'calc(100% - 6.3rem)' }}
        >
          <div className="flex flex-col border justify-center border-grey_3 rounded-lg p-6 text-center cursor-pointer hover:border-grey_4 w-1/2 h-full">
            <div className="flex flex-col items-center">
              <FaFolderOpen className="text-grey_4 mb-4 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-14 xl:h-14 2xl:w-14 2xl:h-14" />
              <p className="font-bold text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl text-grey_4">
                Local Path
              </p>
              <p className="text-xs md:text-sm lg:text-base xl:text-base 2xl:text-base text-grey_4 mt-2 font-regular">
                내 컴퓨터에서 도커 이미지를 가져옵니다.
              </p>
            </div>
          </div>
          <div className="flex flex-col border justify-center border-grey_3 rounded-lg p-6 text-center cursor-pointer hover:border-grey_4 w-1/2 h-full">
            <div className="flex flex-col items-center">
              <FaDocker className="text-grey_4 mb-4 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-14 xl:h-14 2xl:w-14 2xl:h-14" />
              <p className="font-bold text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl text-grey_4">
                Docker Hub
              </p>
              <p className="text-xs md:text-sm lg:text-base xl:text-base 2xl:text-base text-grey_4 mt-2 font-regular">
                도커 허브에서 이미지를 가져옵니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
