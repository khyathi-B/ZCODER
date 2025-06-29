import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import getUser from '../utils/getUser';
const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);

export default function LiveRoom() {
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [code, setCode] = useState('');
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [users, setUsers] = useState([]);
  const user = getUser();
  const username = user?.username || 'Anonymous';
  const [output, setOutput] = useState('');
  const [customInput, setCustomInput] = useState('');


  const handleJoin = async () => {
    if (!roomId.trim()) return;
    socket.emit('join-room', roomId, username);
    setJoined(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/problems/${roomId}`);
      setProblem(res.data);
    } catch (err) {
      console.error('Failed to fetch problem:', err);
      alert("Failed to load problem. Check the ID.");
    }

  };

  useEffect(() => {
    socket.on('room-users', userList => {
    setUsers(userList);
  });
    socket.on('code-update', newCode => {
      setCode(newCode);
    });
    socket.on('code-output', ({ output }) => {
    setOutput(output);
  });


    return () => {socket.off('room-users');socket.off('code-update');socket.off('code-output');};
  }, []);

  const handleChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    socket.emit('code-change', { roomId, code: newCode });
  };

   const runCode = async () => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/execute`, {
      code,
      language,
      input: customInput,
    });
    setOutput(res.data.output);
    // Optionally emit output to others in room
    socket.emit('code-output', { roomId, output: res.data.output });
  } catch (err) {
    console.error('Run error:', err);
    setOutput('Execution failed. Please check your code or language.');
  }
};


  const handleSubmit = async () => {
    if (!user) return alert('Please log in to submit');
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/problems/submit-solution`, {
        userId: user.id,
        problemId: roomId,
        code,
        language,
      });
      alert('Solution submitted!');
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit solution');
    }
  };
  const getLanguageExtension = () => {
    switch (language) {
      case 'cpp': return cpp();
      case 'python': return python();
      case 'javascript': return javascript();
      case 'java': return java();
      default: return javascript();
    }
  };

  const runAgainstTestCases = async () => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/problems/validate`, {
      code,
      language,
      problemId: roomId,
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
    <div style={{ padding: 20 }}>
      {!joined ? (
        <>
          <input value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="Enter Problem ID(Room ID)" />
          <button onClick={handleJoin}>Join Room</button>
        </>
      ) : (
        <>
          <h2>Room: {roomId}</h2>
          {problem ? (
            <div style={{ marginBottom: 20 }}>
              <h3>{problem.title}</h3>
              <p>{problem.description}</p>
              <p><strong>Tags:</strong> {problem.tags.join(', ')}</p>
            </div>
          ) : (
            <p style={{ color: 'gray' }}>Loading problem...</p>
          )}
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <label>Select Language: </label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
            </select>
          </div>
          <CodeMirror
  value={code}
  height="400px"
  extensions={
    language === 'cpp' ? [cpp()] :
    language === 'python' ? [python()] :
    language === 'java' ? [java()] :
    [javascript()]
  }
  onChange={(value) => {
    setCode(value);
    socket.emit('code-change', { roomId, code: value });
  }}
/>

          <br /><br />
          <div style={{ marginTop: 10 }}>
  <label>Custom Input (stdin):</label><br />
  <textarea
    rows="5"
    cols="80"
    value={customInput}
    onChange={(e) => setCustomInput(e.target.value)}
    placeholder="Enter input for your program here"
    style={{ marginBottom: 10 }}
  />
</div>
        <br /><br />

          <button onClick={runCode} >Run</button>
          <button onClick={handleSubmit}>Submit Solution</button>
          <button onClick={runAgainstTestCases}>Run Against Test Cases</button>

          <div style={{ marginTop: 20 }}>
            <h3>Output</h3>
            <pre style={{ background: '#f9f9f9', padding: 10 }}>{output}</pre>
          </div>
          <div>
  <h3>Online Users</h3>
  <ul>
    {users.map(u => <li key={u.socketId}>{u.username}</li>)}
  </ul>
</div>

        </>
      )}
    </div>
  );
}
