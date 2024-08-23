import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dockerId = searchParams.get('dockerId');

  if (!dockerId) {
    return NextResponse.json(
      { error: 'Docker ID is required' },
      { status: 400 }
    );
  }

  try {
    await axios.delete(`http://localhost:2375/docker/${dockerId}`);
    return NextResponse.json(
      { message: `Docker ${dockerId} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting Docker ${dockerId}:`, error);
    return NextResponse.json(
      { error: `Failed to delete Docker ${dockerId}` },
      { status: 500 }
    );
  }
}
