const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const User = require('../models/users');
const Solution = require('../models/Solution');
const axios = require('axios');
// Add a new problem
router.post('/create', async (req, res) => {
  
  const { title, description, tags, userId, testCases } = req.body;
  const problem = new Problem({
    title,
    description,
    tags,
    createdBy: userId,
    testCases: testCases || []
  });

  await problem.save();
  res.json(problem);
});

// Bookmark a problem
router.post('/bookmark', async (req, res) => {
  const { userId, problemId } = req.body;
  const user = await User.findById(userId);
  if (!user.bookmarks.includes(problemId)) {
    user.bookmarks.push(problemId);
    await user.save();
  }
  res.json({ message: 'Bookmarked' });
});


router.post('/submit-solution', async (req, res) => {
  const { userId, problemId, code, language, visibility = 'private' } = req.body;
  try {
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    
const solution = new Solution({ 
  user: userId, problem: problemId, code, language, visibility ,});
await solution.save();

    res.json({ message: 'Solution saved successfully' });
  } catch (err) {
    console.error('Solution save error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.patch('/solution/:solutionId/visibility', async (req, res) => {
  const { visibility } = req.body;
  const valid = ['private', 'peers', 'public'];
  if (!valid.includes(visibility)) return res.status(400).json({ message: 'Invalid visibility' });

  try {
    const updated = await Solution.findByIdAndUpdate(req.params.solutionId, { visibility }, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Visibility update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/add-comment', async (req, res) => {
  try {
    const { problemId, userId, text } = req.body;
    console.log("Comment body:", req.body);


    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    problem.comments.push({ user: userId, text });
    await problem.save();

    res.json({ message: 'Comment added' });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/validate', async (req, res) => {
  const { code, language, problemId } = req.body;

  const languageIds = {
    cpp: 54,
    python: 71,
    java: 62,
    javascript: 63
  };
  const langId = languageIds[language];
  if (!langId) return res.status(400).json({ error: 'Unsupported language' });

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const testResults = [];

    for (const testCase of problem.testCases) {
      const { input, expectedOutput } = testCase;

      const response = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
        {
          source_code: code,
          language_id: langId,
          stdin: input
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': 'bfc914bbf2msh476d300d927a912p13b0a4jsnc023e1aa9a8f',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          }
        }
      );

      const output = response.data.stdout?.trim() || '';
      testResults.push({
        input,
        expectedOutput,
        output,
        passed: output === expectedOutput.trim()
      });
    }

    res.json(testResults);

  } catch (err) {
    console.error('Validation error:', err.message);
    res.status(500).json({ error: 'Server error during validation' });
  }
});


router.get('/all', async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
});


router.get('/comments/:problemId', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.problemId)
      .populate('comments.user', 'username');

    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    res.json(problem.comments);
  } catch (err) {
    console.error('Fetch comments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a specific problem by ID
router.get('/:problemId', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    console.error('Problem fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;