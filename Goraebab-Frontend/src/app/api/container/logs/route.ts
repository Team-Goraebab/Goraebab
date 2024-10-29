import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const hostIp = searchParams.get('hostIp') || 'localhost';
  const dockerClient = createDockerClient(hostIp);

  if (!id) {
    return NextResponse.json(
      { error: 'Missing container id' },
      { status: 400 },
    );
  }

  try {
    const response = await dockerClient.get(`/containers/${id}/logs`, {
      params: {
        stdout: true, // 로그의 stdout을 포함
        stderr: true, // 로그의 stderr를 포함
        timestamps: true, // 로그에 타임스탬프 포함
      },
    });
    return NextResponse.json({ logs: response.data }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to get container logs' },
      { status: 500 },
    );
  }
}
