import axios from 'axios';

export const createDockerClient = (hostIp?: string) => {
  const isWindows = process.platform === 'win32';
  const effectiveHost = hostIp || 'localhost';

  const options = isWindows
    ? { baseURL: `http://${effectiveHost}:2375` }
    : {
        baseURL: `http://${effectiveHost}`,
        socketPath: '/var/run/docker.sock',
      };

  return axios.create(options);
};

// export const createDockerClient = () => {
//   const isWindows = process.platform === 'win32';
//   const options = isWindows
//     ? { baseURL: `${process.env.DOCKER_URL || 'http://localhost:2375'}` }
//     : { baseURL: 'http://localhost', socketPath: '/var/run/docker.sock' };

//   return axios.create(options);
// };
