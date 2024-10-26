'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  ScrollShadow,
  Tooltip,
  Divider,
  Badge, CardHeader, CardFooter,
} from '@nextui-org/react';
import { useMenuStore } from '@/store/menuStore';
import { selectedHostStore } from '@/store/seletedHostStore';
import { RxReload } from 'react-icons/rx';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import AddBridgeButton from '../button/addBridgeButton';
import AddVolumeButton from '../button/addVolumeButton';
import AddContainerButton from '../button/addContainerButton';
import AddImageButton from '../button/addImageButton';
import NetworkCard from '../card/networkCard';
import VolumeCard from '../card/volumeCard';
import ImageCard from '../card/imageCard';
import ContainerCardGroup from '@/components/card/containerCardGroup';
import DaemonConnectBar from '../bar/daemonConnectBar';

type DataHandlerType = {
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
};

interface Container {
  Id: string;
  Name: string;
  Labels: {
    'com.docker.compose.project'?: string;
  };

  [key: string]: any;
}

interface ComponentMapItem {
  title: string;
  addButton: React.ComponentType<any>;
  cardComponent?: React.ComponentType<any>;
  noDataMessage: string;
  helpType: string;
}

const loadData = async (
  apiUrl: string,
  setData: React.Dispatch<React.SetStateAction<any[]>>,
  dataKey?: string,
) => {
  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    const data = await response.json();
    setData(dataKey ? data?.[dataKey] || [] : data || []);
  } catch (error) {
    throw error;
  }
};

const Sidebar = () => {
  const { activeId } = useMenuStore();
  const selectedHostIp = selectedHostStore((state) => state.selectedHostIp);
  const [networkData, setNetworkData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [containerData, setContainerData] = useState<Container[]>([]);
  const [imageData, setImageData] = useState<any[]>([]);

  const apiMap: Record<number, { url: string; dataKey?: string }> = {
    1: { url: `/api/container/list?hostIp=${selectedHostIp}` },
    2: { url: `/api/image/list?hostIp=${selectedHostIp}` },
    3: { url: `/api/network/list?hostIp=${selectedHostIp}` },
    4: { url: `/api/volume/list?hostIp=${selectedHostIp}`, dataKey: 'Volumes' },
  };

  const dataHandlers: Record<1 | 2 | 3 | 4, DataHandlerType> = {
    1: { data: containerData, setData: setContainerData },
    2: { data: imageData, setData: setImageData },
    3: { data: networkData, setData: setNetworkData },
    4: { data: volumeData, setData: setVolumeData },
  };

  const componentMap: Record<1 | 2 | 3 | 4, ComponentMapItem> = {
    1: {
      title: '컨테이너',
      addButton: AddContainerButton,
      noDataMessage: '컨테이너를 추가하세요',
      helpType: 'container',
    },
    2: {
      title: '이미지',
      addButton: AddImageButton,
      cardComponent: ImageCard,
      noDataMessage: '이미지를 추가하세요',
      helpType: 'image',
    },
    3: {
      title: '네트워크',
      addButton: AddBridgeButton,
      cardComponent: NetworkCard,
      noDataMessage: '네트워크 데이터를 추가하세요',
      helpType: 'network',
    },
    4: {
      title: '볼륨',
      addButton: AddVolumeButton,
      cardComponent: VolumeCard,
      noDataMessage: '볼륨 데이터를 추가하세요',
      helpType: 'volume',
    },
  };

  const handleCreate = async (newItem: any) => {
    try {
      const { url, dataKey } = apiMap[activeId] || {};
      if (!url) return;

      await loadData(url, dataHandlers[activeId as 1 | 2 | 3 | 4].setData, dataKey);
      setTimeout(() => {
        loadData(url, dataHandlers[activeId as 1 | 2 | 3 | 4].setData, dataKey);
      }, 2000);
    } catch (error) {
      throw error;
    }
  };

  const currentComponent = componentMap[activeId as 1 | 2 | 3 | 4];

  const renderNoDataMessage = (message: string) => (
    <Card className="bg-default-50 border-dashed border-2 border-default-200">
      <Card className="py-8 flex flex-col items-center gap-2">
        <AiOutlineInfoCircle className="text-default-500 text-2xl" />
        <p className="text-default-500 text-sm">{message}</p>
      </Card>
    </Card>
  );

  const handleDeleteSuccess = () => {
    const { url, dataKey } = apiMap[activeId] || {};
    if (!url) return;
    loadData(url, dataHandlers[activeId as 1 | 2 | 3 | 4].setData, dataKey);
  };

  const renderDataList = () => {
    if (!currentComponent) return null;

    const { cardComponent: CardComponent, noDataMessage } = currentComponent;
    const data = dataHandlers[activeId as 1 | 2 | 3 | 4]?.data;

    if (activeId === 1) {
      const groupedContainers = Array.isArray(containerData)
        ? containerData.reduce((acc, container) => {
          const groupName =
            container.Labels['com.docker.compose.project'] ||
            container.Names[0].replace(/^\//, '');
          if (!acc[groupName]) {
            acc[groupName] = {
              containers: [],
              networkMode: container.HostConfig?.NetworkMode || 'Unknown',
            };
          }
          acc[groupName].containers.push(container);
          return acc;
        }, {} as Record<string, { containers: Container[]; networkMode: string }>)
        : {};

      return Object.entries(groupedContainers).map(([groupName, { containers }]) => (
        <ContainerCardGroup
          key={`${groupName}-${selectedHostIp}`}
          projectName={groupName}
          containers={containers}
          onDeleteSuccess={handleDeleteSuccess}
        />
      ));
    }

    return data && data.length > 0
      ? data.map((item, index) =>
        CardComponent ? (
          <CardComponent
            key={`${item.Id || index}-${selectedHostIp}`}
            data={item}
            onDeleteSuccess={handleDeleteSuccess}
          />
        ) : null,
      )
      : renderNoDataMessage(noDataMessage);
  };

  const refreshData = () => {
    const { url, dataKey } = apiMap[activeId] || {};
    if (!url) return;
    loadData(url, dataHandlers[activeId as 1 | 2 | 3 | 4].setData, dataKey);
  };

  useEffect(() => {
    const { url, dataKey } = apiMap[activeId] || {};
    if (!url) return;
    loadData(url, dataHandlers[activeId as 1 | 2 | 3 | 4].setData, dataKey);
  }, [activeId]);

  useEffect(() => {
    setImageData([]);
    refreshData();
  }, [selectedHostIp]);

  return (
    <Card
      className="fixed z-[9] top-0 right-0 w-[280px] h-full rounded-none shadow-lg bg-background/70 backdrop-blur-md">
      <CardHeader className="flex flex-row justify-between items-center px-4 py-3 bg-default-50">
        <div className="flex items-center gap-2">
          <h2 className="text-md font-semibold">
            {currentComponent?.title || '데이터'}
          </h2>
          <div
            className="px-2 py-1 bg-blue_1 rounded-lg font-medium text-sm"
          >
            {dataHandlers[activeId as 1 | 2 | 3 | 4]?.data.length || 0}
          </div>
        </div>
        <Tooltip content="새로고침">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={refreshData}
          >
            <RxReload size={16} />
          </Button>
        </Tooltip>
      </CardHeader>
      <Divider />
      <ScrollShadow className="flex-grow h-[calc(100vh-180px)] px-4 py-4">
        <div className="flex flex-col gap-2">
          {renderDataList()}
        </div>
      </ScrollShadow>
      <Divider />
      <CardFooter className="px-4 py-4">
        {currentComponent ? (
          React.createElement(currentComponent.addButton, {
            onCreate: handleCreate,
          })
        ) : (
          <Button fullWidth color="primary">
            추가하기
          </Button>
        )}
      </CardFooter>
      <DaemonConnectBar />
    </Card>
  );
};

export default Sidebar;
