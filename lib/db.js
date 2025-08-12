// By adding roomID in database ->
// Users can Rejoin their specific room anytime (even after reloads or app restarts)
import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    isConnected = db.connections[0].readyState;
    console.log('MongoDB connected with Mongoose');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
