export const TEST_DATA = [
  {
    blueprintId: 1,
    name: 'Project1 blueprint',
    data: {
      host: [
        {
          name: 'my_new_host',
          isRemote: false,
          ip: '',
          id: 'host_id_1',
          network: [
            {
              name: '네트워크 이름',
              id: 'network_id_1',
              driver: 'driver',
              ipam: {
                config: [
                  {
                    subnet: 'string',
                  },
                ],
              },
              containers: [
                {
                  containerName: '컨테이너 이름:::::!!',
                  containerId: 'container_id_1',
                  image: {
                    imageId: 'imageId_123',
                    name: 'image_nameee',
                    tag: 'latest',
                  },
                  networkSettings: {
                    gateway: '123.123.123',
                    ipAddress: '123.123.144',
                  },
                  ports: [
                    {
                      privatePort: 8080,
                      publicPort: 6060,
                    },
                  ],
                  mounts: [
                    {
                      type: 'type',
                      name: 'name',
                      source: 'source',
                      destination: 'destination',
                      driver: 'driver',
                      alias: 'alias',
                      mode: 'mode',
                    },
                  ],
                  env: [],
                  cmd: ['string'],
                },
              ],
            },
          ],
          volume: [
            {
              name: 'volume_name',
              driver: 'volume_driver',
            },
          ],
        },
        {
          isRemote: true,
          ip: '127.18.0.0',
          name: '내가 호스트야',
          id: '127.18.0.0',
          network: [
            {
              name: '네트워크 이름',
              id: 'network_id_2',
              driver: 'bridge',
              ipam: {
                config: [
                  {
                    subnet: 'string',
                  },
                ],
              },
              containers: [
                {
                  containerName: '컨테이너 이름임용',
                  containerId: 'container_id_2',
                  image: {
                    imageId: 'imageIdimageId',
                    name: 'name_name_name',
                    tag: 'tag',
                  },
                  networkSettings: {
                    gateway: 'string',
                    ipAddress: 'string',
                  },
                  ports: [
                    {
                      privatePort: 0,
                      publicPort: 0,
                    },
                  ],
                  mounts: [
                    {
                      type: 'type',
                      name: 'namename',
                      source: 'sourcesource',
                      destination: 'destinationdestination',
                      driver: 'driver',
                      alias: 'aliasalias',
                      mode: 'mode',
                    },
                  ],
                  env: ['string'],
                  cmd: ['string'],
                },
              ],
            },
          ],
          volume: [
            {
              name: 'string',
              driver: 'string',
            },
          ],
        },
      ],
    },
    isRemote: true,
    dateCreated: '2024-11-02T13:33:36.035Z',
    dateUpdated: '2024-11-02T13:33:36.035Z',
  },
  {
    blueprintId: 2,
    name: '블루프린트야',
    data: {
      host: [
        {
          isRemote: false,
          ip: '',
          name: '내 호스트!',
          id: 'host_id_2',
          network: [
            {
              name: 'network_3333',
              id: 'network_id_3',
              driver: 'string',
              ipam: {
                config: [
                  {
                    subnet: 'string',
                  },
                ],
              },
              containers: [
                {
                  containerName: 'container 이름인데용가리',
                  containerId: 'container_id_3',
                  image: {
                    imageId: 'imageId',
                    name: 'name',
                    tag: 'tag',
                  },
                  networkSettings: {
                    gateway: 'gateway',
                    ipAddress: 'ipAddress',
                  },
                  ports: [
                    {
                      privatePort: 1230,
                      publicPort: 1230,
                    },
                  ],
                  mounts: [
                    {
                      type: 'type',
                      name: 'name',
                      source: 'sourcesource',
                      destination: 'destination',
                      driver: 'driverdriver',
                      alias: '별칭인뎁숑',
                      mode: '모오등',
                    },
                  ],
                  env: [],
                  cmd: ['cmd'],
                },
                {
                  containerName: 'container 두 개다앙',
                  containerId: 'container_id_3333',
                  image: {
                    imageId: 'imageId22',
                    name: 'name22',
                    tag: 'tag22',
                  },
                  networkSettings: {
                    gateway: 'gateway22',
                    ipAddress: 'ipAddress22',
                  },
                  ports: [
                    {
                      privatePort: 1230,
                      publicPort: 1230,
                    },
                  ],
                  mounts: [
                    {
                      type: 'type',
                      name: 'name',
                      source: 'sourcesource',
                      destination: 'destination',
                      driver: 'driverdriver',
                      alias: '별칭인뎁숑',
                      mode: '모오등',
                    },
                  ],
                  env: [],
                  cmd: ['cmd'],
                },
              ],
            },
          ],
          volume: [
            {
              name: 'volume_name',
              driver: 'volume_driver',
            },
          ],
        },
      ],
    },
    isRemote: true,
    dateCreated: '2024-11-02T13:33:36.035Z',
    dateUpdated: '2024-11-02T13:33:36.035Z',
  },
];
