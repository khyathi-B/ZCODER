import { useEffect, useState } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import getUser from '../utils/getUser';
import {useParams} from 'react-router-dom';
export default function SolutionEditor() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState('');
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('javascript');
  const [visibility, setVisibility] = useState('private')
const [input, setInput] = useState('');
const {problemId}=useParams();
const user = getUser();
const userId=user.id
useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/problems/all`)
      .then(res => {setProblems(res.data);
        if(problemId){
         setSelectedProblem(problemId);
       }
       });
      
  }, [problemId]);



  
  const submitSolution = () => {
    
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/problems/submit-solution`, {
      userId,
      problemId: selectedProblem,
      code,
      language,
      visibility,
    }).then(() => alert('Solution saved!'));
  };
    const getLanguageExtension = () => {
    switch (language) {
      case 'javascript': return javascript();
      case 'python': return python();
      case 'cpp': return cpp();
      case 'java': return java();
      default: return cpp();
    }
  };
  const runCode = async () => {
  const languageMap = {
    javascript: 63,
    python: 71,
    cpp: 54,
    java: 62
  };
  const language_id = languageMap[language];

  try {
    const res = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*',
      {
        source_code: code,
        language_id,
        stdin: input  // ✅ Send the input here
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': 'bfc914bbf2msh476d300d927a912p13b0a4jsnc023e1aa9a8f'
        }
      }
    );

    const token = res.data.token;

    setTimeout(async () => {
      const result = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`,
        {
          headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': 'bfc914bbf2msh476d300d927a912p13b0a4jsnc023e1aa9a8f'
          }
        }
      );

      const output =
        result.data.stdout ||
        result.data.stderr ||
        result.data.compile_output ||
        'No output';
      alert('Output:\n' + output);
    }, 2000);
  } catch (err) {
    console.error('Judge0 error:', err.response?.data || err.message);
    alert('Error running code');
  }
};
const runAgainstTestCases = async () => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/problems/validate`, {
      code,
      language,
      problemId: selectedProblem
    });

    const results = res.data;
    console.log('Test Results:', results);
    alert(results.map((r, i) => `Test Case ${i+1}: ${r.passed ? '✅ Passed' : '❌ Failed'}`).join('\n'));
  } catch (err) {
    console.error('Validation error:', err.message);
    alert('Failed to validate test cases');
  }
};

  return (
    <div style={{ padding: '20px' }}>
      <h2>Submit Solution</h2>

      <label>Select Problem:</label>
      <select onChange={(e) => setSelectedProblem(e.target.value)} value={selectedProblem}>
        <option value="">-- Choose --</option>
        {problems.map(p => (
          <option key={p._id} value={p._id}>{p.title}</option>
        ))}
      </select>
      <br /><br />

      <label>Select Language:</label>
      <select onChange={(e) => setLanguage(e.target.value)} value={language}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <br /><br />
      <label>Visibility:</label>
       <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
         <option value="private">Private</option>
         <option value="peers">Peers</option>
         <option value="public">Public</option>
       </select> 


      <CodeMirror
        value={code}
        height="300px"
        extensions={[getLanguageExtension()]}
        onChange={(value) => setCode(value)}
      />
       <h4>Input:</h4>
       <textarea
        rows={5}
        cols={50}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input (if any)..."
      />


      <br />
      <button onClick={runAgainstTestCases}>Run Against Test Cases</button>

      <button onClick={runCode}>Run Code</button>

      <button onClick={submitSolution}>Submit</button>
    </div>
  );
}

  