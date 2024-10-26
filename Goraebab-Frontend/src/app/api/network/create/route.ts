import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const { searchParams } = new URL(req.url);
  const hostIp = searchParams.get('hostIp') || 'localhost';
  const dockerClient = createDockerClient(hostIp);

  try {
    const response = await dockerClient.post('/networks/create', {
      Name: bodyData.Name, // 네트워크 이름
      Driver: bodyData.Driver, // 네트워크 드라이버
      IPAM: {
        Config: [
          {
            Subnet: bodyData.Subnet, // CIDR 형식의 Subnet (예: 192.168.1.0/24)
            Gateway: bodyData.Gateway, // Gateway IP (예: 192.168.1.1)
          },
        ],
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 },
    );
  }
}
