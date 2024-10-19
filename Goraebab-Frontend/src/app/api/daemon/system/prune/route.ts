import { createDockerClient } from '@/app/api/axiosInstance';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const dockerClient = createDockerClient();

  try {
    const response = await dockerClient.post('/system/prune?force=true');
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error executing system prune:', error);

    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to prune Docker system' },
      { status: 500 }
    );
  }
}
