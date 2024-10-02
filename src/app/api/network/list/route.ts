import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { DOCKER_URL } from '../../urlPath';

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get(`${DOCKER_URL}/networks`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching networks:', error);
    return NextResponse.json({ status: 500 });
  }
}
