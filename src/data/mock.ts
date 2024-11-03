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
          network: [
            {
              name: 'string',
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
                  containerName: '컨테이너 이름:::::!!',
                  image: {
                    imageId: 'string',
                    name: 'string',
                    tag: 'string',
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
                      type: 'string',
                      name: 'string',
                      source: 'string',
                      destination: 'string',
                      driver: 'string',
                      alias: 'string',
                      mode: 'string',
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
        {
          isRemote: true,
          ip: '127.18.0.0',
          name: '내가 호스트야',
          network: [
            {
              name: '네트워크 이름',
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
                  image: {
                    imageId: 'string',
                    name: 'string',
                    tag: 'string',
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
                      type: 'string',
                      name: 'string',
                      source: 'string',
                      destination: 'string',
                      driver: 'string',
                      alias: 'string',
                      mode: 'string',
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
          network: [
            {
              name: 'string',
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
                  containerName: 'string',
                  image: {
                    imageId: 'string',
                    name: 'string',
                    tag: 'string',
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
                      type: 'string',
                      name: 'string',
                      source: 'string',
                      destination: 'string',
                      driver: 'string',
                      alias: 'string',
                      mode: 'string',
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
];
