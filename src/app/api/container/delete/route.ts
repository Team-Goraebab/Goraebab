import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { DOCKER_URL } from '../../urlPath';

export async function DELETE(req: NextRequest) {
  const { id } = await req.json(); // 삭제할 컨테이너 ID

  try {
    const response = await axios.delete(
      `${DOCKER_URL}/containers/${id}?force=true`
    );
    return NextResponse.json(
      { message: 'Container deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting container:', error);
    return NextResponse.json({ status: 500 });
  }
}
