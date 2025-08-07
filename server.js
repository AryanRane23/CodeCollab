// server.js
console.log("✅ server.js is running...");

import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(handle);

  const io = new Server(server, {
    path: '/api/socket',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const rooms = new Map();

  io.on('connection', (socket) => {
    console.log('🔌 socket connected', socket.id);

    socket.on('join-room', ({ roomId }) => {
      console.log('👥 joined', roomId);
      socket.join(roomId);

      const room = rooms.get(roomId) || {};
      socket.emit('code-change', { code: room.code || '' });
      socket.emit('run-output', { output: room.output || '' }); // ✅ send last known output
    });

    socket.on('code-change', ({ roomId, code }) => {
      if (!rooms.has(roomId)) rooms.set(roomId, {});
      rooms.get(roomId).code = code;

      socket.to(roomId).emit('code-change', { code });
    });

    socket.on('run-output', ({ roomId, output }) => {
      if (!rooms.has(roomId)) rooms.set(roomId, {});
      rooms.get(roomId).output = output;

      io.to(roomId).emit('run-output', { output }); // ✅ broadcast to everyone
    });
  });

  server.listen(3000, () => {
    console.log('✅ Server ready on http://localhost:3000');
  });
});
