const express = require('express');
const demoSongs = require('../data/song');
const router = express.Router();


let songs = [...demoSongs]; 
let idCounter = songs.length + 1;

// GET 
router.get('/', (req, res) => {
  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '5');
  const start = (page - 1) * limit;
  const paginated = songs.slice(start, start + limit);
  res.json({
    data: paginated,
    total: songs.length,
    page,
    totalPages: Math.ceil(songs.length / limit)
  });
});

// create
router.post('/', (req, res) => {
  const newSong = { id: idCounter++, ...req.body };
  songs.push(newSong);
  res.status(201).json(newSong);
});

//update
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = songs.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ message: 'Song not found' });
  songs[index] = { id, ...req.body };
  res.json(songs[index]);
});

//delete
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  songs = songs.filter(s => s.id !== id);
  res.status(204).end();
});

module.exports = router;
