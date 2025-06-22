const express = require('express');
const router = express.Router();
const User = require('../models/users');
const axios = require('axios');
// Send a peer request
router.post('/send-request', async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (senderId === receiverId) return res.status(400).json({ message: "Cannot connect to yourself" });

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) return res.status(404).json({ message: 'User not found' });

    if (receiver.peerRequests.includes(senderId) || receiver.connections.includes(senderId)) {
      return res.status(400).json({ message: 'Request already sent or already connected' });
    }

    receiver.peerRequests.push(senderId);
    await receiver.save();

    res.json({ message: 'Request sent' });
  } catch (err) {
    console.error('Send request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//  Accept a peer request
router.post('/accept-request', async (req, res) => {
  const { receiverId, senderId } = req.body;

  try {
    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) return res.status(404).json({ message: 'User not found' });

    receiver.peerRequests = receiver.peerRequests.filter(id => id.toString() !== senderId);
    receiver.connections.push(senderId);

    sender.connections.push(receiverId);

    await receiver.save();
    await sender.save();

    res.json({ message: 'Request accepted' });
  } catch (err) {
    console.error('Accept request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/reject-request', async (req, res) => {
  const { receiverId, senderId } = req.body;

  try {
    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

    receiver.peerRequests = receiver.peerRequests.filter(id => id.toString() !== senderId);
    await receiver.save();

    res.json({ message: 'Request rejected' });
  } catch (err) {
    console.error('Reject request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get incoming requests
router.get('/requests/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('peerRequests', 'username');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.peerRequests);
  } catch (err) {
    console.error('Fetch requests error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//  Get accepted connections
router.get('/connections/:userId', async (req, res) => {
  if (!req.params.userId) return res.status(400).json({ message: "Missing user ID" });
  try {
    const user = await User.findById(req.params.userId).populate('connections', 'username');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.connections);
  } catch (err) {
    console.error('Fetch connections error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//  Get all users
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    res.json(users);
  } catch (err) {
    console.error('Fetch all users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
