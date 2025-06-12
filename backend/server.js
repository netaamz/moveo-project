// Load environment variables
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');
const userRoutes = require('./routes/users');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:443", "http://localhost:5173","https://exciting-spontaneity-production-a707.up.railway.app"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ["http://localhost:443", "http://localhost:5173","https://exciting-spontaneity-production-a707.up.railway.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'jamoveo-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Store socket connections
global.connections = new Map();
global.io = io; // Make io globally accessible

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user joining the main page (waiting for song selection)
  socket.on('join-main', (data) => {
    const { userId } = data;
    socket.join('main-lobby'); // All users waiting for song selection
    connections.set(socket.id, { room: 'main-lobby', userId });
    console.log(`📊 Total connections: ${connections.size}`);
  });



  // Handle admin selecting a song (broadcast to all users)
  socket.on('song-selected', (data) => {
    const { rehearsalId, songId, songTitle, songArtist } = data;
    
    // Broadcast to all connected users (both in main lobby and in rehearsals)
    io.emit('song-selected', { rehearsalId, songId, songTitle, songArtist });
  });

  // Handle rehearsal ending (broadcast to all users)
  socket.on('rehearsal-ended', (data) => {
    const { rehearsalId } = data;
    
    console.log('Rehearsal ended by admin, broadcasting to all users');
    
    // Broadcast to all connected users (both in main lobby and in rehearsals)
    io.emit('rehearsal-ended', { rehearsalId });
  });

  socket.on('disconnect', () => {
    const connectionData = connections.get(socket.id);
    if (connectionData) {
      const { rehearsalId, userId, room } = connectionData;
      
      // If user was in a rehearsal, notify others
      if (rehearsalId && rehearsalId !== 'main-lobby') {
        socket.to(rehearsalId).emit('user-left', { userId });
      }
      
      connections.delete(socket.id);
    }
  });
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/users', userRoutes);

// Serve main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`JaMoveo server running on port ${PORT}`);
});

module.exports = app; 