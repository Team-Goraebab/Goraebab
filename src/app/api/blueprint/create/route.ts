import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();

  try {
    const response = await axios.post(`api/v1/blueprints`, {});

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error posting blueprint:', error);

    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create container' },
      { status: 500 }
    );
  }
}
