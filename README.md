# InstAlert Backend API

This backend is built for the InstAlert application focusing on women's safety through real-time emergency tracking, alerts, and evidence sharing.

## Stack
- Node.js & Express
- MongoDB (Mongoose)
- Socket.IO (for real-time location sharing)
- Twilio (for automated SMS)
- Multer (for audio/video evidence storage)

## Setup Steps

1. Configure environment variables inside `.env` to include your MongoDB connection string and Twilio credentials.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Features Implemented
- **Authentication & Emergency Contacts**: Manage users and emergency contacts securely with JWT.
- **Emergency Trigger**: Creates an emergency instance and sends automated emergency texts (SMS) using Twilio.
- **Real-Time GPS Tracking**: WebSockets using `Socket.IO` to continuously emit GPS coordinates securely to the emergency room.
- **Evidence Handling**: API to upload Audio/Video files and store them alongside the active emergency report.
