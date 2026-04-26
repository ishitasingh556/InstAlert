const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const alertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  initialLocation: locationSchema,
  locationHistory: [locationSchema],
  audioUrls: [{ type: String }],
  videoUrls: [{ type: String }],
  triggeredAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;
