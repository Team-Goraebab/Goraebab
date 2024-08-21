import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const harborDetails = await req.json();

  try {
    const response = await axios.post(
      'http://localhost:2375/harbor',
      harborDetails
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error registering Harbor:', error);
    return NextResponse.json(
      { error: 'Failed to register Harbor' },
      { status: 500 }
    );
  }
}
