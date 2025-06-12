const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user && user.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: 'Not authorized' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, instrument, isAdmin } = req.body;
    
    const user = await User.createUser({
      username,
      password,
      instrument,
      isAdmin: isAdmin || false
    });

    // Start session
    req.session.userId = user._id;
    
    res.status(201).json(user.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user || !user.validatePassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Start session
    req.session.userId = user._id;
    
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available instruments
router.get('/instruments', (req, res) => {
  res.json(User.getInstruments());
});

// Export the router directly
module.exports = router;

// Export middleware functions separately
module.exports.isAuthenticated = isAuthenticated;
module.exports.isAdmin = isAdmin; 