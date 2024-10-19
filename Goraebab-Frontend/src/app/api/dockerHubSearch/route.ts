import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { HUB_URL } from '../urlPath';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(`${HUB_URL}/search/repositories`, {
      params: { query },
    });
    return NextResponse.json(response.data.results, { status: 200 });
  } catch (error) {
    console.error('Error fetching Docker Hub images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Docker Hub images' },
      { status: 500 }
    );
  }
}
