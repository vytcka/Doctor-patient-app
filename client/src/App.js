import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./Home";
import Check from "./Check";
import PostRequest from './PostRequest'; 
import Search from './Search'; 
import DoctorReview from "./DoctorReview";
import Login from "./login";
import Signup from "./signup";
import Chat from "./Chat";
import Dashboard from "./Dashboard"; 
import Settings from './Settings';
import LoginChoice from "./LoginChoice";
import DoctorLogin from "./DoctorLogin";
import SignupChoice from "./SignupChoice";
import DoctorSignup from "./DoctorSignup";
import DoctorDashboard from "./DoctorDashboard";
import ModeratorDashboard from './ModeratorDashboard';    
import DoctorProfile from './DoctorProfile';
import SymptomChecker from './SymptomChecker';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')) || null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} userRole={userRole} />} />
        <Route path="/Check" element={<Check />} />
        <Route path="/post-request" element={<PostRequest isLoggedIn={isLoggedIn} />} />
        <Route path="/search" element={<Search isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} setUsername={setUsername} setUserData={setUserData} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
        <Route path="/chat" element={<Chat isLoggedIn={isLoggedIn} userData={userData} />} />
        <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn} username={username} userData={userData} setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} setUsername={setUsername}/>} />
        <Route path="/Settings" element={<Settings isLoggedIn={isLoggedIn} />} />
        <Route path="/login-choice" element={<LoginChoice />} />
<Route path="/doctorlogin" element={
    <DoctorLogin setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole}setUserData={setUserData}setUsername={setUsername}/>} />
        <Route path="/signup-choice" element={<SignupChoice />} />
        <Route path="/doctorsignup" element={<DoctorSignup />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard isLoggedIn={isLoggedIn} userData={userData} setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} setUsername={setUsername} />} />
        <Route path="/moderator/dashboard" element={<ModeratorDashboard />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/symptomchecker" element={<SymptomChecker isLoggedIn={isLoggedIn} />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;