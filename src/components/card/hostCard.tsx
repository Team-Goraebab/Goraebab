import { FC } from 'react';
import { FaHome } from 'react-icons/fa';

type HostCardProps = {
  ip: string;
};

const HostCard: FC<HostCardProps> = ({ ip }) => {
  return (
    <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg shadow-lg w-72 h-28">
      <div className="flex items-center space-x-4">
        <FaHome className="text-blue-500 w-8 h-8" />
        <div>
          <div className="text-sm text-gray-500">HOST</div>
          <div className="text-lg font-semibold">{`eth0 : ${ip}`}</div>
        </div>
      </div>
    </div>
  );
};

export default HostCard;
