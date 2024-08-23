import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const response = await axios.post('http://localhost:2375/db/copy');
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error copying DB design to local:', error);
    return NextResponse.json(
      { error: 'Failed to copy DB design to local' },
      { status: 500 }
    );
  }
}
