import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './LogoIcon.png';

function Settings() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');

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
    if (!newUsername || !confirmPasswordForUsername) { setUsernameMsg("Please fill in all fields."); return; }
    setUsernameMsg("Username updated successfully!");
    setNewUsername(""); setConfirmPasswordForUsername("");
    setTimeout(() => setUsernameMsg(""), 2000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) { setPasswordMsg("Please fill in all fields."); return; }
    if (newPassword !== confirmNewPassword) { setPasswordMsg("New passwords do not match."); return; }
    if (newPassword.length < 6) { setPasswordMsg("Password must be at least 6 characters."); return; }
    setPasswordMsg("Password updated successfully!");
    setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
    setTimeout(() => setPasswordMsg(""), 2000);
  };

  const confirmDelete = () => { setShowConfirm(false); navigate('/'); };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.9rem", marginBottom: "12px", boxSizing: "border-box", outline: "none" };
  const saveBtnStyle = { backgroundColor: "#3b82f6", color: "white", padding: "10px 28px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "0.95rem" };

  const sidebarItems = [
    { id: 'account', label: 'Account', desc: 'Change your username' },
    { id: 'security', label: 'Security', desc: 'Update your password' },
    { id: 'delete', label: 'Delete Account', desc: 'Permanently remove account' },
  ];

  return (
    <div>
      {/* Navbar with clickable logo - Home button removed */}
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

      {/* Two column layout */}
      <div style={{ display: "flex", maxWidth: "900px", margin: "30px auto", padding: "0 20px", gap: "24px" }}>

        {/* Left sidebar */}
        <div style={{ width: "220px", flexShrink: 0 }}>
          <p style={{ fontWeight: "bold", fontSize: "1.3rem", color: "#1e293b", marginBottom: "16px" }}>Settings</p>
          {sidebarItems.map(item => (
            <div key={item.id} onClick={() => setActiveSection(item.id)} style={{ padding: "14px 16px", borderRadius: "8px", cursor: "pointer", backgroundColor: activeSection === item.id ? "#eff6ff" : "transparent", borderLeft: activeSection === item.id ? "3px solid #3b82f6" : "3px solid transparent", marginBottom: "4px" }}>
              <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem", color: activeSection === item.id ? "#1b4cb6" : "#1e293b" }}>{item.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>{item.desc}</p>
            </div>
          ))}
          <div style={{ marginTop: "16px" }}>
            <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "0.9rem", fontWeight: "600", padding: 0 }}>⬅️ Back</button>
          </div>
        </div>

        {/* Right content */}
        <div style={{ flex: 1, backgroundColor: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>

          {activeSection === 'account' && (
            <div>
              <p style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#1e293b", marginBottom: "4px" }}>Account</p>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "24px" }}>Update your username</p>
              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", marginBottom: "24px" }} />
              <form onSubmit={handleUsernameChange}>
                <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>New Username</label>
                <input style={inputStyle} type="text" placeholder="Enter new username" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
                <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Confirm Password</label>
                <input style={inputStyle} type="password" placeholder="Enter your current password" value={confirmPasswordForUsername} onChange={e => setConfirmPasswordForUsername(e.target.value)} />
                {usernameMsg && <p style={{ fontSize: "0.85rem", color: usernameMsg.includes("success") ? "#16a34a" : "#dc2626", marginBottom: "12px" }}>{usernameMsg}</p>}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                  <button type="button" onClick={() => { setNewUsername(""); setConfirmPasswordForUsername(""); }} style={{ backgroundColor: "white", color: "#374151", padding: "10px 24px", borderRadius: "6px", border: "1px solid #e2e8f0", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" style={saveBtnStyle}>Save</button>
                </div>
              </form>
            </div>
          )}

          {activeSection === 'security' && (
            <div>
              <p style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#1e293b", marginBottom: "4px" }}>Security</p>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "24px" }}>Update your password</p>
              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", marginBottom: "24px" }} />
              <form onSubmit={handlePasswordChange}>
                <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Current Password</label>
                <input style={inputStyle} type="password" placeholder="Enter current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>New Password</label>
                <input style={inputStyle} type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Confirm New Password</label>
                <input style={inputStyle} type="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                {passwordMsg && <p style={{ fontSize: "0.85rem", color: passwordMsg.includes("success") ? "#16a34a" : "#dc2626", marginBottom: "12px" }}>{passwordMsg}</p>}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                  <button type="button" onClick={() => { setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword(""); }} style={{ backgroundColor: "white", color: "#374151", padding: "10px 24px", borderRadius: "6px", border: "1px solid #e2e8f0", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" style={saveBtnStyle}>Save</button>
                </div>
              </form>
            </div>
          )}

          {activeSection === 'delete' && (
            <div>
              <p style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#1e293b", marginBottom: "4px" }}>Delete Account</p>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "24px" }}>Permanently remove your account</p>
              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", marginBottom: "24px" }} />
              <p style={{ fontSize: "0.9rem", color: "#374151", marginBottom: "24px" }}>Once you delete your account, there is no going back. Please be certain before proceeding.</p>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => setShowConfirm(true)} style={{ backgroundColor: "#ef4444", color: "white", padding: "10px 24px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "30px", maxWidth: "340px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            <p style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "10px" }}>Are you sure?</p>
            <p style={{ fontSize: "0.9rem", color: "#607593", marginBottom: "20px" }}>This will permanently delete your account. This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setShowConfirm(false)} style={{ backgroundColor: "white", color: "#374151", padding: "8px 20px", borderRadius: "6px", border: "1px solid #e2e8f0", cursor: "pointer", fontWeight: "bold" }}>Cancel</button>
              <button onClick={confirmDelete} style={{ backgroundColor: "#ef4444", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;