import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const namespace = searchParams.get('namespace');
  const repository = searchParams.get('repository');

  if (!namespace || !repository) {
    return NextResponse.json(
      { error: 'Namespace and repository parameters are required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `https://hub.docker.com/v2/repositories/${namespace}/${repository}/tags`
    );
    return NextResponse.json(response.data.results, { status: 200 });
  } catch (error) {
    console.error('Error fetching Docker Hub tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Docker Hub tags' },
      { status: 500 }
    );
  }
}
