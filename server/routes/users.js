const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Solution = require('../models/Solution');


router.delete('/delete/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Delete user's solutions
    await Solution.deleteMany({ user: userId });

    await User.updateMany(
      {},
      {
        $pull: {
          connections: userId,
          peerRequests: userId,
        },
      }
    );

    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account and associated data deleted successfully.' });
  } catch (err) {
    console.error('Account deletion error:', err);
    res.status(500).json({ message: 'Server error during deletion.' });
  }
});

router.post('/get-solutions', async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId).populate('solutions.problemId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.solutions);
  } catch (err) {
    console.error('Error fetching solutions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/:userId/solutions', async (req, res) => {
  const solutions = await Solution.find({ user: req.params.userId }).populate('problem');
  res.json(solutions.map(s => ({
     problemId: {
      _id: s.problem._id,
      title: s.problem.title
    },
    code: s.code,
    language: s.language,
    createdAt: s.createdAt 
  })));
});

router.get('/:id/bookmarks', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('bookmarks');
    res.json(user.bookmarks);
  } catch (err) {
    console.error('Bookmark fetch error:', err);
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
});

router.get('/:viewerId/solutions/:ownerId', async (req, res) => {
  const { viewerId, ownerId } = req.params;

  try {
    const viewer = await User.findById(viewerId);
    const owner = await User.findById(ownerId);
    if (!viewer || !owner) return res.status(404).json({ message: 'User not found' });

    let query = { user: ownerId };

    if (viewerId === ownerId) {
      // owner viewing their own solutions
      query = { user: ownerId };
    } else if (owner.connections.includes(viewerId)) {
      query = { user: ownerId, visibility: { $in: ['peers', 'public'] } };
    } else {
      query = { user: ownerId, visibility: 'public' };
    }

    const solutions = await Solution.find(query).populate('problem');
    res.json(solutions.map(s => ({
      _id: s._id,
      problemId: {
        _id: s.problem?._id,
        title: s.problem?.title
      },
      code: s.code,
      language: s.language,
      createdAt: s.createdAt,
      visibility: s.visibility
    })));
  } catch (err) {
    console.error('Error fetching shared solutions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


 module.exports = router;
