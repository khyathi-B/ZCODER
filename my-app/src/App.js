//import logo from './logo.svg';
//import './App.css';

// In React (e.g., App.js or any component)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/signup';
import Login from './pages/login';
import Profile from './pages/Profile';
import Problems from './pages/problems';
import Bookmarked from './pages/bookmarked';
import SolutionEditor from './pages/solutionEditor';
import SavedSolutions from './pages/savedsolutions';
import Register from './pages/Register';
import getUser from './utils/getUser';
import LiveRoom from './pages/LiveRoom';
import CreateProblem from './pages/CreateProblem';
import Connect from './pages/Connect';
import SharedSolutions from './pages/savedsolutions';
import { useNavigate } from 'react-router-dom';
function App() {
   const user = getUser();
   const isRoot=window.location.pathname == '/';
   const shouldshowLogin = isRoot && !user;
   const shouldshowprofile = isRoot && user;
  return (
    <>
    <div>
      {user && (
        <button onClick={() => {
          localStorage.clear();
          window.location.href = '/login'; 
        }}>
          Logout
        </button>
      )}
      {shouldshowLogin&&(
        <div >
          <button onClick={()=>{window.location.href = '/login'; }}>Login</button>
          <button onClick={()=>{window.location.href = '/signup'; }}>SignUp</button>
        </div>
      )}
      {shouldshowprofile && (
        <div>
          <button onClick={()=>{window.location.href = '/profile'; }}>Profile</button>
        </div>
      )}
      
      <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/bookmarked" element={<Bookmarked />} />
        <Route path="/submit-solution" element={<SolutionEditor />} />
        <Route path="/saved-solutions/" element={<SavedSolutions />} />
         <Route path="/saved-solutions/:ownerId" element={<SharedSolutions />} />
        <Route path="/register" element={<Register />} />
        <Route path="/live-room" element={<LiveRoom />} />
        <Route path="/create-problem" element={<CreateProblem />} />
        <Route path="/connect" element={<Connect/>} />
        

      </Routes>
    </BrowserRouter>
    
    </div>
    
    </>
  );
}

export default App;
