import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // roomId
  language: { type: String, required: true },
  adminId: { type: String, required: true }, // Add this
}, { timestamps: true });

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);