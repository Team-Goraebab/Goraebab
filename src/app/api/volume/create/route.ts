import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hostIp = searchParams.get('hostIp') || 'localhost';
  const dockerClient = createDockerClient(hostIp);
  const bodyData = await req.json();

  try {
    const response = await dockerClient.post('/volumes/create', bodyData);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error creating volumes:', error);

    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
