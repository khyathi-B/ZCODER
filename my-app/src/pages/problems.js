import { useEffect, useState } from 'react';
import axios from 'axios';
import getUser from '../utils/getUser';
export default function Problems() {
  
  const [problems, setProblems] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  
  const user = JSON.parse(localStorage.getItem('user'));
    
  

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/problems/all`)
      .then(res => {
        setProblems(res.data);

        // Fetch comments for all problems
        res.data.forEach(p => {
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/problems/comments/${p._id}`)
            .then(commentRes => {
              setCommentsMap(prev => ({ ...prev, [p._id]: commentRes.data }));
            });
        });
      });
  }, []);

 if(user){
  const userId = user.id;
  const bookmark = (problemId) => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/problems/bookmark`, {
      userId,
      problemId
    }).then(() => alert('Bookmarked!'));
  };
  const postComment = (problemId) => {
    const text = newComments[problemId];
    if (!text?.trim()) return;

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/problems/add-comment`, {
      problemId,
      userId,
      text
    }).then(() => {
      setCommentsMap(prev => ({
        ...prev,
        [problemId]: [...(prev[problemId] || []), { user: { username: 'you' }, text }]
      }));
      setNewComments(prev => ({ ...prev, [problemId]: '' }));
    });
  };
  

 


  return (
    <div>
      <h2>All Problems</h2>
      {problems.map(p => (
        <div key={p._id} style={{ border: '1px solid black', margin: 10, padding: 10 }}>
          <h4>{p.title}</h4>
          <p>{p.description}</p>
          <button style={{backgroundColor: 'red', color:'white'}}onClick={() => bookmark(p._id)}>Bookmark</button>
          <h3>Comments</h3>
          <textarea
            rows={3}
            value={newComments[p._id] || ''}
            onChange={(e) => setNewComments(prev => ({ ...prev, [p._id]: e.target.value }))}
            placeholder="Write a comment..."
          ></textarea>
          <br />
          <button onClick={() => postComment(p._id)}>Post</button>
          <ul>
            {(commentsMap[p._id] || []).map((c, index) => (
              <li key={index}>
                <b>{c.user?.username || 'Unknown'}:</b> {c.text}
              </li>
            ))}
          </ul>


        </div>
      ))}
    </div>
  );
}
else{
  
}
}