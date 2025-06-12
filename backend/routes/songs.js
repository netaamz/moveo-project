const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const auth = require('./auth');
const { isAuthenticated, isAdmin } = auth;
const User = require('../models/User');

// Search songs
router.get('/search', isAuthenticated, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const songs = await Song.search(query);
    res.json(songs.map(s => s.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific song with content
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    const content = song.getContent();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router; 