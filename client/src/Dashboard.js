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

  return (
    <div>
      {/* Navbar - EXACT COPY from Home */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
              </Link>
              <div style={{ display: "flex", gap: "10px" }}>
                <Link to="/post-request" style={{ textDecoration: "none" }}>
                  <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
                </Link>
                <Link to="/reviews" style={{ textDecoration: "none" }}>
                  <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Reviews</button>
                </Link>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button>
                </Link>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button>
                </Link>
                <Link to="/chat" style={{ textDecoration: "none" }}>
                  <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Chats</button>
                </Link>
                <Link to="/dashboard" style={{ textDecoration: "none" }}>
                  <button style={{ backgroundColor: "#3b82f6", color: "white" }}>User Profile</button>
                </Link>
              </div>
            </div>

      {/* Profile Section - COPY of About Us section structure */}
      <div style={{ maxWidth: "800px", margin: "auto", padding: "40px 20px" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1b4cb6" }}>Your Profile</p>
          <div style={{ backgroundColor: "#f8fafc", borderRadius: "12px", padding: "40px", marginTop: "20px", textAlign: "left" }}>
            <p style={{ marginBottom: "15px", fontSize: "1.1rem" }}><strong>Username:</strong> {user.username}</p>
            <p style={{ marginBottom: "15px", fontSize: "1.1rem" }}><strong>Email:</strong> {user.email}</p>
            <p style={{ marginBottom: "15px", fontSize: "1.1rem" }}><strong>Request Status:</strong> {user.requestStatus}</p>
            <p style={{ marginBottom: "25px", fontSize: "1.1rem" }}><strong>Points:</strong> {user.points}</p>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button onClick={() => navigate(-1)} style={{ backgroundColor: "#3b82f6", color: "white", padding: "10px 30px", borderRadius: "6px", border: "none", cursor: "pointer" }}>Back</button>
              <Link to="/Settings"><button style={{ backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "10px 30px", borderRadius: "6px", border: "1px solid #ccd9ee", cursor: "pointer" }}>Settings</button></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Add a features-like section if you want more content */}
      <div style={{backgroundColor: "#dbeafe", padding: "40px", textAlign: "center"}}>
        <p style={{fontSize: "2rem", fontWeight: "bold", color: "#1b4cb6"}}>Need help?</p>
        <p style={{ color: "#435e99"}}>Post a new request or browse doctors</p>
        <Link to="/post-request" style={{ textDecoration: "none" }}>
          <button style={{backgroundColor: "#709de6", color: "#41537a", fontSize: "1.5rem", padding: "15px 40px"}}>Post a Request</button>
        </Link>      
      </div>
    </div>
  );
}

export default Dashboard;