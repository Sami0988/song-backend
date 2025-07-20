// controllers/songController.js
const Song = require('../model/song');

// GET all songs with pagination
exports.getSongs = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '5');
    const skip = (page - 1) * limit;

    const total = await Song.countDocuments();
    const songs = await Song.find()
      .skip(skip)
      .limit(limit)
      .exec();

    res.json({
      data: songs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET one song by ID
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new song
exports.createSong = async (req, res) => {
  try {
    // Check if a song with the same title and artist already exists
    const existingSong = await Song.findOne({ 
      title: req.body.title, 
      artist: req.body.artist 
    });

    if (existingSong) {
      return res.status(400).json({ message: 'Song already exists' });
    }

    const newSong = new Song(req.body);
    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE a song by ID
exports.updateSong = async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedSong) return res.status(404).json({ message: 'Song not found' });
    res.json(updatedSong);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a song by ID
exports.deleteSong = async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong) return res.status(404).json({ message: 'Song not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
