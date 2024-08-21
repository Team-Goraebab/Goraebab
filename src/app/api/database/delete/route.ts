import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dbId = searchParams.get('dbId');

  if (!dbId) {
    return NextResponse.json({ error: 'DB ID is required' }, { status: 400 });
  }

  try {
    await axios.delete(`http://localhost:2375/db/${dbId}`);
    return NextResponse.json(
      { message: `DB ${dbId} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting DB ${dbId}:`, error);
    return NextResponse.json(
      { error: `Failed to delete DB ${dbId}` },
      { status: 500 }
    );
  }
}
