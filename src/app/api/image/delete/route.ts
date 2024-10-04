import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { DOCKER_URL } from '../../urlPath';

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  try {
    const response = await axios.delete(`${DOCKER_URL}/images/${id}`, {
      params: {
        force: true, // 강제 삭제 플래그, 필요에 따라 사용할 수 있음
      },
    });
    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ status: 500, message: error });
  }
}
