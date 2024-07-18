import React from 'react';

interface CardProps {
  id: string;
  size: string;
  tags: string;
  /**
   * primary
   * secondary
   * accent
   */
  status: string;
}

/**
 *
 * @param status card의 상태 값
 * @returns status에 따른 색상을 반환
 */
const getStatusColors = (status: string) => {
  switch (status) {
    case 'primary':
      return { bg1: '#d2d1f6', bg2: '#4C48FF' };
    case 'secondary':
      return { bg1: '#f6d4d6', bg2: '#FF4853' };
    case 'accent':
      return { bg1: '#f6e3d1', bg2: '#FFA048' };
    default:
      return { bg1: '#d1d1d1', bg2: '#7F7F7F' };
  }
};

const Card: React.FC<CardProps> = ({ id, size, tags, status }) => {
  const { bg1, bg2 } = getStatusColors(status);

  const items = [
    { label: 'ID', value: id },
    { label: 'SIZE', value: size },
    { label: 'TAGS', value: tags },
  ];

  return (
    <div className="flex items-start px-3 pt-1 pb-3 bg-grey_1 shadow rounded-lg relative mb-4">
      <div
        className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-lg"
        style={{ backgroundColor: bg2 }}
      />
      <div className="ml-4 flex flex-col w-full">
        <div className="flex justify-end text-grey_4 text-sm mb-3">
          <span className="font-semibold text-xs">•••</span>
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex items-center mt-[5px] space-x-3.5">
            <span
              className="text-xs py-1 w-[60px] rounded-md font-bold text-center"
              style={{ backgroundColor: bg1, color: bg2 }}
            >
              {item.label}
            </span>
            <span className="font-semibold text-xs truncate max-w-[150px]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
