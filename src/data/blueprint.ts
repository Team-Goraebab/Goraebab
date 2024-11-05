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
    gateway: '',
    ipAddress: '',
  },
  ports: [],
  mounts: [],
  env: [],
  cmd: [],
  imageVolumes: [],
};
