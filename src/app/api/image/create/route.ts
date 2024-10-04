import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { DOCKER_URL } from '../../urlPath';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();

  try {
    const response = await axios.post(`${DOCKER_URL}/images/create`, null, {
      params: {
        fromImage: bodyData.fromImage,
        tag: bodyData.tag || 'latest',
      },
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error creating image:', error);
    return NextResponse.json({ status: 500, message: error });
  }
}
