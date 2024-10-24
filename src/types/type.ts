export interface Volume {
  id: string;
  name: string;
  driver: string;
  mountPoint: string;
  capacity: string;
  status: string;
}

export interface VolumeData {
  Name: string;
  Driver: string;
  Mountpoint: string;
  Scope: string;
}

export interface Image {
  id: string;
  name: string;
  tag: string;
  source: 'local' | 'dockerHub';
  size: string;
}

export interface ContainerInfo {
  Name: string;
  IPv4Address: string;
}

export interface Network {
  Id: string;
  Name: string;
  Created: string;
  Scope: string;
  NetworkIp?: string;
  Driver: string;
  Status: string;
  IPAM?: {
    Config?: {
      Gateway?: string;
      Subnet?: string;
    }[];
  };
  Containers?: { [key: string]: { Name: string; IPv4Address: string } };
}

export type ThemeColor = {
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
};

export interface Container {
  id: string;
  name: string;
  ip: string;
  size: string;
  tag: string;
  active: string;
  status: string;
  network: string;
  image: Image;
  volume?: Volume[];
  networkId?: string; // 연결된 네트워크 ID
}

export type HostNetwork = {
  id: string;
  name: string;
  ip: string;
  hostId: string;
  networkUniqueId: string;
  containers: string[];
};

export interface Host {
  id: string;
  hostNm: string;
  hostIp: string;
  status: boolean;
  isRemote: boolean;
  themeColor: any;
  networks: HostNetwork[];
}

export interface NetworkSettings {
  gateway: string;
  ipAddress: string;
}

export interface Port {
  privatePort: number;
  publicPort: number;
}

export interface Mount {
  name: string;
  source: string;
  destination: string;
  driver: string;
}

export interface Image {
  imageId: string;
  name: string;
  tag: string;
}

export interface ContainerSetting {
  containerName: string;
  image: Image;
  networkSettings: NetworkSettings;
  ports: Port[];
  mounts: Mount[];
}
