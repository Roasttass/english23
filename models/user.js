// filepath: club-member-backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  points: { type: Number, default: 0 },
  ranking: { type: String, default: 'Bronze' },
  profilePicture: { type: String, default: 'default-profile.png' },
  bio: { type: String, default: '' },
});

module.exports = mongoose.model('User', UserSchema);