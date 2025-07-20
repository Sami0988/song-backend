const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  audioUrl: { type: String, required: true },
}, { _id: false }); // prevent _id for each track if not needed

const songSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['single', 'album'],
    required: true,
    default: 'single',
  },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String }, // optional for singles
  year: { type: Number },

  // For both single and album
  imageUrl: { type: String },

  // For single songs
  audioUrl: {
    type: String,
    required: function () {
      return this.type === 'single';
    },
  },

  // For albums
  tracks: {
    type: [trackSchema],
    required: function () {
      return this.type === 'album';
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
