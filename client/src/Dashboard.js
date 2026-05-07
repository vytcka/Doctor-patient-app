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
          {/* Points & Badges Section */}
<div style={{ marginBottom: "28px" }}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
    <span style={{ color: "#607593" }}>Points</span>
    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>3 / 10 badges earned</span>
  </div>

  {/* Points bar */}
  <div style={{ backgroundColor: "#f0f4ff", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px" }}>
      <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#1b4cb6" }}>{user.points}</span>
      <span style={{ color: "#607593", fontSize: "0.9rem" }}>points</span>
    </div>
    <div style={{ height: "6px", backgroundColor: "#ccd9ee", borderRadius: "99px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(user.points / 10) * 100}%`, backgroundColor: "#3b82f6", borderRadius: "99px" }} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
      <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>0</span>
      <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Next reward at 5 pts</span>
      <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>10</span>
    </div>
  </div>

  {/* Badges */}
  <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#607593", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>Badges</div>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
    {[
      { icon: "🩺", label: "First consult", desc: "1st chat with a doctor", earned: true, color: "#dbeafe", textColor: "#1d4ed8" },
      { icon: "⚡", label: "Quick responder", desc: "Replied within 5 min", earned: true, color: "#dcfce7", textColor: "#15803d" },
      { icon: "❤️", label: "Kind person", desc: "Left a positive review", earned: true, color: "#fce7f3", textColor: "#9d174d" },
      { icon: "🔒", label: "Loyal patient", desc: "5 chats completed", earned: false, color: "#f1f5f9", textColor: "#94a3b8" },
      { icon: "🔒", label: "Top reviewer", desc: "3 reviews submitted", earned: false, color: "#f1f5f9", textColor: "#94a3b8" },
      { icon: "🔒", label: "Verified member", desc: "Profile fully set up", earned: false, color: "#f1f5f9", textColor: "#94a3b8" },
    ].map((badge, i) => (
      <div key={i} style={{ backgroundColor: badge.color, borderRadius: "10px", padding: "10px 8px", textAlign: "center", opacity: badge.earned ? 1 : 0.55 }}>
        <div style={{ fontSize: "1.4rem", marginBottom: "4px" }}>{badge.icon}</div>
        <div style={{ fontSize: "0.72rem", fontWeight: "bold", color: badge.textColor, marginBottom: "2px" }}>{badge.label}</div>
        <div style={{ fontSize: "0.65rem", color: badge.textColor, opacity: 0.8 }}>{badge.desc}</div>
      </div>
    ))}
  </div>
</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={() => navigate(-1)} style={{ width: "100%", backgroundColor: "#3b82f6", color: "white", padding: "10px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Back</button>
          <Link to="/Settings" style={{ textDecoration: "none" }}>
            <button style={{ width: "100%", backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "10px", borderRadius: "6px", border: "1px solid #ccd9ee", cursor: "pointer", fontWeight: "bold" }}>Settings</button>
          </Link>
          <button 
            onClick={() => {
              navigate('/login-choice');
            }} 
            style={{ width: "100%", backgroundColor: "#f0f4ff", color: "#e53e3e", padding: "10px", borderRadius: "6px", border: "1px solid #e53e3e", cursor: "pointer", fontWeight: "bold" }}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;