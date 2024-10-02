import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { DOCKER_URL } from '../../urlPath';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();

  try {
    const response = await axios.post(`${DOCKER_URL}/volumes/create`, bodyData);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching volumes:');
    return NextResponse.json({ status: 500 });
  }
}
