// Sidebar.tsx
import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import AddBridgeButton from '../button/addBridgeButton';
import NetworkCard from '../card/networkCard';
import VolumeCard from '../card/volumeCard';
import AddVolumeButton from '../button/addVolumeButton';
import AddContainerButton from '../button/addContainerButton';
import AddImageButton from '../button/addImageButton';
import { useMenuStore } from '@/store/menuStore';
import ImageCard from '../card/imageCard';
import ContainerCard from '../card/containerCard';
import DaemonConnectBar from '../bar/daemonConnectBar';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import LargeButton from '../button/largeButton';
import { fetchData } from '@/services/apiUtils'; // 분리된 API 유틸 함수 가져오기

interface SidebarProps {
  progress: number;
}

const Sidebar = ({ progress }: SidebarProps) => {
  const { activeId } = useMenuStore();

  const [networkData, setNetworkData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [containerData, setContainerData] = useState<any[]>([]);
  const [imageData, setImageData] = useState<any[]>([]);

  // 데이터 로드 함수들
  const loadVolumeData = async () => {
    const data = await fetchData('/api/volume/list');
    setVolumeData(data?.Volumes || []);
  };

  const loadNetworkData = async () => {
    const data = await fetchData('/api/network/list');
    setNetworkData(data?.Networks || []);
  };

  const loadContainerData = async () => {
    const data = await fetchData('/api/container/list');
    setContainerData(data?.Containers || []);
  };

  const loadImageData = async () => {
    const data = await fetchData('/api/image/list');
    setImageData(data?.Images || []);
  };

  const renderNoDataMessage = (message: string) => (
    <div className="flex flex-col items-center justify-center text-center p-4 border border-dashed border-blue_3 rounded-md bg-blue_0">
      <AiOutlineInfoCircle className="text-blue_6 text-2xl mb-2" />
      <p className="font-pretendard font-medium text-blue_6">{message}</p>
    </div>
  );

  const renderDataList = () => {
    let data: any[] = [];
    let CardComponent: React.ElementType | null = null;
    let noDataMessage = '';

    if (activeId === 1) {
      data = containerData;
      CardComponent = ContainerCard;
      noDataMessage = '컨테이너를 추가하세요';
    } else if (activeId === 2) {
      data = imageData;
      CardComponent = ImageCard;
      noDataMessage = '이미지를 추가하세요';
    } else if (activeId === 3) {
      data = networkData;
      CardComponent = NetworkCard;
      noDataMessage = '네트워크 데이터를 추가하세요';
    } else if (activeId === 4) {
      data = volumeData;
      CardComponent = VolumeCard;
      noDataMessage = '볼륨 데이터를 추가하세요';
    }

    // CardComponent가 null이 아닐 때만 JSX로 렌더링
    return data && data.length > 0 && CardComponent
      ? data.map((item, index) => <CardComponent key={index} data={item} />)
      : renderNoDataMessage(noDataMessage);
  };

  useEffect(() => {
    if (activeId === 1) {
      loadContainerData();
    } else if (activeId === 2) {
      loadImageData();
    } else if (activeId === 3) {
      loadNetworkData();
    } else if (activeId === 4) {
      loadVolumeData();
    }
  }, [activeId]); // activeId가 변경될 때마다 해당 데이터를 가져옴

  return (
    <div className="fixed top-0 left-0 w-[300px] flex flex-col h-full bg-white border-r-2 border-grey_2">
      <div className="flex flex-col flex-grow pl-4 pr-4 pt-20 overflow-y-auto scrollbar-hide">
        <div className="flex-grow">{renderDataList()}</div>
        <div className="flex-shrink-0">
          {/* 현재 활성화된 데이터에 따라 추가 버튼 표시 */}
          <LargeButton title={'추가하기'} onClick={() => {}} />
        </div>
      </div>
      <div className="">
        <DaemonConnectBar />
      </div>
    </div>
  );
};

export default Sidebar;
