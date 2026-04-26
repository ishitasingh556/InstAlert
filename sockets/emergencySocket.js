const Alert = require('../models/Alert');
const User = require('../models/User');

const emergencySocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join room for a specific alert or user
    socket.on('joinAlertTracker', (alertId) => {
      socket.join(alertId);
      console.log(`User/Contact joined tracking for alert: ${alertId}`);
    });

    // Update location continually
    socket.on('updateLocation', async (data) => {
      const { alertId, latitude, longitude } = data;
      
      try {
        const alert = await Alert.findById(alertId);
        
        if (alert && alert.status === 'active') {
          // Push new location to history
          alert.locationHistory.push({ latitude, longitude });
          await alert.save();
          
          // Broadcast to everyone in the room (emergency contacts)
          io.to(alertId).emit('locationUpdated', {
            alertId,
            latitude,
            longitude,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Error updating location via socket', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = emergencySocket;
