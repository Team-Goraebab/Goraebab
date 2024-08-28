import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get('http://localhost:2387/remote/daemons');
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error connecting to Daemon:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Daemon' },
      { status: 500 }
    );
  }
}