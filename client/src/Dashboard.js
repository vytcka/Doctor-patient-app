import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './LogoIcon.png';

function Dashboard() {
  const navigate = useNavigate();

  const [user] = useState({
    username: "Johndoe1",
    email: "johndoe@email.com",
    requestStatus: "Granted",
    points: 3,
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const confirmDelete = () => {
    setShowConfirm(false);
    navigate('/');
  };

  return (
    <div>
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
          <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
        </Link>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Home button REMOVED */}
          <Link to="/post-request" style={{ textDecoration: "none" }}><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button></Link>
          <Link to="/reviews" style={{ textDecoration: "none" }}><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Reviews</button></Link>
          <Link to="/login" style={{ textDecoration: "none" }}><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button></Link>
          <Link to="/signup" style={{ textDecoration: "none" }}><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button></Link>
          <Link to="/chat" style={{ textDecoration: "none" }}><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Chats</button></Link>
          <Link to="/dashboard" style={{ textDecoration: "none" }}><button style={{ backgroundColor: "#3b82f6", color: "white" }}>User Profile</button></Link>
        </div>
      </div>

      {/* Profile Card */}
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
          <Link to="/settings" style={{ textDecoration: "none" }}>
            <button style={{ width: "100%", backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "10px", borderRadius: "6px", border: "1px solid #ccd9ee", cursor: "pointer", fontWeight: "bold" }}>Settings</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;