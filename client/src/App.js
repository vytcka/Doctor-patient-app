import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/Check" element={<Check />} />
        <Route path="/post-request" element={<PostRequest isLoggedIn={isLoggedIn} />} />
        <Route path="/search" element={<Search isLoggedIn={isLoggedIn} />} />
        <Route path="/doctor/:id" element={<DoctorReview isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
        <Route path="/chat" element={<Chat isLoggedIn={isLoggedIn} />} />
        <Route path="/Dashboard" element={<Dashboard isLoggedIn={isLoggedIn} />} />
        <Route path="/Settings" element={<Settings isLoggedIn={isLoggedIn} />} />
        <Route path="/login-choice" element={<LoginChoice />} />
        <Route path="/doctorlogin" element={<DoctorLogin setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
        <Route path="/signup-choice" element={<SignupChoice />} />
        <Route path="/doctorsignup" element={<DoctorSignup />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;