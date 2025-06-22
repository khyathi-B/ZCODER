const mongoose = require('mongoose');

const roomCodeSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  code: { type: String, default: '' },
  language: { type: String, default: 'cpp' },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RoomCode', roomCodeSchema);
