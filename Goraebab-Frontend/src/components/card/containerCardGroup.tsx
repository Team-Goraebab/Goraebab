import React from 'react';
import { ContainerCard } from '@/components';
import { FiBox } from 'react-icons/fi';

interface ContainerGroupProps {
  projectName?: string;
  containers?: any[];
  onDeleteSuccess: () => void;
}

const ContainerCardGroup = ({
  projectName,
  containers,
  onDeleteSuccess,
}: ContainerGroupProps) => {
  return (
    <div className="mb-4 bg-white border rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-grey_0">
        <div className="flex flex-row items-center gap-2">
          <FiBox />
          <h3 className="font-[500] text-sm font-montserrat truncate">
            {projectName || 'Unknown Project'}
          </h3>
        </div>
      </div>
      <div className="p-3">
        {containers && containers.length > 0 ? (
          containers.map((container) => (
            <ContainerCard
              key={container.Id}
              data={container}
              onDeleteSuccess={onDeleteSuccess}
            />
          ))
        ) : (
          <div className="text-center">컨테이너가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default ContainerCardGroup;
