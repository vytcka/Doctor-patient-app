import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Check from "./Check";
import PostRequest from './PostRequest'; 
import Reviews from './Reviews'; 
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Check" element={<Check />} />
        <Route path="/post-request" element={<PostRequest />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/search" element={<Reviews />} />
        <Route path="/doctor/:id" element={<DoctorReview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/login-choice" element={<LoginChoice />} />
        <Route path="/doctorlogin" element={<DoctorLogin />} />
        <Route path="/signup-choice" element={<SignupChoice />} />
        <Route path="/doctorsignup" element={<DoctorSignup />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;