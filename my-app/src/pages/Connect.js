import { useEffect, useState } from 'react';
import axios from 'axios';
import getUser from '../utils/getUser';

export default function Connect() {
  const [allUsers, setAllUsers] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [connections, setConnections] = useState([]);
  const user = getUser();

  useEffect(() => {
    if (!user||!user.id) return <p>Please login first.</p>;

    // Fetch all users except self
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/peers/all-users`)
      .then(res => setAllUsers(res.data.filter(u => u._id !== user.id)))
      .catch(err => console.error("All Users fetch error:", err));

    // Fetch incoming requests
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/peers/requests/${user.id}`)
      .then(res => setIncoming(res.data))
      .catch(err => console.error("Incoming requests fetch error:", err));

    // Fetch accepted connections
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/peers/connections/${user.id}`)
      .then(res => setConnections(res.data))
      .catch(err => console.error("Connections fetch error:", err));

  }, [user]);

  const sendRequest = (receiverId) => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/peers/send-request`, {
      senderId: user.id,
      receiverId
    }).then(() => alert('Request sent!'))
    .catch(err => {
    if (err.response?.status === 400) {
      alert(err.response.data.message);  // "Request already sent or already connected"
    } else {
      alert("Something went wrong.");
      console.error(err);
    }
  });
  };

  const acceptRequest = (senderId) => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/peers/accept-request`, {
      receiverId: user.id,
      senderId
    }).then(() => {
      alert('Request accepted!');
      setIncoming(incoming.filter(req => req._id !== senderId));
    });
  };
  const rejectRequest = (senderId) => {
  axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/peers/reject-request`, {
    receiverId: user.id,
    senderId
  }).then(() => {
    alert('Request rejected!');
    setIncoming(incoming.filter(req => req._id !== senderId));
  });
};


  return (
    <div style={{ padding: '20px' }}>
      <h2>🔍 Connect with Peers</h2>

      <h3>All Users</h3>
      {allUsers.length === 0 ? <p>No other users found.</p> : (
        <ul>
          {allUsers.map(u => (
            <li key={u._id}>
              {u.username}
              <br></br>
              {connections.some(c => c._id === u._id) ? (
                <button style={{ marginLeft: '10px', backgroundColor: 'blue',color:'white', cursor: 'not-allowed' }} disabled>
                Connected
                </button>
              ) : (
                <button style={{ marginLeft: '10px', backgroundColor: '#28a745', color: 'white' }} onClick={() => sendRequest(u._id)}>
                Send Request
                </button>
              )}
              <a
              href={`/saved-solutions/${u._id}`}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                textDecoration: 'none',
                backgroundColor: '#333',
                color: 'white',
                borderRadius: '5px'
              }}
              >
              View Solutions
              </a>

            </li>
          ))}
        </ul>
      )}

      <h3>Incoming Requests</h3>
      {incoming.length === 0 ? <p>No requests.</p> : (
        <ul>
          {incoming.map(u => (
            <li key={u._id}>
              {u.username}
              <button style={{ marginLeft: '10px', backgroundColor: '#28a745', color: 'white' }} onClick={() => acceptRequest(u._id)}>
                Accept
              </button>
              <button style={{ marginLeft: '10px', backgroundColor: '#dc3545', color: 'white' }} onClick={() => rejectRequest(u._id)}>
                 Reject
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>👥 Your Connections</h3>
      {connections.length === 0 ? <p>No connections yet.</p> : (
        <ul>
          {connections.map(u => (
            <li key={u._id}>{u.username}
            <a
            href={`/saved-solutions/${u._id}`}
            style={{
               marginLeft: '10px',
               padding: '5px 10px',
               textDecoration: 'none',
               backgroundColor: '#4CAF50',
               color: 'white',
               borderRadius: '5px'
            }}
            >
            View Solutions
            </a>
            </li>
          ))}
        </ul>
      )}
      
    </div>
  );
}
