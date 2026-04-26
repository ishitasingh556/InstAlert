require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const emergencySocket = require('./sockets/emergencySocket');

const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve evidence files statically

// Connect Database
connectDB();

// Setup Socket.IO for real-time tracking
emergencySocket(io);

// Serve static files from the React app
const distPath = path.join(__dirname, 'frontend/dist');
console.log('Serving static files from:', distPath);
app.use(express.static(distPath));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/evidence', uploadRoutes);

// Debug route to see file structure on Render
app.get('/debug-files', (req, res) => {
  const fs = require('fs');
  try {
    const files = {
      root: fs.readdirSync(__dirname),
      frontend: fs.existsSync(path.join(__dirname, 'frontend')) ? fs.readdirSync(path.join(__dirname, 'frontend')) : 'not found',
      dist: fs.existsSync(path.join(__dirname, 'frontend/dist')) ? fs.readdirSync(path.join(__dirname, 'frontend/dist')) : 'not found'
    };
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('ERROR: index.html not found at', indexPath);
    res.status(404).send('Frontend build not found. Please check Render build logs.');
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
