const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { code, language, input } = req.body;
  const languageIds = {
    cpp: 54,
    python: 71,
    java: 62,
    javascript: 63
  };
  const langId = languageIds[language];
  if (!langId || !code?.trim()) {
    return res.status(400).json({ output: 'Invalid code or language' });
  }

  
  try {
     const { data: submission } = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      {
        source_code: code,
        language_id: langId,
        stdin: input || "",
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': 'bfc914bbf2msh476d300d927a912p13b0a4jsnc023e1aa9a8f', 
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );
  

res.json({ output: submission.stdout || submission.stderr || submission.compile_output || 'No output' });
  } catch (err) {
    console.error('Execution error:', err.response?.data || err.message);
    res.status(500).json({ output: 'Error executing code' });
  }
});

module.exports = router;
