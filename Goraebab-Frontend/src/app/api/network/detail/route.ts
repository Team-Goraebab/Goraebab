import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const hostIp = searchParams.get('hostIp') || 'localhost';
  const dockerClient = createDockerClient(hostIp);

  if (!id) {
    return NextResponse.json({ error: 'Missing network id' }, { status: 400 });
  }

  try {
    const response = await dockerClient.get(
      `/networks/${encodeURIComponent(id)}`,
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message || 'Unknown error' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to get network detail' },
      { status: 500 },
    );
  }
}
