// Host creating a room -> POST
import { connectDB } from '../../../lib/db';
import Room from '../../models/Room';

export async function POST(req) {
  try {
    await connectDB();
    const { roomId, language } = await req.json(); // adminId removed

    // Check if room already exists
    const existingRoom = await Room.findById(roomId);
    if (existingRoom) {
      return new Response(JSON.stringify({ error: 'Room already exists' }), { status: 400 });
    }

    // Create new room WITHOUT adminId
    const newRoom = await Room.create({ _id: roomId, language });

    return new Response(JSON.stringify(newRoom), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


