const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('./auth');
const { isAuthenticated, isAdmin } = auth;

// Get all users (admin only)
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific user
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only admins can view full user details
    // Regular users can only see basic info
    const requestingUser = await User.findById(req.session.userId);
    if (requestingUser.isAdmin || req.params.id === req.session.userId) {
      res.json(user.toJSON());
    } else {
      res.json({
        _id: user._id,
        username: user.username,
        instrument: user.instrument
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user (self or admin only)
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only allow self-update or admin update
    const requestingUser = await User.findById(req.session.userId);
    if (!requestingUser.isAdmin && req.params.id !== req.session.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Don't allow regular users to change admin status
    if (!requestingUser.isAdmin) {
      delete req.body.isAdmin;
    }

    // Update user
    Object.assign(user, req.body);
    await user.save();
    res.json(user.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user (admin only)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't allow deleting self
    if (req.params.id === req.session.userId) {
      return res.status(400).json({ error: 'Cannot delete own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 