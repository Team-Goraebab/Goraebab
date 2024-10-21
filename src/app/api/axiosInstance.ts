import axios from 'axios';

export const createDockerClient = (hostIp?: string) => {
  const isWindows = process.platform === 'win32';
  const effectiveHost = hostIp || 'localhost';
  const baseURL = isWindows
    ? `http://${effectiveHost}:2375`
    : `http://${effectiveHost}`;

  return axios.create({
    baseURL,
  });
};
