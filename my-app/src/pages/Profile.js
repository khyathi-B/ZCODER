import { useNavigate } from 'react-router-dom';
import getUser from '../utils/getUser';
import axios from 'axios';
import { useEffect } from 'react';
export default function Profile() {
  const user = getUser();
  
  const navigate = useNavigate();
  const deleteAccount = async () => {
    const confirm = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
    if (!confirm) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/delete/${user.id}`);
      localStorage.removeItem('user'); // Clear stored login info
      alert('Account deleted.');
      navigate('/login'); // Or homepage
    } catch (err) {
      console.error(err);
      alert('Error deleting account.');
    }
  };

 
  if(!user){
    return (
    <>
    <p>please login</p>
    <button onClick={() => navigate('/login')}>Login</button>
    </>
    )
  }
  else{

  return (
    <div>
      
      <h2>Welcome, {user.username} 👋</h2>

      
      <button style={{backgroundColor:'black', color: 'white', borderRadius:'5px'}} onClick={() => navigate('/bookmarked')}>
        Bookmarked Problems
      </button>
      <button style={{backgroundColor: 'gray', color:'white', borderRadius:'5px'}}onClick={() => navigate('/problems')}>
        Problems
      </button>
      <button style={{backgroundColor:'blue', color: 'white', borderRadius:'5px'}}onClick={() => navigate('/submit-solution')}>
        Submit Solution
      </button>
      <br></br>
      <button style={{backgroundColor:'yellow', color: 'black', borderRadius:'5px'}}onClick={() => navigate('/create-problem')}>
        Create Problem
      </button>
      <br></br>
      <br></br>
      <button style={{backgroundColor: 'cyan',borderRadius:'5px'}}onClick={() => navigate('/saved-solutions')}>
        Submitted Solutions
      </button>
      <button style={{backgroundColor:'green', color:'white', borderRadius:'5px'}}onClick={() => navigate('/live-room')}>
        Live-room
      </button>
      <br></br>
      <br></br>
      <button style={{backgroundColor:'blue', color: 'white', borderRadius:'15px'}}onClick={()=>navigate('/connect')}>Connect</button>
      <br></br>
      <br></br>
      <br></br>
      <button onClick={deleteAccount} style={{ background: 'red', color: 'white' }}>
        Delete Account
      </button>
    </div>


  );
}
}