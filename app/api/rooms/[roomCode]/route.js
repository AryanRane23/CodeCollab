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

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { roomCode } = params;
    await Room.findByIdAndDelete(roomCode);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Create a new room -> POST
export async function POST(req) {
  try {
    await connectDB();
    const { roomId, language } = await req.json(); // adminId removed

    const newRoom = new Room({
      _id: roomId,
      language
    });

    await newRoom.save();
    return new Response(JSON.stringify({ success: true, room: newRoom }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

