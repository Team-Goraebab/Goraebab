import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { DOCKER_URL } from '../../urlPath';

export async function DELETE(req: NextRequest) {
  const { name } = await req.json();

  try {
    const response = await axios.delete(`${DOCKER_URL}/volumes/${name}`);
    return NextResponse.json(
      { message: 'Volume deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting volume:', error);
    return NextResponse.json({ status: 500 });
  }
}
