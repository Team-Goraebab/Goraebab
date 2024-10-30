import axios from 'axios';
import os from 'os';

export const createDockerClient = (hostIp?: string | null) => {
  const effectiveHost =
    hostIp === null || hostIp === undefined
      ? sessionStorage.getItem('selectedHostIp') || 'host.docker.internal'
      : hostIp;

  // IP 주소와 포트를 정규식으로 파싱
  const ipPortRegex = /^((?:\d{1,3}\.){3}\d{1,3})(?::(\d+))?$/;
  const match = effectiveHost.match(ipPortRegex);

  const isLocalhost =
    effectiveHost === 'localhost' ||
    effectiveHost === '127.0.0.1' ||
    effectiveHost === 'host.docker.internal';

  let host = isLocalhost ? 'host.docker.internal' : effectiveHost;
  let port = '2375';

  if (match) {
    host = match[1];
    port = match[2] || '2375';
  }

  // Windows인 경우 다른 소켓 경로 사용
  const isWindows = os.platform() === 'win32';
  const dockerSocketPath = isWindows
    ? '//./pipe/docker_engine'
    : '/var/run/docker.sock';

  const options = isLocalhost
    ? {
        baseURL: `http://${host}`,
        socketPath: dockerSocketPath,
      }
    : {
        baseURL: `http://${host}:${port}`,
      };

  return axios.create(options);
};
