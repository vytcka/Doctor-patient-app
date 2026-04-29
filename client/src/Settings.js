import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './LogoIcon.png';

function Settings() {
  const navigate = useNavigate();

  const [newUsername, setNewUsername] = useState("");
  const [confirmPasswordForUsername, setConfirmPasswordForUsername] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);

  const handleUsernameChange = (e) => {
    e.preventDefault();
    if (!newUsername || !confirmPasswordForUsername) {
      setUsernameMsg("Please fill in all fields.");
      return;
    }
    // TODO: verify password and update via backend
    setUsernameMsg("Username updated successfully!");
    setNewUsername("");
    setConfirmPasswordForUsername("");
    setTimeout(() => setUsernameMsg(""), 2000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordMsg("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters.");
      return;
    }
    // TODO: verify current password and update via backend
    setPasswordMsg("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setTimeout(() => setPasswordMsg(""), 2000);
  };

  const confirmDelete = () => {
    // TODO: call delete account API here
    setShowConfirm(false);
    navigate('/');
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccd9ee",
    fontSize: "0.9rem",
    marginBottom: "10px",
    boxSizing: "border-box"
  };

  const sectionStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "20px"
  };

  return (
    <div>
      {/* Navbar - matches homepage exactly */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={Icon} alt="Description" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
          <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
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
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button>
          </Link>
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button>
          </Link>
          <Link to="/chat" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Chats</button>
          </Link>
        </div>
      </div>

      {/* Settings content */}
      <div style={{ maxWidth: "500px", margin: "30px auto", padding: "0 20px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <button onClick={() => navigate(-1)} style={{
            background: "none", border: "none", fontSize: "1.2rem",
            cursor: "pointer", color: "#1b4cb6"
          }}>⬅️</button>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#040f25", margin: 0 }}>⚙️ Settings</p>
        </div>

        {/* Change Username */}
        <div style={sectionStyle}>
          <p style={{ fontWeight: "bold", color: "#040f25", marginBottom: "16px", fontSize: "1rem" }}>Change Username</p>
          <form onSubmit={handleUsernameChange}>
            <input
              style={inputStyle}
              type="text"
              placeholder="New username"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="Confirm your password"
              value={confirmPasswordForUsername}
              onChange={e => setConfirmPasswordForUsername(e.target.value)}
            />
            {usernameMsg && (
              <p style={{ fontSize: "0.85rem", color: usernameMsg.includes("success") ? "#2f855a" : "#e53e3e", marginBottom: "8px" }}>
                {usernameMsg}
              </p>
            )}
            <button type="submit" style={{
              width: "100%", backgroundColor: "#3b82f6", color: "white",
              padding: "10px", borderRadius: "6px", border: "none",
              cursor: "pointer", fontWeight: "bold"
            }}>
              Save Username
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div style={sectionStyle}>
          <p style={{ fontWeight: "bold", color: "#040f25", marginBottom: "16px", fontSize: "1rem" }}>Change Password</p>
          <form onSubmit={handlePasswordChange}>
            <input
              style={inputStyle}
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
            />
            {passwordMsg && (
              <p style={{ fontSize: "0.85rem", color: passwordMsg.includes("success") ? "#2f855a" : "#e53e3e", marginBottom: "8px" }}>
                {passwordMsg}
              </p>
            )}
            <button type="submit" style={{
              width: "100%", backgroundColor: "#3b82f6", color: "white",
              padding: "10px", borderRadius: "6px", border: "none",
              cursor: "pointer", fontWeight: "bold"
            }}>
              Save Password
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div style={sectionStyle}>
          <p style={{ fontWeight: "bold", color: "#040f25", marginBottom: "8px", fontSize: "1rem" }}>Delete Account</p>
          <p style={{ fontSize: "0.85rem", color: "#607593", marginBottom: "16px" }}>
            Permanently delete your account. This action cannot be undone.
          </p>
          <button onClick={() => setShowConfirm(true)} style={{
            width: "100%", backgroundColor: "#e53e3e", color: "white",
            padding: "10px", borderRadius: "6px", border: "none",
            cursor: "pointer", fontWeight: "bold"
          }}>
            Delete Account
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
              <button onClick={() => setShowConfirm(false)}
                style={{ backgroundColor: "#3b82f6", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                Cancel
              </button>
              <button onClick={confirmDelete}
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

export default Settings;