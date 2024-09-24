'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { showSnackbar } from '@/utils/toastUtils';
import { useSnackbar } from 'notistack';
import { API_URL, REMOTE_DEAMONS } from '@/app/api/urlPath';
import {
  FaPlay,
  FaPause,
  FaPowerOff,
  FaEllipsisV,
  FaDocker,
} from 'react-icons/fa';

const DaemonConnectBar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [engineStatus, setEngineStatus] = useState<'connect' | 'disconnect'>(
    'connect'
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${API_URL}${REMOTE_DEAMONS}`);
        console.log('원격 데몬 연결', response);
      } catch (error) {
        console.error('원격 데몬 정보를 가져오는 데 실패했습니다:', error);
        // 연결 실패 시 알림 표시
        showSnackbar(
          enqueueSnackbar,
          '도커 엔진이 실행되지 않았습니다.',
          'info',
          '#7F7F7F'
        );
      }
    }

    fetchData();
  }, []);

  const handleEngineStartStop = () => {
    // 엔진을 시작/중지하는 로직 추가
    setEngineStatus((prevStatus) =>
      prevStatus === 'connect' ? 'disconnect' : 'connect'
    );
  };
  return (
    <div className="mt-4 p-2 bg-green-500 rounded-md flex items-center justify-between text-white">
      <div className="flex items-center">
        <FaDocker className="text-xl mr-2" />
        <span className="font-semibold">
          {engineStatus === 'connect' ? 'Daemon connect' : 'Daemon disconnect'}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {engineStatus === 'connect' ? (
          <button onClick={handleEngineStartStop}>
            <FaPause className="text-white" />
          </button>
        ) : (
          <button onClick={handleEngineStartStop}>
            <FaPlay className="text-white" />
          </button>
        )}
        <button>
          <FaPowerOff className="text-white" />
        </button>
        <button>
          <FaEllipsisV className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default DaemonConnectBar;
