import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';

export async function DELETE(req: NextRequest) {
  const { id } = await req.json(); // 삭제할 네트워크 ID
  const { searchParams } = new URL(req.url);
  const hostIp = searchParams.get('hostIp') || 'localhost';
  const dockerClient = createDockerClient(hostIp);

  try {
    const response = await dockerClient.delete(`/networks/${id}`);
    return NextResponse.json(
      { message: 'Network deleted successfully' },
      { status: 200 },
    );
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
