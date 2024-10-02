import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { DOCKER_URL } from '../../urlPath';

export async function DELETE(req: NextRequest) {
  const { id } = await req.json(); // 삭제할 네트워크 ID

  try {
    const response = await axios.delete(`${DOCKER_URL}/networks/${id}`);
    return NextResponse.json(
      { message: 'Network deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting network:', error);
    return NextResponse.json({ status: 500 });
  }
}
