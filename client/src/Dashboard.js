import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './LogoIcon.png';

function Dashboard({ isLoggedIn }) {
  const navigate = useNavigate();

  // User profile data (currently hardcoded for demo)
  const [user] = useState({
    username: "Johndoe1",
    email: "johndoe@email.com",
    requestStatus: "Granted",
    points: 3,
  });

  // Redirect to login if user is not authenticated
  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
            <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
          </Link>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/login-choice" style={{ textDecoration: "none" }}>
              <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button>
            </Link>
            <Link to="/signup-choice" style={{ textDecoration: "none" }}>
              <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button>
            </Link>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "16px" }}>
          <p style={{ fontSize: "1.2rem", color: "#607593" }}>You need to be logged in to view your profile.</p>
          <Link to="/login-choice">
            <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
              Log In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Navigation bar with app logo and action buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
          <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
        </Link>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/post-request" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
          </Link>
          <Link to="/search" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Find a Doctor</button>
          </Link>
          <Link to="/chat" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Chats</button>
          </Link>
        </div>
      </div>

      {/* User profile information card */}
      <div style={{ maxWidth: "420px", margin: "40px auto", backgroundColor: "white", borderRadius: "12px", padding: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem", color: "white", margin: "0 auto 16px auto" }}>
          👤
        </div>
        <p style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#040f25", textDecorationLine: "underline", marginBottom: "24px" }}>Your Profile</p>
        <div style={{ textAlign: "left", marginBottom: "28px" }}>
          <p style={{ marginBottom: "10px", color: "#040f25" }}><span style={{ color: "#607593" }}>Username: </span>{user.username}</p>
          <p style={{ marginBottom: "10px", color: "#040f25" }}><span style={{ color: "#607593" }}>Email: </span>{user.email}</p>
          <p style={{ marginBottom: "10px", color: "#040f25" }}><span style={{ color: "#607593" }}>Request Status: </span>{user.requestStatus}</p>
          <p style={{ marginBottom: "10px", color: "#040f25" }}><span style={{ color: "#607593" }}>Number of points: </span>{user.points}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={() => navigate(-1)} style={{ width: "100%", backgroundColor: "#3b82f6", color: "white", padding: "10px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Back</button>
          <Link to="/Settings" style={{ textDecoration: "none" }}>
            <button style={{ width: "100%", backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "10px", borderRadius: "6px", border: "1px solid #ccd9ee", cursor: "pointer", fontWeight: "bold" }}>Settings</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;