const express = require('express');
const demoSongs = require('../data/song'); // assumed to be an array of song objects
const router = express.Router();

let songs = [...demoSongs];
let idCounter = songs.length > 0 ? Math.max(...songs.map(s => s.id)) + 1 : 1;

// GET all with pagination
router.get('/', (req, res) => {
  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '5');
  const start = (page - 1) * limit;
  const paginated = songs.slice(start, start + limit);

  res.json({
    data: paginated,
    total: songs.length,
    page,
    totalPages: Math.ceil(songs.length / limit),
  });
});

// GET one song by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const song = songs.find(s => s.id === id);

  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }

  res.json(song);
});

// CREATE a new song
router.post('/', (req, res) => {
  const newSong = {
    id: idCounter++,
    ...req.body,
  };

  songs.push(newSong);
  res.status(201).json(newSong);
});

// UPDATE a song by ID
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = songs.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Song not found' });
  }

  songs[index] = { id, ...req.body };
  res.json(songs[index]);
});

// DELETE a song by ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = songs.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Song not found' });
  }

  songs.splice(index, 1);
  res.status(204).end(); // No content
});

module.exports = router;
