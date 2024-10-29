import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  const force = searchParams.get('force') === 'true';
  const noprune = searchParams.get('noprune') === 'true';
  const hostIp = searchParams.get('hostIp') || 'localhost';
  const dockerClient = createDockerClient(hostIp);

  if (!id) {
    return NextResponse.json(
      { error: 'Image ID is required' },
      { status: 400 },
    );
  }

  try {
    const response = await dockerClient.delete(`/images/${id}`, {
      params: { force, noprune },
    });
    return NextResponse.json(
      { message: 'Image deleted successfully', data: response.data },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: (error as any).response.status || 500 },
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 },
    );
  }
}
