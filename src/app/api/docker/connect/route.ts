import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const response = await axios.post('http://localhost:2375/docker/connect');
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error connecting to Docker:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Docker' },
      { status: 500 }
    );
  }
}
