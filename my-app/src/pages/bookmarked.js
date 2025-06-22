import { useEffect, useState } from 'react';
import axios from 'axios';
import getUser from '../utils/getUser';

export default function Bookmarked() {
  const [bookmarks, setBookmarks] = useState([]);
  const user = getUser();
  const userId = user?.id;
  
  useEffect(() => {
    if (!userId) return;
    axios.get(`http://192.168.29.186:5000/api/users/${user.id}/bookmarks`)
      .then(res => setBookmarks(res.data));
      
  }, [user]);

  return (
    <div>
      <h2>Your Bookmarked Problems</h2>
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        bookmarks.map(problem => (
          <div key={problem._id} style={{ border: '1px solid gray', padding: 10, margin: 10 }}>
            <h3>{problem.title}</h3>
            <p>{problem.description}</p>
            <p><b>Tags:</b> {problem.tags.join(', ')}</p>
          </div>
        ))
      )}
    </div>
  );
}
