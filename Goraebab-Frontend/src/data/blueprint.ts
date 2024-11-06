import { generateId } from '@/utils/randomId';

export const DEFAULT_CONTAINER_SETTINGS = {
  containerName: '',
  containerId: generateId('container'),
  image: {
    imageId: '',
    name: '',
    tag: '',
  },
  networkSettings: {
    gateway: '192.168.1.1',
    ipAddress: '192.168.1.1',
  },
  ports: [
    {
      privatePort: 80,
      publicPort: 8080,
    },
  ],
  mounts: [],
  env: [],
  cmd: [],
  imageVolumes: [],
};
