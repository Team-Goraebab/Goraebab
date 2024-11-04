// 컨테이너 초기 설정 상수
export const DEFAULT_CONTAINER_SETTINGS = {
  containerName: '',
  containerId: '',
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
