import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get(`api/v1/blueprints`, {});
    console.log(response);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: 'Failed to create container' },
      { status: 500 },
    );
  }
}
