// By adding roomID in database ->
// Users can Rejoin their specific room anytime (even after reloads or app restarts)
import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    if (!MONGODB_URI) throw new Error('MONGODB_URI env var is not set');
    const db = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // fail fast for DNS/SRV lookup issues during development
      serverSelectionTimeoutMS: 5000,
    });
    
    isConnected = db.connections[0].readyState;
    console.log('MongoDB connected with Mongoose');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;  
  }
}
