import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const dbDetails = await req.json();

  try {
    const response = await axios.post('http://localhost:2375/db', dbDetails);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error registering DB:', error);
    return NextResponse.json(
      { error: 'Failed to register DB' },
      { status: 500 }
    );
  }
}
