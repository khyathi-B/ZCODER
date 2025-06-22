import { useState } from 'react';
import axios from 'axios';
import getUser from '../utils/getUser';

export default function CreateProblem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = getUser();

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const removeTestCase = (index) => {
    const updated = [...testCases];
    updated.splice(index, 1);
    setTestCases(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !tags) {
      setError('All fields are required.');
      return;
    }

    try {
      const res = await axios.post('http://192.168.29.186:5000/api/problems/create', {
        title,
        description,
        tags: tags.split(',').map(t => t.trim()),
        userId: user?.id,
        testCases
      });
      setSuccess('Problem created successfully!');
      setTitle('');
      setDescription('');
      setTags('');
      setTestCases([{ input: '', expectedOutput: '' }]);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to create problem.');
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Create New Problem</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>Title:</label><br />
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /><br /><br />

        <label>Description:</label><br />
        <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} /><br /><br />

        <label>Tags (comma-separated):</label><br />
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} /><br /><br />

        <h4>Test Cases:</h4>
        {testCases.map((tc, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <textarea
              rows={2}
              placeholder="Input"
              value={tc.input}
              onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
            /><br />
            <textarea
              rows={2}
              placeholder="Expected Output"
              value={tc.expectedOutput}
              onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
            /><br />
            {testCases.length > 1 && <button type="button" onClick={() => removeTestCase(idx)}>Remove</button>}
            <hr />
          </div>
        ))}
        <button type="button" onClick={addTestCase}>+ Add Test Case</button><br /><br />

        <button type="submit">Upload Problem</button>
      </form>
    </div>
  );
}
