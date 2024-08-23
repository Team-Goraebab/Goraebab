import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Username parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `https://hub.docker.com/v2/users/${username}`
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching Docker Hub user information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Docker Hub user information' },
      { status: 500 }
    );
  }
}
