import { NextResponse } from 'next/server';
import { getRoom } from '../../../../roomStore.js';

export async function GET(request, context) {
  // Await params specifically:
  const params = await context.params;
  const { roomCode } = params;

  const room = getRoom(roomCode);

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  return NextResponse.json({ language: room.language });
}
