import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../../axiosInstance';

export async function GET(req: NextRequest) {
  const dockerClient = createDockerClient();

  try {
    const response = await dockerClient.get('/system/df');
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching Docker system df:', error);

    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get Docker system df' },
      { status: 500 }
    );
  }
}
