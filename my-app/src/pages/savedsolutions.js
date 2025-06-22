import { useEffect, useState } from 'react';
import axios from 'axios';
import getUser from '../utils/getUser';
import { useParams } from 'react-router-dom';

export default function SavedSolutions() {
  const [solutions, setSolutions] = useState([]);
  const user = getUser();
  const { ownerId: paramOwnerId } = useParams(); // URL param: user you're viewing
  const viewerId = user?.id;
  const ownerId = paramOwnerId || viewerId; 

  useEffect(() => {
    console.log("ViewerId:", viewerId);
    console.log("OwnerId:", ownerId);
    if (!viewerId || !ownerId) return;

    axios.get(`http://192.168.29.186:5000/api/users/${viewerId}/solutions/${ownerId}`)
      .then(res => setSolutions(res.data))
      .catch(err => {
        console.error('Fetch error:', err);
        setSolutions([]);
      });
  }, [viewerId, ownerId]);

  const updateVisibility = (solutionId, visibility) => {
    axios.patch(`http://192.168.29.186:5000/api/problems/solution/${solutionId}/visibility`, { visibility })
      .then(() => {
        alert('Visibility updated');
        setSolutions(prev => prev.map(sol =>
          sol._id === solutionId ? { ...sol, visibility } : sol
        ));
      })
      .catch(err => {
        alert('Error updating visibility');
        console.error(err);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{ownerId === viewerId ? 'Your Submitted Solutions' : 'User\'s Shared Solutions'}</h2>
      
      {solutions.length === 0 ? (
        <p>No solutions found.</p>
      ) : (
        solutions.map((sol, index) => (
          <div key={index} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 15 }}>
            <h3>{sol.problemId?.title || 'Unknown Problem'}</h3>
            <p><strong>Visibility:</strong> {sol.visibility}</p>

            {viewerId === ownerId && (
              <select
                value={sol.visibility}
                onChange={(e) => updateVisibility(sol._id, e.target.value)}
              >
                <option value="private">Private</option>
                <option value="peers">Peers</option>
                <option value="public">Public</option>
              </select>
            )}

            <p><b>Language:</b> {sol.language}</p>
            <p><b>Submitted At:</b> {new Date(sol.createdAt).toLocaleString()}</p>

            <pre style={{ background: '#f9f9f9', padding: 10, overflowX: 'auto' }}>
              {sol.code}
            </pre>
          </div>
        ))
      )}
    </div>
  );
}


