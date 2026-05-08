import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './LogoIcon.png';

function Settings({ isLoggedIn, userData, setIsLoggedIn, setUserData, setUsername }) {
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
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");

  const handleUsernameChange = (e) => {
    e.preventDefault();
    if (!newUsername || !confirmPasswordForUsername) { setUsernameMsg("Please fill in all fields."); return; }
    setUsernameMsg("Username updated successfully!");
    setNewUsername(""); setConfirmPasswordForUsername("");
    setTimeout(() => setUsernameMsg(""), 2000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) { setPasswordMsg("Please fill in all fields."); return; }
    if (newPassword !== confirmNewPassword) { setPasswordMsg("New passwords do not match."); return; }
    const response = await fetch("http://127.0.0.1:5000/change-password", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Username": userData?.username || ""
      },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
    const data = await response.json();
    setPasswordMsg(data.status === 200 ? "Password updated successfully!" : data.message);
  };

  const confirmDelete = async () => {
    if (!deletePassword) {
      setDeleteMsg("Please enter your password.");
      return;
    }
    const response = await fetch("http://127.0.0.1:5000/delete_account", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Username": userData?.username || ""
      },
      body: JSON.stringify({ password: deletePassword })
    });
    const data = await response.json();
    if (data.status === 200) {
      setIsLoggedIn(false);
      setUserData(null);
      setUsername('');
      localStorage.clear();
      navigate('/');
    } else {
      setDeleteMsg(data.message);
    }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.9rem", marginBottom: "12px", boxSizing: "border-box", outline: "none" };
  const saveBtnStyle = { backgroundColor: "#3b82f6", color: "white", padding: "10px 28px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "0.95rem" };
  const sidebarItems = [
    { id: 'account', label: 'Account', desc: 'Change your username' },
    { id: 'security', label: 'Security', desc: 'Update your password' },
    { id: 'delete', label: 'Delete Account', desc: 'Permanently remove account' },
  ];

  const navStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 40px", height: "68px", backgroundColor: "white", borderBottom: "1px solid #e8edf5", boxShadow: "0 1px 8px rgba(27,75,182,0.06)", position: "sticky", top: 0, zIndex: 100 };

  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: "#f0f4ff", minHeight: "100vh" }}>
        <div style={navStyle}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: "10px" }}>
            <img src={Icon} alt="Logo" style={{ width: "44px", height: "44px" }} />
            <span style={{ fontSize: "1.4rem", color: "#1b4cb6", fontWeight: "800" }}>TreatMe</span>
          </Link>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link to="/login-choice"><button style={{ border: "1.5px solid #c7d9f5", background: "white", color: "#1b4cb6", borderRadius: "50px", padding: "9px 20px", fontSize: "0.88rem", fontWeight: "600", cursor: "pointer" }}>Log In</button></Link>
            <Link to="/signup-choice"><button style={{ backgroundColor: "#1b4cb6", color: "white", border: "none", borderRadius: "50px", padding: "10px 22px", fontSize: "0.88rem", fontWeight: "700", cursor: "pointer" }}>Sign Up</button></Link>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "16px" }}>
          <p style={{ fontSize: "1.2rem", color: "#607593" }}>You need to be logged in to access settings.</p>
          <Link to="/login-choice">
            <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Log In</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f0f4ff", minHeight: "100vh" }}>
      <div style={navStyle}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: "10px" }}>
          <img src={Icon} alt="Logo" style={{ width: "44px", height: "44px" }} />
          <span style={{ fontSize: "1.4rem", color: "#1b4cb6", fontWeight: "800" }}>TreatMe</span>
        </Link>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Link to="/post-request"><button style={{ background: "none", border: "none", color: "#334155", fontWeight: "500", fontSize: "0.9rem", padding: "8px 14px", cursor: "pointer" }}>Post a Request</button></Link>
          <Link to="/search"><button style={{ background: "none", border: "none", color: "#334155", fontWeight: "500", fontSize: "0.9rem", padding: "8px 14px", cursor: "pointer" }}>Find a Doctor</button></Link>
          <Link to="/chat"><button style={{ background: "none", border: "none", color: "#334155", fontWeight: "500", fontSize: "0.9rem", padding: "8px 14px", cursor: "pointer" }}>Chats</button></Link>
          <Link to="/dashboard"><button style={{ backgroundColor: "#1b4cb6", color: "white", border: "none", borderRadius: "50px", padding: "10px 22px", fontSize: "0.88rem", fontWeight: "700", cursor: "pointer" }}>My Profile</button></Link>
        </div>
      </div>

      <div style={{ display: "flex", maxWidth: "900px", margin: "30px auto", padding: "0 20px", gap: "24px" }}>
        {/* Sidebar */}
        <div style={{ width: "220px", flexShrink: 0 }}>
          <p style={{ fontWeight: "bold", fontSize: "1.3rem", color: "#1e293b", marginBottom: "16px" }}>Settings</p>
          {sidebarItems.map(item => (
            <div key={item.id} onClick={() => setActiveSection(item.id)}
              style={{ padding: "14px 16px", borderRadius: "8px", cursor: "pointer", backgroundColor: activeSection === item.id ? "#eff6ff" : "transparent", borderLeft: activeSection === item.id ? "3px solid #3b82f6" : "3px solid transparent", marginBottom: "4px" }}>
              <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem", color: activeSection === item.id ? "#1b4cb6" : "#1e293b" }}>{item.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>{item.desc}</p>
            </div>
          ))}
          <div style={{ marginTop: "16px" }}>
            <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "0.9rem", fontWeight: "600", padding: 0 }}>Back</button>
          </div>
        </div>

        {/* Main content */}
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

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "30px", maxWidth: "340px", width: "90%", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            <p style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "10px" }}>Are you sure?</p>
            <p style={{ fontSize: "0.9rem", color: "#607593", marginBottom: "16px" }}>This will permanently delete your account. This action cannot be undone.</p>
            <input
              type="password"
              placeholder="Enter your password to confirm"
              value={deletePassword}
              onChange={e => setDeletePassword(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "12px", boxSizing: "border-box", fontSize: "0.9rem" }}
            />
            {deleteMsg && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "12px" }}>{deleteMsg}</p>}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => { setShowConfirm(false); setDeletePassword(""); setDeleteMsg(""); }}
                style={{ backgroundColor: "white", color: "#374151", padding: "8px 20px", borderRadius: "6px", border: "1px solid #e2e8f0", cursor: "pointer", fontWeight: "bold" }}>Cancel</button>
              <button onClick={confirmDelete}
                style={{ backgroundColor: "#ef4444", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;