import React from 'react';

type Container = {
  name: string;
  ip: string;
  status: 'running' | 'stopped';
};

type CardContainerkProps = {
  networkIp: string;
  containers: Container[];
};

const CardContainer = ({ networkIp, containers }: CardContainerkProps) => {
  return (
    <div className="flex flex-col items-center p-[10px] border bg-white border-grey_3 rounded-lg shadow-lg w-72">
      <div className="w-full bg-blue-100 text-blue-800 p-2 rounded-md mb-3">
        {`docker0 : ${networkIp}`}
      </div>
      {containers.length > 0 ? (
        <div className="w-full max-h-60 overflow-y-auto">
          {containers.map((container, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 mb-2 border rounded-md bg-gray-50"
            >
              <span>{container.name}</span>
              <span>{container.ip}</span>
              <span
                className={`w-3 h-3 rounded-full ${
                  container.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CardContainer;
