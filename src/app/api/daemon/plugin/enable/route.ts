import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../../axiosInstance';

// 플러그인 활성화
export async function POST(req: NextRequest) {
  const { name } = await req.json();
  const { searchParams } = new URL(req.url);
  const hostIp = searchParams.get('hostIp') || 'localhost';
  const dockerClient = createDockerClient(hostIp);

  if (!name) {
    return NextResponse.json(
      { error: 'Plugin name is required' },
      { status: 400 }
    );
  }

  try {
    const response = await dockerClient.post(`/plugins/${name}/enable`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(`Error enabling Docker plugin: ${name}`, error);

    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: `Failed to enable Docker plugin: ${name}` },
      { status: 500 }
    );
  }
}
