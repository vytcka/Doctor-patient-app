import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Check from "./Check";
import PostRequest from './PostRequest'; 
import Reviews from './Reviews'; 
import DoctorDetail from "./DoctorDetail";
import Login from "./login";
import Signup from "./signup";
import Chat from "./Chat";
import UserDashboard from "./UserDashboard";
import LoginChoice from "./LoginChoice";
import DoctorLogin from "./DoctorLogin";
import SignupChoice from "./SignupChoice";
import DoctorSignup from "./DoctorSignup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Check" element={<Check />} />
        <Route path="/post-request" element={<PostRequest />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/doctor/:id" element={<DoctorDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/login-choice" element={<LoginChoice />} />
        <Route path="/doctorlogin" element={<DoctorLogin />} />
        <Route path="/signup-choice" element={<SignupChoice />} />
        <Route path="/doctorsignup" element={<DoctorSignup />} />

      </Routes>

    </BrowserRouter>
  );
}


export default App;