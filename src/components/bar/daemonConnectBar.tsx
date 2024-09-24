'use client';

import React, { useState } from 'react';

import {
  FaPlay,
  FaPause,
  FaPowerOff,
  FaEllipsisV,
  FaDocker,
} from 'react-icons/fa';

const DaemonConnectBar = () => {
  const [imageData, setImageData] = useState<any[]>([]);
  const [engineStatus, setEngineStatus] = useState<'running' | 'stopped'>(
    'running'
  );

  const handleEngineStartStop = () => {
    // 엔진을 시작/중지하는 로직 추가
    setEngineStatus((prevStatus) =>
      prevStatus === 'running' ? 'stopped' : 'running'
    );
  };

  <div className="mt-4 p-2 bg-green-500 rounded-md flex items-center justify-between text-white">
    <div className="flex items-center">
      <FaDocker className="text-xl mr-2" />
      <span className="font-semibold">
        {engineStatus === 'running' ? 'Engine running' : 'Engine stopped'}
      </span>
    </div>
    <div className="flex items-center space-x-2">
      {engineStatus === 'running' ? (
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
  </div>;
};

export default DaemonConnectBar;
