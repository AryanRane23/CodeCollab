import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // roomId
  language: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);