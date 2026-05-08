import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './LogoIcon.png';

const BADGE_DEFS = [
    { id: "first_consult",   icon: "🩺", label: "First consult",   desc: "1st chat with a doctor",  color: "#dbeafe", textColor: "#1d4ed8" },
    { id: "quick_responder", icon: "⚡", label: "Quick responder", desc: "Replied within 5 min",     color: "#dcfce7", textColor: "#15803d" },
    { id: "kind_person",     icon: "❤️", label: "Kind person",     desc: "Left a positive review",   color: "#fce7f3", textColor: "#9d174d" },
    { id: "loyal_patient",   icon: "🏆", label: "Loyal patient",   desc: "5 chats completed",        color: "#fef9c3", textColor: "#854d0e" },
    { id: "top_reviewer",    icon: "⭐", label: "Top reviewer",    desc: "3 reviews submitted",      color: "#fae8ff", textColor: "#7e22ce" },
    { id: "verified_member", icon: "✅", label: "Verified member", desc: "Profile fully set up",     color: "#dcfce7", textColor: "#15803d" },
];

function Dashboard({ isLoggedIn, username, userData, setIsLoggedIn, setUserData, setUsername }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setUsername('');
    localStorage.clear();
    navigate('/');
  };

  const points = userData?.points ?? 0;
  const earnedBadges = userData?.badges || [];

  const badges = BADGE_DEFS.map(b => ({
    ...b,
    earned: earnedBadges.includes(b.id),
    icon: earnedBadges.includes(b.id) ? b.icon : "🔒",
    color: earnedBadges.includes(b.id) ? b.color : "#f1f5f9",
    textColor: earnedBadges.includes(b.id) ? b.textColor : "#94a3b8"
  }));

  const earnedCount = badges.filter(b => b.earned).length;

  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: "#f0f4ff", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
            <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
          </Link>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/login-choice"><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button></Link>
            <Link to="/signup-choice"><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button></Link>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "16px" }}>
          <p style={{ fontSize: "1.2rem", color: "#607593" }}>You need to be logged in to view your profile.</p>
          <Link to="/login-choice">
            <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>Log In</button>
          </Link>
        </div>
      </div>
    );
  }

  if (!userData) {
    return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
          <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
        </Link>
        <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Link to="/post-request"><button style={{ backgroundColor: "#3b82f6", color: "white", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem", whiteSpace: "nowrap" }}>Post a Request</button></Link>
          <Link to="/search"><button style={{ backgroundColor: "#3b82f6", color: "white", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem", whiteSpace: "nowrap" }}>Find a Doctor</button></Link>
          <Link to="/chat"><button style={{ backgroundColor: "#3b82f6", color: "white", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem", whiteSpace: "nowrap" }}>Chats</button></Link>
          <Link to="/symptomchecker"><button style={{ backgroundColor: "#3b82f6", color: "white", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem", whiteSpace: "nowrap" }}>🩺 Symptoms</button></Link>
          <button onClick={handleLogout} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem", whiteSpace: "nowrap" }}>Logout</button>
        </div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: "520px", margin: "40px auto", padding: "0 20px" }}>

        {/* Profile card */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "36px 32px", boxShadow: "0 4px 24px rgba(59,130,246,0.10)", marginBottom: "20px" }}>

          {/* Avatar + name */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ width: "88px", height: "88px", borderRadius: "50%", backgroundColor: "#dbeafe", border: "3px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px auto", boxShadow: "0 4px 12px rgba(59,130,246,0.15)" }}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="#1b4cb6" stroke="none">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1e293b", margin: "0 0 4px 0" }}>
              {userData?.first_name ? `${userData.first_name} ${userData.last_name}` : userData.username}
            </p>
            <p style={{ fontSize: "0.88rem", color: "#94a3b8", margin: 0 }}>{userData?.username}</p>
          </div>

          {/* Info rows */}
          <div style={{ backgroundColor: "#f8fafc", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "500" }}>Location</span>
              <span style={{ fontSize: "0.88rem", fontWeight: "600", color: "#1e293b" }}>{userData?.location || "Not set"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "500" }}>Request Status</span>
              <span style={{ fontSize: "0.88rem", fontWeight: "600", color: "#16a34a", backgroundColor: "#dcfce7", padding: "3px 10px", borderRadius: "20px" }}>Active</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "500" }}>Date of Birth</span>
              <span style={{ fontSize: "0.88rem", fontWeight: "600", color: "#1e293b" }}>{userData?.date_of_birth || "Not set"}</span>
            </div>
          </div>

          {/* Points bar */}
          <div style={{ backgroundColor: "#eff6ff", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "2rem", fontWeight: "800", color: "#1b4cb6" }}>{userData.points}</span>
                <span style={{ fontSize: "0.88rem", color: "#607593" }}>points</span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{earnedCount} / {badges.length} badges</span>
            </div>
            <div style={{ height: "8px", backgroundColor: "#bfdbfe", borderRadius: "99px", overflow: "hidden", marginBottom: "6px" }}>
              <div style={{ height: "100%", width: `${(userData.points / 10) * 100}%`, background: "linear-gradient(90deg, #3b82f6, #1b4cb6)", borderRadius: "99px", transition: "width 0.4s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>0</span>
              <span style={{ fontSize: "0.7rem", color: "#3b82f6", fontWeight: "600" }}>Next reward at 5 pts</span>
              <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>10</span>
            </div>
          </div>

          {/* Badges */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Badges</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {badges.map((badge, i) => (
                <div key={i} style={{ backgroundColor: badge.color, borderRadius: "12px", padding: "12px 8px", textAlign: "center", opacity: badge.earned ? 1 : 0.5 }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: "5px" }}>{badge.icon}</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: "700", color: badge.textColor, marginBottom: "2px" }}>{badge.label}</div>
                  <div style={{ fontSize: "0.62rem", color: badge.textColor, opacity: 0.75 }}>{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/Settings" style={{ textDecoration: "none" }}>
              <button style={{ width: "100%", backgroundColor: "#3b82f6", color: "white", padding: "12px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.95rem" }}>
                Settings
              </button>
            </Link>
            <button onClick={handleLogout}
              style={{ width: "100%", backgroundColor: "white", color: "#ef4444", padding: "12px", borderRadius: "10px", border: "1.5px solid #fca5a5", cursor: "pointer", fontWeight: "600", fontSize: "0.95rem" }}>
              Log Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;