import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './LogoIcon.png';

function Dashboard() {
  const navigate = useNavigate();

  // Replace with real user data from backend/auth context later
  const [user] = useState({
    username: "Johndoe1",
    email: "johndoe@email.com",
    requestStatus: "Granted",
    points: 3,
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const confirmDelete = () => {
    // TODO: call delete account API here
    setShowConfirm(false);
    navigate('/');
  };

  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", backgroundColor: "#f8fafc" }}>

      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "white", borderBottom: "1px solid #ccd9ee" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={Icon} alt="TreatMe logo" style={{ width: "60px", height: "60px", marginRight: "10px" }} />
          <div style={{ fontSize: "1.5rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Home</button>
          </Link>
          <Link to="/post-request" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
          </Link>
          <Link to="/reviews" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Reviews</button>
          </Link>
          <Link to="/chat" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Chats</button>
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div style={{
        maxWidth: "420px",
        margin: "60px auto",
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "40px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        {/* Avatar */}
        <div style={{
          width: "80px", height: "80px",
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2.2rem", color: "white",
          margin: "0 auto 16px auto"
        }}>
          👤
        </div>

        <p style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#040f25", textDecorationLine: "underline", marginBottom: "24px" }}>
          Your Profile
        </p>

        {/* User info */}
        <div style={{ textAlign: "left", marginBottom: "28px" }}>
          <p style={{ marginBottom: "10px", color: "#040f25" }}>
            <span style={{ color: "#607593" }}>Username: </span>{user.username}
          </p>
          <p style={{ marginBottom: "10px", color: "#040f25" }}>
            <span style={{ color: "#607593" }}>Email: </span>{user.email}
          </p>
          <p style={{ marginBottom: "10px", color: "#040f25" }}>
            <span style={{ color: "#607593" }}>Request Status: </span>{user.requestStatus}
          </p>
          <p style={{ marginBottom: "10px", color: "#040f25" }}>
            <span style={{ color: "#607593" }}>Number of points: </span>{user.points}
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: "100%", backgroundColor: "#3b82f6", color: "white",
              padding: "10px", borderRadius: "6px", border: "none",
              cursor: "pointer", fontWeight: "bold"
            }}>
            Back
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              width: "100%", backgroundColor: "#e53e3e", color: "white",
              padding: "10px", borderRadius: "6px", border: "none",
              cursor: "pointer", fontWeight: "bold"
            }}>
            Delete account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", borderRadius: "12px",
            padding: "30px", maxWidth: "340px", textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
          }}>
            <p style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "10px" }}>Are you sure?</p>
            <p style={{ fontSize: "0.9rem", color: "#607593", marginBottom: "20px" }}>
              This will permanently delete your account. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ backgroundColor: "#3b82f6", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{ backgroundColor: "#e53e3e", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;