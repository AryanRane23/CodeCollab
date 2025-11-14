// server.js
console.log("✅ server.js is running...");
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // const server = createServer(handle);
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    path: '/api/socket',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // in-memory room map used by other features (code editor etc.)
  const rooms = new Map();

  // ---- Socket.IO connection & WebRTC signaling ----
  io.on('connection', (socket) => {
    console.log('🔌 socket connected', socket.id);

    // --- existing features ---
    socket.on('join-room', ({ roomId, userId }) => {
      if (!roomId) return;
      console.log('👥 joined', roomId, socket.id);
      socket.join(roomId);

      // reply with last-known editor state if present (backwards compat)
      const room = rooms.get(roomId) || {};
      socket.emit('code-change', { code: room.code || '' });
      socket.emit('run-output', { output: room.output || '' });

      // Send list of existing socket ids in room (except self)
      const existing = [...(io.sockets.adapter.rooms.get(roomId) || [])].filter(id => id !== socket.id);
      socket.emit('existing-users', existing.map(id => ({ socketId: id })));

      // Notify others someone joined
      socket.to(roomId).emit('user-joined', { socketId: socket.id, userId });
    });

    socket.on('code-change', ({ roomId, code }) => {
      if (!rooms.has(roomId)) rooms.set(roomId, {});
      rooms.get(roomId).code = code;
      socket.to(roomId).emit('code-change', { code });
    });

    socket.on('run-output', ({ roomId, output }) => {
      if (!rooms.has(roomId)) rooms.set(roomId, {});
      rooms.get(roomId).output = output;
      io.to(roomId).emit('run-output', { output });
    });

    // --- chat ---
    socket.on('message', (messageData) => {
      if (messageData.roomId) io.to(messageData.roomId).emit('message', messageData);
    });

    // --- WebRTC signaling relays ---
    socket.on('offer', ({ to, sdp }) => {
      if (!to) return;
      io.to(to).emit('offer', { from: socket.id, sdp });
    });

    socket.on('answer', ({ to, sdp }) => {
      if (!to) return;
      io.to(to).emit('answer', { from: socket.id, sdp });
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
      if (!to) return;
      io.to(to).emit('ice-candidate', { from: socket.id, candidate });
    });

    // relay user video ON/OFF state so all clients can show placeholder when someone disables video
    socket.on('video-toggle', ({ roomId, socketId, videoOn }) => {
      if (!roomId) return;
      // broadcast to entire room (including origin) so all clients stay consistent
      io.to(roomId).emit('video-toggle', { socketId, videoOn });
    });

    socket.on('leave-room', ({ roomId }) => {
      if (roomId) {
        socket.leave(roomId);
        socket.to(roomId).emit('user-left', { socketId: socket.id });
        console.log(`⬅️  ${socket.id} left room ${roomId}`);
      }
    });

    socket.on('disconnecting', () => {
      for (const room of socket.rooms) {
        if (room !== socket.id) socket.to(room).emit('user-left', { socketId: socket.id });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`❌ User disconnected: ${socket.id} (${reason})`);
    });
  });

  // server.listen(3000, () => {
  //   console.log('✅ Server ready on http://localhost:3000');
  // });
  const PORT = parseInt(process.env.PORT, 10) || 3000;
  server.listen(PORT, () => {
    console.log(`✅ Server ready on port: ${PORT}`);
  });

});
