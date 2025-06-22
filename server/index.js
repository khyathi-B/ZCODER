const http = require('http');
const { Server } = require('socket.io');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT=5000;
app.use(cors({
  origin: ["http://192.168.29.186:3000","http://localhost:3000"], // or your frontend IP
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PATCH"]
}));
app.use(express.json());
const usersInRoom = {};
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://192.168.29.186:3000", "http://localhost:3000"], methods: ["GET", "POST"] }
})
const RoomCode = require('./models/RoomCode');


io.on('connection', socket => {
  console.log('A user connected: ' + socket.id);

  socket.on('join-room', async (roomId, username) => {
    socket.join(roomId);
     if (!usersInRoom[roomId]) usersInRoom[roomId] = [];
    usersInRoom[roomId].push({ socketId: socket.id, username });
    io.to(roomId).emit('room-users', usersInRoom[roomId]);
    const saved = await RoomCode.findOne({ roomId });
    if (saved) {
    socket.emit('code-update', saved.code);
  }
    console.log(`User ${socket.id} joined room ${roomId}`);
    
  });

   socket.on('disconnect', () => {
    for (const roomId in usersInRoom) {
      usersInRoom[roomId] = usersInRoom[roomId].filter(u => u.socketId !== socket.id);
      io.to(roomId).emit('room-users', usersInRoom[roomId]);
    }
    console.log('User disconnected:', socket.id);
  });


  socket.on('code-change', async ({ roomId, code }) => {
    await RoomCode.findOneAndUpdate(
    { roomId },
    { code, lastUpdated: new Date() },
    { upsert: true }
  );
    socket.to(roomId).emit('code-update', code);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);



// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/problems', require('./routes/problem'));
app.use('/api/execute', require('./routes/execute'));
 const peersRouter = require('./routes/peers');


 app.use('/api/peers', peersRouter);


mongoose.connect(process.env.MONGO_URL)
  .then(() => {
     server.listen(5000, () => console.log("Server with WebSocket running on port 5000"));
    //app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
  .catch(err => console.error(err));
 
