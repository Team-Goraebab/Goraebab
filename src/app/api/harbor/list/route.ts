import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get('http://localhost:2375/harbor');
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching Harbor list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Harbor list' },
      { status: 500 }
    );
  }
}
