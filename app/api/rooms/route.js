import { NextResponse } from 'next/server';
import { addRoom } from '../../../roomStore';

export async function POST(request) {
  const { roomId, language } = await request.json();

  if (!roomId || !language) {
    return NextResponse.json({ error: 'Missing roomId or language' }, { status: 400 });
  }

  addRoom(roomId, language);

  return NextResponse.json({ message: 'Room added' });
}
