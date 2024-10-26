import axios from 'axios';
import os from 'os';

export const createDockerClient = (hostIp?: string | null) => {
  const effectiveHost =
    hostIp === null || hostIp === undefined
      ? sessionStorage.getItem('selectedHostIp') || 'localhost'
      : hostIp;

  // IP 주소와 포트를 정규식으로 파싱
  const ipPortRegex = /^((?:\d{1,3}\.){3}\d{1,3})(?::(\d+))?$/;
  const match = effectiveHost.match(ipPortRegex);

  let host = effectiveHost;
  let port = '2375';

  if (match) {
    host = match[1];
    port = match[2] || '2375';
  }

  const isLocalhost = host === 'localhost' || host === '127.0.0.1';

  // Windows인 경우 다른 소켓 경로 사용
  const isWindows = os.platform() === 'win32';
  const dockerSocketPath = isWindows
    ? '//./pipe/docker_engine'
    : '/var/run/docker.sock';

  const options = isLocalhost
    ? {
      baseURL: 'http://localhost',
      socketPath: dockerSocketPath,
    }
    : {
      baseURL: `http://${host}:${port}`,
    };

  return axios.create(options);
};
