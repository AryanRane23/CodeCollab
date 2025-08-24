// Users joining a room -> GET
import { connectDB } from '../../../../lib/db';
import Room from '../../../models/Room';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { roomCode } = params;

    const room = await Room.findById(roomCode);
    if (!room) {
      return new Response(JSON.stringify({ error: 'Invalid room ID' }), { status: 404 });
    }
    return new Response(JSON.stringify(room), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } 
}

