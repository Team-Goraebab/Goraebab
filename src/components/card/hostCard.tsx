import { FC } from 'react';
import { FaHome } from 'react-icons/fa';

type HostCardProps = {
  hostNm?: string;
  ip: string;
};

const HostCard: FC<HostCardProps> = ({ hostNm, ip }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 border bg-white border-grey_3 rounded-lg shadow-lg w-72 h-28">
      <div className="flex items-center justify-center w-full space-x-2 rounded-md border-solid border-2 border-blue_2 bg-blue_1 py-2 mb-3">
        <FaHome className="text-blue_2 w-6 h-6" />
        <div className="text-sm text-blue_2 font-semibold">
          {hostNm || 'HOST'}
        </div>
      </div>
      <div className="text-lg font-semibold">{`eth0 : ${ip}`}</div>
    </div>
  );
};

export default HostCard;
