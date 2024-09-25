'use client';

import React, { useState } from 'react';
import { Button, ProgressBar } from '@/components';
import AddBridgeButton from '../button/addBridgeButton';
import NetworkCard from '../card/networkCard';
import VolumeCard from '../card/volumeCard';
import AddVolumeButton from '../button/addVolumeButton';
import AddContainerButton from '../button/addContainerButton';
import AddImageButton from '../button/addImageButton';
import { useMenuStore } from '@/store/menuStore';
import ImageCard from '../card/imageCard';
import ContainerCard from '../card/containerCard';
import { useImageStore } from '@/store/imageStore';
import DaemonConnectBar from '../bar/daemonConnectBar';

interface SidebarProps {
  progress: number;
}

const Sidebar = ({ progress }: SidebarProps) => {
  const { activeId } = useMenuStore();
  const images = useImageStore((state) => state.images);

  const [networkData, setNetworkData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [containerData, setContainerData] = useState<any[]>([]);
  const [imageData, setImageData] = useState<any[]>([]);

  const handleCreateNetwork = (newNetwork: any) => {
    setNetworkData((prevNetworks) => [...prevNetworks, newNetwork]);
  };

  const handleCreateVolume = (newVolume: any) => {
    setVolumeData((prevVolumes) => [...prevVolumes, newVolume]);
  };

  const handleCreateContainer = (newContainer: any) => {
    setContainerData((prevContainers) => [...prevContainers, newContainer]);
  };

  const handleCreateImage = (newImage: any) => {
    setImageData((prevImages) => [...prevImages, newImage]);
  };

  // 컨테이너 아이디 === 1
  // 이미지 아이디 === 2
  // 네트워크 아이디 === 3
  // 볼륨 아이디 === 4
  return (
    <div className="fixed top-0 left-0 w-[300px] flex flex-col h-full bg-white border-r-2 border-grey_2">
      {/* This div will take the remaining height above the DaemonConnectBar */}
      <div className="flex flex-col flex-grow pl-4 pr-4 pt-20 overflow-y-auto scrollbar-hide">
        <div className="flex-grow">
          {activeId === 1 ? (
            <>
              {containerData.length > 0 ? (
                containerData.map((container, index) => (
                  <ContainerCard key={index} data={container} />
                ))
              ) : (
                <p className={'font-pretendard font-light'}>
                  컨테이너를 추가하세요
                </p>
              )}
            </>
          ) : activeId === 2 ? (
            <>
              {images.length > 0 ? (
                images.map((image) => <ImageCard key={image.id} data={image} />)
              ) : (
                <p className={'font-pretendard font-light'}>
                  이미지를 추가하세요
                </p>
              )}
            </>
          ) : activeId === 3 ? (
            <>
              {networkData.length > 0 ? (
                networkData.map((network, index) => (
                  <NetworkCard key={index} data={network} />
                ))
              ) : (
                <p className={'font-pretendard font-light'}>
                  네트워크 데이터를 추가하세요
                </p>
              )}
            </>
          ) : activeId === 4 ? (
            <>
              {volumeData.length > 0 ? (
                volumeData.map((volume, index) => (
                  <VolumeCard key={index} data={volume} />
                ))
              ) : (
                <p className={'font-pretendard font-light'}>
                  볼륨 데이터를 추가하세요
                </p>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="flex-shrink-0">
          {/* <ProgressBar progress={progress} /> */}
          {activeId === 1 ? (
            <AddContainerButton onCreate={handleCreateContainer} />
          ) : activeId === 2 ? (
            <AddImageButton onCreate={handleCreateImage} />
          ) : activeId === 3 ? (
            <AddBridgeButton onCreate={handleCreateNetwork} />
          ) : activeId === 4 ? (
            <AddVolumeButton onCreate={handleCreateVolume} />
          ) : (
            <Button title={'추가하기'} />
          )}
        </div>
      </div>
      <div className="">
        <DaemonConnectBar />
      </div>
    </div>
  );
};

export default Sidebar;
