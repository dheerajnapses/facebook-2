const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ['image', 'video'] },
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
